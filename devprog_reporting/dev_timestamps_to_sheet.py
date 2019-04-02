#!/home/rachel/virtualenvs/devprog/bin/python

from __future__ import print_function
import datetime
import logging
import os
import sys

import pandas as pd
from dateutil.relativedelta import relativedelta

### IMPORTS ####################################################################
from pulls import pull_first_party_ids

UTILS_DIR = os.environ['HOME'] + '/devrel-tools/utilities'
sys.path.append(UTILS_DIR)
import utils
from config_logger import configure_logger

from config import DATASCIENCE_DIR
sys.path.append(DATASCIENCE_DIR)
from services.db import Db
### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def monthly_combined_dev_counts(db, period_start, period_end, ids_to_exclude):
    combined_counts = list()
    date_ranges = utils.create_date_ranges(period_start, period_end, "MONTH")
    for date_range in date_ranges:
        ps = date_range[0]
        pe = date_range[1]
        devs_count = pull_count_devs_filtered_between(db=db,
                                                      filter_field="created_time",
                                                      period_start=ps,
                                                      period_end=pe,
                                                      ids_to_exclude=ids_to_exclude)
        semi_devs_count = pull_count_semi_devs_filtered_between(db=db,
                                                                filter_field="created_time",
                                                                period_start=ps,
                                                                period_end=pe,
                                                                ids_to_exclude=ids_to_exclude)
        combined_counts.append((ps.strftime("%Y-%m"), devs_count, semi_devs_count))
    logger.debug(combined_counts)
    return combined_counts


def pull_count_devs_filtered_between(db, filter_field, period_start, period_end, ids_to_exclude):
    """Connects to database and returns count from developer table where
    filter_field between period_start and period_end.
    
    Returns:
        int
    """
    query = """
        SELECT Count(d.id)
        FROM developer AS d
        WHERE d.id NOT IN ({ids_to_exclude})
        AND d.{filter_field} BETWEEN '{period_start}' AND '{period_end}'""" \
        .format(ids_to_exclude=str(ids_to_exclude)[1:-1],
                filter_field=filter_field,
                period_start=period_start,
                period_end=period_end)
    logger.debug(query)
    df = pd.read_sql(query, con=db.conn)
    logger.debug(df)
    return int(df.iloc[0,0])


def pull_count_semi_devs_filtered_between(db, filter_field, period_start, period_end, ids_to_exclude):
    """Connects to database and returns count from developer table of developers
    with a semi-integrated app where filter_field between period_start and period_end.
    
    Returns:
        int
    """
    query = """
        SELECT Count(DISTINCT d.id)
        FROM developer AS d
        JOIN developer_app AS da
        ON d.id = da.developer_id
        WHERE d.id NOT IN ({ids_to_exclude}) AND
        da.application_id IS NOT NULL AND
        da.application_id != '' AND
        d.{filter_field} BETWEEN '{period_start}' AND '{period_end}'""" \
        .format(ids_to_exclude=str(ids_to_exclude)[1:-1],
                filter_field=filter_field,
                period_start=period_start,
                period_end=period_end)
    logger.debug(query)
    df = pd.read_sql(query, con=db.conn)
    logger.debug(df)
    return int(df.iloc[0,0])


def monthly_dev_timestamps_to_sheet():
    # This script will run on the first day of the month to record counts for the previous month.
    prod_us = Db("~/.clover/p801.cfg")
    first_day_of_current_month = datetime.datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    first_day_of_previous_month = first_day_of_current_month - relativedelta(months=1)
    spreadsheet_title = "[DA-170] App and Developer Counts"
    worksheet_title = "combined_dev_created"

    logger.debug("Pulling first party developer IDs from prod_us...")
    first_party_ids = pull_first_party_ids(prod_us)
    logger.debug("Pulled first party developer IDs.")

    logger.debug("Creating monthly combined dev counts for {previous_month}...".format(
        previous_month=first_day_of_previous_month.strftime("%b %Y")))
    combined_counts = monthly_combined_dev_counts(db=prod_us,
                                                  period_start=first_day_of_previous_month,
                                                  period_end=first_day_of_current_month,
                                                  ids_to_exclude=first_party_ids)
    logger.debug("Created monthly combined dev counts.")

    logger.debug("Retreiving {spreadsheet_title}: {worksheet_title}...".format(
        spreadsheet_title=spreadsheet_title,
        worksheet_title=worksheet_title))
    combined_sheet = utils.get_sheet(spreadsheet_title, worksheet_title)
    logger.debug("Retrieved worksheet {worksheet_title}.".format(
        worksheet_title=worksheet_title))

    logger.debug("Writing counts to worksheet {worksheet_title}...".format(
        worksheet_title=worksheet_title))
    utils.write_counts_to_sheet(combined_counts, combined_sheet, env="prod_us")
    logger.info("Wrote counts {counts} for {month} to worksheet {worksheet_title}.".format(
        counts=combined_counts[0][1:],
        month=combined_counts[0][0],
        worksheet_title=worksheet_title))
    prod_us.close()

################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    logger.debug("Starting {filename}...".format(filename=filename))
    try:
        monthly_dev_timestamps_to_sheet()
        logger.debug("Finished {filename}.".format(filename=filename))
    except Exception as err:
        logger.exception(err)
        utils.phone_home(filename, sys.exc_info())
