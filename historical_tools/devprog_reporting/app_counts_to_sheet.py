#!/home/rachel/virtualenvs/devprog/bin/python

from __future__ import print_function
import datetime
import logging
import os
import sys

from dateutil.relativedelta import relativedelta
from pypika import Field

from common_database_queries import count_third_party_apps_filter_on_timestamp_field
from environ import Environ, EnvironType

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
from configure_logger import configure_logger
from utils import get_sheet, write_row_to_sheet, phone_home

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def create_row_third_party_apps_approved_published_between(environ, date_range):
    results = [environ.name_key, date_range[0].strftime("%Y-%m")]
    filter_fields = [Field("first_approval_time"), Field("first_published_time")]
    for filter_field in filter_fields:
        results.append(count_third_party_apps_filter_on_timestamp_field(environ=environ, date_range=date_range, filter_field=filter_field))
    return results

def write_monthly_count_apps_approved_published(environs, date_ranges=None):
    if not date_ranges:
        first_day_of_current_month = datetime.datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        first_day_of_previous_month = first_day_of_current_month - relativedelta(months=1)
        date_ranges = [(first_day_of_previous_month, first_day_of_current_month)]
    for date_range in date_ranges:
        for environ in environs:
            row = create_row_third_party_apps_approved_published_between(environ, date_range=date_range)
            sheet = get_sheet("[DA-170] App and Developer Counts", environ.name_key + "_apps_approved_published")
            write_row_to_sheet(row, sheet)

################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    logger.debug("Starting {filename}...".format(filename=filename))
    environs = [Environ(EnvironType.PROD_US)]
    try:
        write_monthly_count_apps_approved_published(environs)
        logger.debug("Finished {filename}.".format(filename=filename))
    except Exception as err:
        logger.exception(err)
        phone_home(filename, sys.exc_info())
    finally:
        map(lambda e: e.db.close(), environs)  # Close database connections.
