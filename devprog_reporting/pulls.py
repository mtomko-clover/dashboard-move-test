import logging
import os
import sys

import pandas as pd

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
from configure_logger import configure_logger

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def pull_apps_data(db, ids_to_exclude=None):
    """Connect to databse and return dataframe of timestamp and status fields for apps."""

    query = """
        SELECT
            da.id,
            da.uuid,
            da.approval_status_modified_time,
            da.deleted_time,
            da.modified_time,
            da.first_published_time,
            da.first_approval_time,
            da.approval_status
        FROM developer_app AS da
        """

    if ids_to_exclude:
        query += """WHERE da.developer_id NOT IN (""" + str(ids_to_exclude)[1:-1] + """)"""

    df = pd.read_sql(query, con=db.conn)
    return df


def pull_devs_data(db, ids_to_exclude=None):
    """Connect to databse and return dataframe of timestamp and status fields for devs."""

    query = """
        SELECT
            d.id,
            d.uuid,
            d.created_time,
            d.modified_time,
            d.approval_status,
            d.collection_approval_status,
            d.billing_status
        FROM developer AS d
        """

    if ids_to_exclude:
        query += """WHERE d.id NOT IN (""" + str(ids_to_exclude)[1:-1] + """)"""

    df = pd.read_sql(query, con=db.conn)

    # Many older developer accounts have created_time = '0000-00-00 00:00:00'.
    # Give them a created_date so that they can be selected by our comparison.
    df['created_time'].fillna(value=pd.Timestamp('2010-01-01'), inplace=True)
    return df


def pull_first_party_ids(db):
    """Connect to database and return list of Clover and 2p developer ids."""
    logger.debug("Pulling first party developer IDs...")
    query = """
        SELECT d.id AS dev_id
        FROM developer AS d
        JOIN account AS a
            ON a.id = d.owner_account_id
        WHERE
            a.email LIKE '%clover.com' OR
            a.email LIKE '%firstdata.com' OR
            a.email LIKE '%perka.com' OR
            a.email LIKE '%gyft.com' OR
            a.email LIKE '%trubeacon.com' OR
            a.email LIKE '%spreecommerce.com' OR
            a.email LIKE '%pnc.com' OR
            a.email LIKE '%wellsfargo.com' OR
            a.email LIKE '%bankofamerica%'
        """
    logger.debug(query)
    df = pd.read_sql(query, con=db.conn)
    logger.debug(df)
    df.dev_id = df['dev_id'].astype(int)
    first_party_ids = df['dev_id'].values.tolist()
    logger.debug("Pulled first party developer IDs.")
    logger.debug(first_party_ids)
    return first_party_ids


def pull_semi_devs(db, ids_to_exclude=None):
    query = """
        SELECT
            DISTINCT da.developer_id,
            d.uuid,
            d.created_time,
            d.modified_time,
            d.approval_status,
            d.collection_approval_status,
            d.billing_status
        FROM developer AS d
        JOIN developer_app AS da
            ON d.id = da.developer_id
        WHERE
            da.application_id IS NOT NULL AND
            da.application_id != '' AND
            da.name NOT LIKE '%test%'
        """

    if ids_to_exclude:
        query += """AND da.developer_id NOT IN (""" + str(ids_to_exclude)[1:-1] + """)"""

    df = pd.read_sql(query, con=db.conn)
    df['created_time'].fillna(value=pd.Timestamp('2010-01-01'), inplace=True)
    return df


def pull_app_subscription_ids(db, country_code, free_or_paid=None):
    query = """
        SELECT app_subscription_id
        FROM app_subscription_country
        WHERE country = "{country_code}"
        AND deleted_time IS NULL
        AND active = 1
        """ \
        .format(country_code=country_code)
    if free_or_paid in ("FREE", "free"):
        query += """
        AND amount = 0
        """
    elif free_or_paid in ("PAID", "paid"):
        query += """
        AND amount > 0
        """
    logger.debug(query)
    df = pd.read_sql(query, con=db.conn)
    logger.debug(df)
    df.app_subscription_id = df['app_subscription_id'].astype(int)
    app_sub_ids = df['app_subscription_id'].values.tolist()
    logger.debug(app_sub_ids)
    return app_sub_ids
