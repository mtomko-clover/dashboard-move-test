#!/home/rachel/virtualenvs/devprog/bin/python
# coding: utf-8

from __future__ import print_function
import datetime
import logging
import os
import sys
from collections import defaultdict, OrderedDict

import pandas as pd
from dateutil.relativedelta import relativedelta
from pypika import MySQLQuery, Table, Order, functions as fn

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')) + '/devprog_reporting'))
from environ import Environ, EnvironType

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')) + '/utilities'))
from configure_logger import configure_logger
from utils import phone_home

from config import DATASCIENCE_DIR
sys.path.append(DATASCIENCE_DIR)
from services.db import Db
from services.geckoboard import NumberAndSecondaryStat, Rag

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def create_query_apps_submitted_since(date="2018-10-01",  # Existing prod-us apps were backfilled with 2018-10-30 (eu 2018-10-31)
                                      approval_statuses=["NEW", "PENDING", "APPROVED", "PUBLISHED", "DENIED"]):
    developer_app = Table("developer_app")
    developer = Table("developer")

    q = MySQLQuery.from_(
        developer_app
    ).join(
        developer
    ).on(
        developer.id == developer_app.developer_id
    ).select(
        developer_app.id,
        developer_app.name,
        developer.name,
        developer_app.first_submitted_time,
        developer_app.approval_status
    ).where(
        developer.name != "Clover"
    ).where(
        (developer_app.approval_status.isin(approval_statuses)) &
        (developer_app.deleted_time.isnull()) &
        (developer_app.first_submitted_time.notnull())
    ).where(
        developer_app.first_submitted_time >= fn.Date(date)
    ).orderby(developer_app.first_submitted_time, order=Order.asc)

    logger.debug(q)
    query = q.get_sql()
    return query


def create_query_apps_approved_since(date="2014-01-01"):  # Existing prod-us apps were backfilled with 2014-06-25 (eu 2014-01-01)
    developer_app = Table("developer_app")
    developer = Table("developer")

    q = MySQLQuery.from_(
        developer_app
    ).join(
        developer
    ).on(
        developer.id == developer_app.developer_id
    ).select(
        developer_app.id,
        developer_app.name,
        developer.name,
        developer_app.first_submitted_time,
        developer_app.first_approval_time,
        developer_app.approval_status
    ).where(
        developer.name != "Clover"
    ).where(
        (developer_app.deleted_time.isnull()) &
        (developer_app.first_approval_time.notnull())
    ).where(
        developer_app.first_approval_time >= fn.Date(date)
    ).orderby(developer_app.first_approval_time, order=Order.asc)

    logger.debug(q)
    query = q.get_sql()
    return query


def create_query_apps_published_since(date="2014-04-01"):
    developer_app = Table("developer_app")
    developer = Table("developer")

    q = MySQLQuery.from_(
        developer_app
    ).join(
        developer
    ).on(
        developer.id == developer_app.developer_id
    ).select(
        developer_app.id,
        developer_app.name,
        developer.name,
        developer_app.first_submitted_time,
        developer_app.first_approval_time,
        developer_app.first_published_time,
        developer_app.approval_status
    ).where(
        developer.name != "Clover"
    ).where(
        (developer_app.deleted_time.isnull()) &
        (developer_app.first_published_time.notnull())
    ).where(
        developer_app.first_published_time >= fn.Date(date)
    ).orderby(developer_app.first_published_time, order=Order.asc)

    logger.debug(q)
    query = q.get_sql()
    return query


def create_query_devs_submitted_since(date="2013-08-01",  # Earliest prod-us 3p dev submitted 2013-08-01 (eu 2014-03-19)
                                      approval_statuses=["NEW", "PENDING", "APPROVED", "DENIED"]):
    developer = Table("developer")
    account = Table("account")

    q = MySQLQuery.from_(
        developer
    ).join(
        account
    ).on(
        developer.owner_account_id == account.id
    ).select(
        developer.id,
        developer.name,
        developer.first_submitted_time,
        developer.approval_status
    ).where(
        account.email.not_like('%clover.com')
    ).where(
        developer.name != "Clover"
    ).where(
        (developer.approval_status.isin(approval_statuses)) &
        (developer.first_submitted_time.notnull())
    ).where(
        developer.first_submitted_time >= fn.Date(date)
    ).orderby(developer.first_submitted_time, order=Order.asc)

    logger.debug(q)
    query = q.get_sql()
    return query


def create_query_devs_approved_since(date="2013-08-01"):  # Earliest 3p prod-us dev approved 2013-08-01 (eu 2014-03-19)
    developer = Table("developer")
    account = Table("account")

    q = MySQLQuery.from_(developer).join(
        account
    ).on(
        developer.owner_account_id == account.id
    ).select(
        developer.id,
        developer.name,
        developer.first_submitted_time,
        developer.first_approval_time,
        developer.approval_status
    ).where(
        account.email.not_like('%clover.com')
    ).where(
        developer.name != "Clover"
    ).where(
        (developer.first_approval_time.notnull())
    ).where(
        developer.first_approval_time >= fn.Date(date)
    ).orderby(developer.first_approval_time, order=Order.asc)

    logger.debug(q)
    query = q.get_sql()
    return query


def days_since(x):
    current = datetime.datetime.utcnow()
    diff = current - x
    return diff.days


def update_days_pending_rags(environs):
    pending_apps_rag = Rag("~/.clover/geckoboard/amo/apps_days_pending_rag.cfg")
    pending_apps_query = create_query_apps_submitted_since(approval_statuses=["PENDING"])
    pending_devs_rag = Rag("~/.clover/geckoboard/amo/devs_days_pending_rag.cfg")
    pending_devs_query = create_query_devs_submitted_since(approval_statuses=["PENDING"])

    rags = OrderedDict([
        (pending_apps_rag, pending_apps_query),
        (pending_devs_rag, pending_devs_query)
    ])

    bad_threshold = 90
    good_threshold = 30
    days_pending_bad_title = "{bad_threshold}+ Days".format(bad_threshold=bad_threshold)
    days_pending_ok_title = "<{bad_threshold} Days".format(bad_threshold=bad_threshold)
    days_pending_good_title = "<{good_threshold} Days".format(good_threshold=good_threshold)
    
    for rag in rags:
        days_pending_data = defaultdict(int)
        query = rags[rag]
        for environ in environs:
            df = pd.read_sql(query, con=environ.db.conn)
            df["days_pending"] = df["first_submitted_time"].map(lambda x: days_since(x))
            logger.debug("{} {}".format(environ.name, df.shape[0]))
            logger.debug(df.tail())
            days_pending_data["days_pending_good_title"] += len(df[(df['days_pending']<good_threshold)])
            days_pending_data["days_pending_ok_title"] += len(df[(df['days_pending']>good_threshold) & (df['days_pending']<bad_threshold)])
            days_pending_data["days_pending_bad_title"] += len(df[(df['days_pending']>=bad_threshold)])
        logger.info(days_pending_data)
        rag.set(bad_title=days_pending_bad_title, bad_value=days_pending_data["days_pending_bad_title"],
                ok_title=days_pending_ok_title, ok_value=days_pending_data["days_pending_ok_title"],
                good_title=days_pending_good_title, good_value=days_pending_data["days_pending_good_title"])
        rag.update()


def update_recent_approval_published_count_comparisons(environs):
    seven_days_ago = (datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0) - relativedelta(days=7))
    fourteen_days_ago = seven_days_ago - relativedelta(days=7)

    approved_apps_widget = NumberAndSecondaryStat("~/.clover/geckoboard/amo/apps_approved_last_7.cfg")
    approved_apps_query = create_query_apps_approved_since(fourteen_days_ago.date())

    approved_devs_widget = NumberAndSecondaryStat("~/.clover/geckoboard/amo/devs_approved_last_7.cfg")
    approved_devs_query = create_query_devs_approved_since(fourteen_days_ago.date())

    published_apps_widget = NumberAndSecondaryStat("~/.clover/geckoboard/amo/apps_published_last_7.cfg")
    published_apps_query = create_query_apps_published_since()

    widgets = OrderedDict([
        (approved_apps_widget, approved_apps_query),
        (published_apps_widget, published_apps_query),
        (approved_devs_widget, approved_devs_query)
    ])

    for w in widgets:
        data = defaultdict(int)
        query = widgets[w]
        for environ in environs:
            df = pd.read_sql(query, con=environ.db.conn)
            logger.debug("{} {}".format(environ.name, df.shape[0]))
            if "first_published_time" in df.columns:
                logger.debug(df[(df['first_published_time']>seven_days_ago)])
                logger.debug(df[(df['first_published_time']>fourteen_days_ago) & (df['first_published_time']<seven_days_ago)])
                data["this_week"] += len(df[(df['first_published_time']>seven_days_ago)])
                data["last_week"] += len(df[(df['first_published_time']>fourteen_days_ago) & (df['first_published_time']<seven_days_ago)])
            else:
                logger.debug(df)
                data["this_week"] += len(df[(df['first_approval_time']>seven_days_ago)])
                data["last_week"] += len(df[(df['first_approval_time']>fourteen_days_ago) & (df['first_approval_time']<seven_days_ago)])
        logger.info(data)
        w.set(data["this_week"], comparison=data["last_week"])
        w.update()


################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    logger.info("Starting {filename}...".format(filename=filename))
    environs = [Environ(EnvironType.PROD_US),
                Environ(EnvironType.PROD_EU)]
    try:
        update_recent_approval_published_count_comparisons(environs)
        update_days_pending_rags(environs)
        logger.info("Finished {filename}.".format(filename=filename))
    except Exception as err:
        logger.exception(err)
        phone_home(filename, sys.exc_info())
    finally:
        map(lambda e: e.db.close(), environs)  # Close database connections.
