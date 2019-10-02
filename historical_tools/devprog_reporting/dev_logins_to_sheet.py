#!/home/rachel/virtualenvs/devprog/bin/python

from __future__ import print_function
import datetime
import logging
import os
import sys
import time

from dateutil import parser
from google.cloud import datastore

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
import utils
from configure_logger import configure_logger

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def pull_logins_between(period_start=None, period_end=None):
    """Pulls developer login entities from Cloud Datastore.

    Args:
        period_start (datetime or str): Start date. Function returns login events greater than or equal to period_start.
        period_end (datetime or str): End date. Non-inclusive (analogous to stop in slice syntax).
    
    Returns:
        list of 'Login' Entity objects
    """
    client = datastore.Client("developer-logins")
    query = client.query(kind='Login')
    if period_start:
        if isinstance(period_start, str):
            period_start = parser.parse(period_start)
        query.add_filter('login_dt', '>=', period_start)    
    if period_end:
        if isinstance(period_end, str):
            period_end = parser.parse(period_end)
        query.add_filter('login_dt', '<', period_end)
    query.order = ['login_dt']
    entities = list(query.fetch()) 
    logger.debug(entities)
    return entities


def daily_login_counts(period_start=None, period_end=None):
    # Parse, zero out, and set dates.
    if period_start:
        period_start = utils.zero_out(period_start)
    else:
        period_start = parser.parse('2018-08-08')  # Earliest recorded logins.
    if period_end:
        period_end = utils.zero_out(period_end)
    else:
        period_end = utils.zero_out(datetime.datetime.utcnow())  # No logins have been recorded for today yet.
    
    # Pull counts for each day.
    daily_login_counts = list()
    delta = period_end - period_start
    for i in range(delta.days):
        ps = period_start + datetime.timedelta(i)
        pe = ps + datetime.timedelta(days=1)
        count = len(pull_logins_between(ps, pe))
        daily_login_counts.append((ps.strftime("%Y-%m-%d"), count))
    logger.debug(daily_login_counts)
    return daily_login_counts


def write_logins_to_sheet(logins, sheet):
    for num, login in enumerate(logins, start=1):
        # <Entity(u'Login', 5635703144710144L) {u'did': 434L, u'login_dt': datetime.datetime(2018, 8, 8, 19, 10, 33, tzinfo=<UTC>), u'env': 'prod-us', u'created': datetime.datetime(2018, 8, 8, 23, 58, 3, 18567, tzinfo=<UTC>)}>
        row = [login.key.id,
               login.get('env'),
               login.get('did'),
               login.get('login_dt').strftime("%Y-%m-%d %H:%M:%S")]  # '2018-08-08 19:30:33'
        logger.debug("{num}/{num_rows} {row}".format(num=num, num_rows=len(logins), row=row))
        sheet.append_row(row, value_input_option='USER_ENTERED')
        time.sleep(1.1)  # Rate limited to 100 writes in 100 seconds


def daily_dev_login_counts_to_sheet():
    # The day's logins are written to Cloud Datastore just before midnight.
    # Therefore, on any given day, we can pull the previous day's count.
    yesterday = datetime.datetime.utcnow() - datetime.timedelta(days=1)
    spreadsheet_title = "[DA-163] Developer Logins Count"

    logger.debug("Starting to pull login count for {yesterday}...".format(
        yesterday=yesterday.strftime("%Y-%m-%d")))
    counts = daily_login_counts(yesterday)
    logger.debug("Pulled login count from Cloud Datastore.")

    logger.debug("Retreiving {spreadsheet_title}...".format(
        spreadsheet_title=spreadsheet_title))
    sheet = utils.get_sheet(spreadsheet_title)
    logger.debug("Retrieved {spreadsheet_title}.".format(
        spreadsheet_title=spreadsheet_title))

    logger.debug("Writing count to {spreadsheet_title}...".format(
        spreadsheet_title=spreadsheet_title))
    utils.write_counts_to_sheet(counts, sheet, env="prod_us")
    logger.info("Wrote count {num} for {date} to {spreadsheet_title}.".format(
        num=counts[0][1],
        date=counts[0][0],
        spreadsheet_title=spreadsheet_title))

################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    logger.debug("Starting {filename}...".format(filename=filename))
    try:
        daily_dev_login_counts_to_sheet()
        logger.debug("Finished {filename}.".format(filename=filename))
    except Exception as err:
        logger.exception(err)
        utils.phone_home(filename, sys.exc_info())
