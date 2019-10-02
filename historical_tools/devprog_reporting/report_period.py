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

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
import utils
from config import DATASCIENCE_DIR, USERNAME
from configure_logger import configure_logger

sys.path.append(DATASCIENCE_DIR)
from services.db import Db
from services import emails

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
NOT_LIKE_DEVELOPER_NAMES_ACCOUNT_EMAILS_P804 = """
    eu_developers.developer_name NOT LIKE "Clover" AND
    eu_developers.email NOT LIKE '%clover.com' AND
    eu_developers.email NOT LIKE '%firstdata%' AND
    eu_developers.email NOT LIKE '%perka.com'
    """


def period_over_period(current_series, previous_series):
    current = current_series.fillna(0)
    previous = previous_series.fillna(0)
    return (
        pd.Series(((current - previous) / previous) * 100)
          .replace([np.inf, -np.inf], np.nan)
          .fillna(0)
          .astype(int)
        )


def create_date_ranges(period_start, period_end, relative_period=None, all_time=False):
    """
    Args:
        period_start (str): Start date in YYYY-MM-DD format.
        period_end (str): End date in YYYY-MM-DD format. Non-inclusive (analogous to stop in slice syntax).
        relative_period (dateutil.relativedelta.relativedelta): If present, uses relativedelta to calculate previous period. If None, uses absolute timedelta.
        all_time (bool): Defaults to False. If True, include all-time to end of period.

    Returns:
        list: list of datetime tuples of
            * period (period_start, period_end)
            * previous period
            * same period previous year
            * (optional) all-time to end of period (None, period_end)
        
        Example:
            [(datetime.datetime(2018, 10, 1, 0, 0), datetime.datetime(2019, 1, 1, 0, 0)),  # Q4 2018
             (datetime.datetime(2018, 7, 1, 0, 0), datetime.datetime(2018, 10, 1, 0, 0)),  # Q3 2018
             (datetime.datetime(2017, 10, 1, 0, 0), datetime.datetime(2018, 1, 1, 0, 0)),  # Q4 2017
             (None, datetime.datetime(2019, 1, 1, 0, 0))]
        
        (datetime, datetime) tuples are used as dates with BETWEEN statements.
        Example:
            SELECT created_time FROM developer
            WHERE created_time BETWEEN '2018-10-01' AND '2019-01-01'
        Results:
            2018-10-01 07:42:34
            ...
            2018-12-31 23:58:58
        
        (None, datetime) tuples are used with < statements.
        Example:
            SELECT created_time FROM developer
            WHERE created_time < '2019-01-01'
        Results:
            2012-08-08 23:55:20
            ...
            2018-12-31 23:58:58
    """
    period_start = parser.parse(period_start)
    period_end = parser.parse(period_end)

    if not relative_period:
        relative_period = period_end - period_start

    date_ranges = [
        (period_start, period_end),
        (period_start - relative_period, period_start),
        (period_start - relativedelta(years=1), period_end - relativedelta(years=1)),
    ]

    if all_time:
        date_ranges.append((None, period_end))

    logger.debug(date_ranges)
    return date_ranges


def devs_count(environ, date_range, case):
    """
    Returns:
        long
    """
    if date_range[0]:  # Null check
        if date_range[0] < case.start_date:  # If data unavailable for timeframe
            return None
        start_date = date_range[0].strftime(MYSQL_DATE_FORMAT)
    end_date = date_range[1].strftime(MYSQL_DATE_FORMAT)

    # Last login check drops pentester accounts.
    query = """
        SELECT Count(DISTINCT developer.id)
        FROM developer
        JOIN account ON account.id = developer.owner_account_id
        WHERE account.last_login IS NOT NULL
        AND""" + NOT_LIKE_DEVELOPER_NAMES_ACCOUNT_EMAILS
    
    if case.status == Status.CREATED:
        query += """
            AND developer.created_time
            """
    elif case.status == Status.SUBMITTED:
        query += """
            AND developer.first_submitted_time
            """
    elif case.status == Status.APPROVED:
        query += """
            AND developer.approval_status = "APPROVED"
            AND developer.first_approval_time
            """
    else:
        logger.warning("Passed unhandled case: {case}".format(case=case))
    
    if date_range[0] and date_range[1]:
        query += """
            BETWEEN '{start}' AND '{end}'
            """.format(start=start_date, end=end_date)

    elif not date_range[0] and date_range[1]:
        query += """
            < '{end}'
            """.format(end=end_date)
    else:
        logger.waring("Passed unhandled date_range.")
    
    result = environ.db.select_count(query)
    logger.debug(query + "\n" + str(result))
    return result


def eu_devs_counts(environ, date_range, case):
    """EU is weird because we don't have access to a prod_eu proxy the way we do
    prod_us. For now, the best we can do is p804, but the table structure is
    different. Since a prod_eu proxy may be forthcoming, I don't want to wire
    this weirdness too deeply.
    """

    if date_range[0]:  # Null check for all-time
        start_date = date_range[0].strftime(MYSQL_DATE_FORMAT)
    end_date = date_range[1].strftime(MYSQL_DATE_FORMAT)

    query = """
        SELECT Count(DISTINCT uuid) FROM eu_developers
        WHERE""" + NOT_LIKE_DEVELOPER_NAMES_ACCOUNT_EMAILS_P804

    if case.status == Status.CREATED:
        query += """
            AND eu_developers.developer_created_time
            """
    else:
        logger.warning("Passed unhandled case: {case}".format(case=case))
        raise ValueError

    if date_range[0] and date_range[1]:
        query += """
            BETWEEN '{start}' AND '{end}'
            """.format(start=start_date, end=end_date)

    elif not date_range[0] and date_range[1]:
        query += """
            < '{end}'
            """.format(end=end_date)
    else:
        logger.warning("Passed unhandled date_range.")
        raise ValueError

    result = environ.db.select_count(query)
    return result


def apps_count(environ, date_range, case):
    """
    Returns:
        long
    """
    if date_range[0]:  # Null check
        if date_range[0] < case.start_date:  # If data unavailable for timeframe
            return None
        start_date = date_range[0].strftime(MYSQL_DATE_FORMAT)
    end_date = date_range[1].strftime(MYSQL_DATE_FORMAT)

    # DEAR FUTURE RACHEL,
    # By definition, INNER JOIN on app_subscription excludes apps that lack rows
    # in that table. Those apps are either NEW (some generated by pentesters) or
    # have been disabled (a tiny minority).

    query = """
        SELECT Count(DISTINCT developer_app.id)
        FROM developer_app
        JOIN developer ON developer_app.developer_id = developer.id
        JOIN account ON account.id = developer.owner_account_id
        JOIN app_subscription ON app_subscription.developer_app_id = developer_app.id
        JOIN app_subscription_country ON app_subscription_country.app_subscription_id = app_subscription.id
        WHERE account.last_login IS NOT NULL
        AND""" + NOT_LIKE_DEVELOPER_NAMES_ACCOUNT_EMAILS
    
    # DEAR FUTURE RACHEL,
    # You cannot know the applicability of these timestamps to particular
    # countries, even when you try combining them with app_subscription_country.created_time.
    # Let it go.

    if case.status == Status.CREATED:
        query += """
            AND developer_app.created_time
            """
    elif case.status == Status.SUBMITTED:
        query += """
            AND developer_app.first_submitted_time
            """
    elif case.status == Status.APPROVED:
        query += """
            AND developer_app.approval_status in ("APPROVED", "PUBLISHED")
            AND developer_app.first_approval_time
            """
    elif case.status == Status.PUBLISHED:
        query += """
            AND developer_app.approval_status = "PUBLISHED"
            AND developer_app.first_published_time
            """
    else:
        logger.warning("Passed unhandled case: {case}".format(case=case))
    
    if date_range[0] and date_range[1]:
        query += """
            BETWEEN '{start}' AND '{end}'
            """.format(start=start_date, end=end_date)

    elif not date_range[0] and date_range[1]:
        query += """
            < '{end}'
            """.format(end=end_date)
    else:
        logger.waring("Passed unhandled date_range.")
    
    result = environ.db.select_count(query)
    logger.debug(query + "\n" + str(result))
    return result


def create_period_report(environs, period_start, period_end, relative_period=None, all_time=False):
    """Returns dataframe of 3p developer account and app creations, submissions, and approvals during period.

    Args:
        environs (list): List of Environs (SANDBOX, PROD_US, PROD_EU, PROD_LA) to run reporting on.
        period_start (str): Start date in YYYY-MM-DD format.
        period_end (str): End date in YYYY-MM-DD format. Non-inclusive (analogous to stop in slice syntax).
        relative_period (dateutil.relativedelta.relativedelta): If present, uses relativedelta to calculate previous period. If None, uses absolute timedelta.
        all_time (bool): Defaults to False. If True, includes counts for all-time to end of period.
    
    Returns:
        pandas.core.frame.DataFrame
    """

    def dev_reports_for(environ, date_ranges):
        frames = []
        for dev_report in environ.dev_reports:
            # Keep columns in order.
            counts = OrderedDict()
            for date_range in date_ranges:
                counts[date_range] = devs_count(environ, date_range, dev_report)
            frames.append(pd.DataFrame(data=counts,
                                       index=[str(environ) + " Devs " + str(dev_report)]))   
        if not frames:
            return
        report = pd.concat(frames)
        logger.debug(report)
        return report


    def app_reports_for(environ, date_ranges):
        frames = []      
        for app_report in environ.app_reports:
            counts = OrderedDict()            
            for date_range in date_ranges:
                counts[date_range] = apps_count(environ, date_range, app_report)
            frames.append(pd.DataFrame(data=counts,
                                        index=[str(environ) + " Apps " + str(app_report)]))
        if not frames:
            return
        report = pd.concat(frames)
        logger.debug(report)
        return report


    def labelize(t):
        # If we are dealing with a (timestamp, timestamp) tuple.
        if type(t[0]) == pd._libs.tslibs.timestamps.Timestamp and type(t[1]) == pd._libs.tslibs.timestamps.Timestamp:
            return "{date1}-{date2}".format(date1=t[0].strftime(COLUMN_DATE_FORMAT), date2=utils.shift_one_day_back(t[1]).strftime(COLUMN_DATE_FORMAT))
        # If we have a (None, timestamp) tuple:
        elif pd.isnull(t[0]) and type(t[1]) == pd._libs.tslibs.timestamps.Timestamp:
            return "All-Time Through {date2}".format(date2=utils.shift_one_day_back(t[1]).strftime(COLUMN_DATE_FORMAT))
        # If we have a ("Label", "") tuple:
        elif type(t[0]) == str and not t[1]:
            return t[0]
        else:
            return t


    date_ranges = create_date_ranges(period_start, period_end, relative_period, all_time)
    frames = []
    for environ in environs:
        try:
            frames.append(dev_reports_for(environ, date_ranges))
            frames.append(app_reports_for(environ, date_ranges))
            environ.db.close()
        except:
            environ.db.close()
            raise
    if not frames:
        return

    report = pd.concat(frames)
    report['Period Over Period'] = period_over_period(report.iloc[:, 0],
                                                      report.iloc[:, 1])
    # If we are reporting on a year, then the "previous period" date range and
    # the "same period, previous year" date range are the same, and therefore
    # get dropped during concatenation. If that's the case, the above suffices
    # and this second call would be inaccurate.
    if len(report.columns) > 2 and date_ranges[2] == report.columns[2]:
        report['Year Over Year'] = period_over_period(report.iloc[:, 0],
                                                      report.iloc[:, 2])
    report.columns = map(labelize, report.columns)
    utils.print_full(report)
    return report


def run(environs, period_start, period_end, relative_period=None, all_time=False, email=None):
    """Writes (and optionally emails) CSV report of 3p developer metrics.

    Args:
        environs (list): List of Environs (SANDBOX, PROD_US, PROD_EU, PROD_LA) to run reporting on.
        period_start (str): Start date in YYYY-MM-DD format.
        period_end (str): End date in YYYY-MM-DD format. Non-inclusive (analogous to stop in slice syntax).
        relative_period (dateutil.relativedelta.relativedelta): If present, uses relativedelta to calculate previous period. If None, uses absolute timedelta.
        all_time (bool): Defaults to False. If True, includes counts for all-time to end of period.
        email (str): username appended to '@clover.com'. None by default. If included, sends email with results in body and attached as csv.
    
    Returns:
        None
    """
    report = create_period_report(environs=environs,
                                  period_start=period_start,
                                  period_end=period_end,
                                  relative_period=relative_period,
                                  all_time=all_time)
    name = [period_start, period_end, "devprog_report"]
    csvname = '_'.join(name)
    # Write CSV to disk and return location so that CSV can be attached to email.
    csvloc = utils.write_dataframe_to_csv(report, csvname)

    if email:
        body = "%s" % (report.to_html(header=True, index=True))
        emails.send([email+'@clover.com', 'rachel@clover.com'],
                    'Developer Program Report: ' + period_start + ' - ' + period_end,
                    body,
                    USERNAME+'@clover.com',
                    attachmentFile=csvloc)

################################################################################
if __name__ == "__main__":
    try:
        run(environs=[Environ(EnvironType.SANDBOX),
                      Environ(EnvironType.PROD_US)],
            period_start='2018-10-01',
            period_end='2019-01-01',
            relative_period=relativedelta(months=3),
            all_time=True,
            email=None)        
        # run(environs=[Environ(EnvironType.SANDBOX),
        #               Environ(EnvironType.PROD_US)],
        #     period_start='2018-10-01',
        #     period_end='2019-01-01',
        #     relative_period=relativedelta(months=3),
        #     all_time=True,
        #     email=None)
    except Exception:
        raise
