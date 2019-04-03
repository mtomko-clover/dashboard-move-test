from __future__ import print_function
import datetime
import logging
import os
import sys
from collections import OrderedDict

import numpy as np
import pandas as pd
from dateutil import parser
from dateutil.relativedelta import relativedelta

from environ import Environ, EnvironType, Status
from report_period import create_date_ranges

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
import utils
from config import DATASCIENCE_DIR, USERNAME
from configure_logger import configure_logger

sys.path.append(DATASCIENCE_DIR)
from services.db import Db

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

MYSQL_DATE_FORMAT = "%Y-%m-%d"
COLUMN_DATE_FORMAT = "%b %d %Y"
NOT_LIKE_DEVELOPER_NAMES_ACCOUNT_EMAILS = """
    developer.name NOT LIKE "Clover" AND
    account.email NOT LIKE '%clover.com' AND
    account.email NOT LIKE '%firstdata.com' AND
    account.email NOT LIKE '%perka.com' AND
    account.email NOT LIKE '%gyft.com' AND
    account.email NOT LIKE '%trubeacon.com' AND
    account.email NOT LIKE '%spreecommerce.com' AND
    account.email NOT LIKE '%pnc.com' AND
    account.email NOT LIKE '%wellsfargo.com' AND
    account.email NOT LIKE '%bankofamerica%'
    """
################################################################################

environs=[Environ(EnvironType.PROD_US)]
period_start='2018-10-01'
period_end='2019-01-01'
relative_period=relativedelta(months=3)
all_time=True

################################################################################

date_ranges = create_date_ranges(period_start, period_end, relative_period, all_time)

for environ in environs:
    for date_range in date_ranges:
        df = app_market_revenue(environ, date_range)
            # We should get 3 values back from each DB query
            #             Q4 - Q3 - Q4' - All Time
            # Total Rev   10
            # Clover Rev   3
            # 3p Rev       7
            # So should I start with a df and add columns to it?

            # Gross Rev
            # Net Rev
            # Lost Rev (IN_PROGRESS, INCURRED)

def app_market_revenue(environ, date_range):
    if date_range[0]:  # Null check
        start_date = date_range[0].strftime(MYSQL_DATE_FORMAT)
    end_date = date_range[1].strftime(MYSQL_DATE_FORMAT)
    
    query = """
    """