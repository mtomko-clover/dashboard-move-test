#!/home/rachel/virtualenvs/devprog/bin/python

from __future__ import print_function
import logging
import os
import sys

import pandas as pd

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
import utils
from configure_logger import configure_logger
from pulls import pull_first_party_ids, pull_app_subscription_ids

from config import DATASCIENCE_DIR
sys.path.append(DATASCIENCE_DIR)
from services.db import Db

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def pull_most_popular_devs(db, dids_to_exclude, asids_to_include=None):
    """
    Returns:
        list of lists
    """
    query = """
        SELECT d.name, d.uuid, d.id, sum(if(ma.deleted_time IS NOT NULL, 0, 1)) AS C
        FROM merchant_app ma
        INNER JOIN merchant m ON merchant_id = m.id
        INNER JOIN merchant_gateway g ON ma.merchant_id = g.merchant_id
        INNER JOIN developer_app da ON ma.app_id = da.id
        INNER JOIN developer d ON da.developer_id = d.id
        WHERE g.payment_processor_id != 3
        AND m.infolease_suppress_billing != 1
        AND d.id NOT IN ({dids_to_exclude})
        """ \
        .format(dids_to_exclude=str(dids_to_exclude)[1:-1])

    if asids_to_include:
        query += """
        AND ma.app_subscription_id IN ({asids_to_include})
        """ \
        .format(asids_to_include=str(asids_to_include)[1:-1])

    query += """
    GROUP BY d.id
    ORDER BY C DESC
    LIMIT 25
    """
    logger.debug(query)
    df = pd.read_sql(query, con=db.conn)
    logger.debug(df)
    lst = df.values.tolist()
    logger.debug(lst)
    return lst


def update_dev_leaderboard(db, country_code):
    spreadsheet_title = "[DA-174] Most Popular Devs"
    first_party_ids = pull_first_party_ids(prod_us)
    
    # ALL DEVS
    worksheet_title = "Most Popular Devs US (Paid & Free)"
    logger.debug("Pulling most popular devs in US...")
    most_pop_devs = pull_most_popular_devs(db=prod_us,
                                           dids_to_exclude=first_party_ids,
                                           asids_to_include=pull_app_subscription_ids(prod_us, country_code))
    logger.info("Pulled most popular devs in US.")
    utils.clear_sheet_and_write(spreadsheet_title=spreadsheet_title,
                                worksheet_title=worksheet_title,
                                rows=most_pop_devs,
                                env=country_code)
    
    # FREE DEVS
    worksheet_title = "Most Popular Devs US (Free)"
    logger.debug("Pulling most popular free devs in US...")
    most_pop_devs = pull_most_popular_devs(db=prod_us,
                                           dids_to_exclude=first_party_ids,
                                           asids_to_include=pull_app_subscription_ids(prod_us, country_code, "FREE"))
    logger.info("Pulled most popular free devs in US.")
    utils.clear_sheet_and_write(spreadsheet_title=spreadsheet_title,
                                worksheet_title=worksheet_title,
                                rows=most_pop_devs,
                                env=country_code)

    # PAID DEVS
    worksheet_title = "Most Popular Devs US (Paid)"
    logger.debug("Pulling most popular paid devs in US...")
    most_pop_devs = pull_most_popular_devs(db=prod_us,
                                           dids_to_exclude=first_party_ids,
                                           asids_to_include=pull_app_subscription_ids(prod_us, country_code, "PAID"))
    logger.info("Pulled most popular free devs in US.")
    utils.clear_sheet_and_write(spreadsheet_title=spreadsheet_title,
                                worksheet_title=worksheet_title,
                                rows=most_pop_devs,
                                env=country_code)
    return

################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    logger.info("Starting {filename}...".format(filename=filename))
    try:
        prod_us = Db("~/.clover/p801.cfg")
        country_code = "US"
        update_dev_leaderboard(prod_us, country_code)
        prod_us.close()
        logger.info("Finished {filename}.".format(filename=filename))
    except Exception as err:
        logger.exception(err)
        utils.phone_home(filename, sys.exc_info())