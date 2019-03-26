import logging
import os
import sys
import traceback
from time import sleep, gmtime, strftime

import gspread
import pandas as pd
from dateutil import parser
from dateutil.relativedelta import relativedelta
from oauth2client.service_account import ServiceAccountCredentials

from config import CSV_OUTPUT_DIR, DATASCIENCE_DIR, LOG_OUTPUT_DIR, USERNAME
sys.path.append(DATASCIENCE_DIR)
from services import emails

### LOGGING ####################################################################
def configure_logger(logger, name, console_output=False):
    if not os.path.exists(LOG_OUTPUT_DIR):
        os.mkdir(LOG_OUTPUT_DIR)
    logger.setLevel(logging.DEBUG)
    fh = logging.FileHandler(LOG_OUTPUT_DIR + name + ".log")
    fh.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s | %(levelname)s | %(module)s | %(message)s')
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    if console_output:
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)
        ch.setFormatter(formatter)
        logger.addHandler(ch)

logger = logging.getLogger(__name__)
configure_logger(logger, name="cronjobs", console_output=True)
################################################################################

def enum(**enums):
    return type('Enum', (), enums)
 
def chunk(l, n):
    """Yield successive n-sized chunks from l."""
    for i in xrange(0, len(l), n):
        yield l[i:i + n]

def phone_home(filename, exc_info):
    type_, value_, traceback_ = exc_info
    ex = traceback.format_exception(type_, value_, traceback_)
    emails.send(['rachel@clover.com'],
                'Exception in {filename}'.format(filename=filename),
                str(ex),
                'rachel@clover.com')

### PANDAS-RELATED HELPER FUNCTIONS ############################################

def print_full(x):
    pd.set_option('display.max_rows', len(x))
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', 2000)
    pd.set_option('display.float_format', '{:20,.2f}'.format)
    pd.set_option('display.max_colwidth', -1)
    print(x)
    pd.reset_option('display.max_rows')
    pd.reset_option('display.max_columns')
    pd.reset_option('display.width')
    pd.reset_option('display.float_format')
    pd.reset_option('display.max_colwidth')

### DATE-RELATED HELPER FUNCTIONS ##############################################

def shift_one_day_back(datestamp):
    return datestamp - relativedelta(days=1)

def format_date_for_label(datestamp):
    return datestamp.strftime("%m/%d/%y")

def create_daterange_for_label(period_start, period_end):
    if type(period_start) == str:
        period_start = parser.parse(period_start)
    if type(period_end) == str:
        period_end = parser.parse(period_end)
    daterange_for_label = format_date_for_label(period_start) + "-" + format_date_for_label(shift_one_day_back(period_end))
    return daterange_for_label

def zero_out(dt):
    """Convert string to datetime if needed and zero out datetime to midnight."""
    if isinstance(dt, str):
        dt = parser.parse(dt)
    dt = dt.replace(hour=0, minute=0, second=0, microsecond=0)
    return dt

def create_date_ranges(period_start, period_end, period_type):
    """Given period_start and period_end, create list of datetime range tuples
    for each period_type.
    
    For example:
        >>> create_date_ranges(period_start="2016-01-01", period_end="2017-03-03", period_type="YEAR")
        [(datetime.datetime(2016, 1, 1, 0, 0), datetime.datetime(2017, 1, 1, 0, 0))]
    """
    date_ranges = list()
    try:
        period_start = zero_out(period_start)
        period_end = zero_out(period_end)
    except AttributeError:
        raise TypeError("""period_start and period_end must be YYYY-MM-DD strings or datetimes.
            period_start={period_start}
            period_end={period_end}"""
            .format(period_start=period_start, period_end=period_end))
    if (period_end < period_start):
        raise ValueError("""period_start must be before period_end.
            period_start={period_start}
            period_end={period_end}"""
            .format(period_start=period_start, period_end=period_end))
    if period_type not in ("DAY", "DAYS", "MONTH", "MONTHS", "YEAR", "YEARS"):
        raise ValueError("""period_type must be one of: "DAY", "MONTH", "YEAR".
            period_type={period_type}"""
            .format(period_type=period_type))
    if period_type in ("DAY", "DAYS"):
        delta = period_end - period_start
        for i in range(delta.days):
            ps = period_start + relativedelta(days=i)
            pe = ps + relativedelta(days=1)
            date_ranges.append((ps, pe))
    elif period_type in ("MONTH", "MONTHS"):
        delta = relativedelta(period_end, period_start)
        if not (delta.months or delta.years):
            raise ValueError("""period_start and period_end must be at least a month apart.
                period_start={period_start}
                period_end={period_end}
                delta={delta}"""
                .format(period_start=period_start, period_end=period_end, delta=delta))
        if delta.years:
            delta.months += delta.years * 12
        for i in range(delta.months):
            ps = period_start + relativedelta(months=i)
            pe = ps + relativedelta(months=1)
            date_ranges.append((ps, pe))
    elif period_type in ("YEAR", "YEARS"):
        delta = relativedelta(period_end, period_start)
        if not delta.years:
            raise ValueError("""period_start and period_end must be at least a year apart.
                period_start={period_start}
                period_end={period_end}
                delta={delta}"""
                .format(period_start=period_start, period_end=period_end, delta=delta))
        for i in range(delta.years):
            ps = period_start + relativedelta(years=i)
            pe = ps + relativedelta(years=1)
            date_ranges.append((ps, pe))
    return date_ranges

### CSV-RELATED HELPER FUNCTIONS ###############################################

def write_dataframe_to_csv(frame, csvname):
    csvloc = CSV_OUTPUT_DIR + "/" + csvname + ".csv"
    try:
        frame.to_csv(csvloc)
    except UnicodeEncodeError:
        frame.to_csv(csvloc, encoding='utf-8')
    return csvloc

def combine_csvs(filenames, output_name):
    combined_csv = pd.concat([pd.read_csv(f) for f in filenames])
    csvloc = (write_dataframe_to_csv(combined_csv, output_name))
    return csvloc

### GOOGLE SHEETS HELPER FUNCTIONS #############################################

def get_sheet(spreadsheet_title, worksheet_title=None):
    # https://www.twilio.com/blog/2017/02/an-easy-way-to-read-and-write-to-a-google-spreadsheet-in-python.html
    scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/drive']  # Change for API v4
    creds = ServiceAccountCredentials.from_json_keyfile_name('/home/' + USERNAME + '/.gcp/developer-logins-key.json', scope)
    client = gspread.authorize(creds)
    if worksheet_title:
        sheet = client.open(spreadsheet_title).worksheet(worksheet_title)
    else:
        sheet = client.open(spreadsheet_title).sheet1        
    return sheet

def write_counts_to_sheet(counts, sheet, env="prod_us"):
    for count in counts:
        row = [env]
        row.extend(count)
        sheet.append_row(row)
        logger.debug("Sleeping...")
        sleep(1.1)  # Rate limited to 100 writes in 100 seconds
        logger.debug("Awake!")

def clear_sheet_and_write(spreadsheet_title, worksheet_title, rows, env):
    logger.debug("Retrieving {spreadsheet_title}: {worksheet_title}...".format(
            spreadsheet_title=spreadsheet_title,
            worksheet_title=worksheet_title))
    sheet = get_sheet(spreadsheet_title, worksheet_title)
    logger.debug("Retrieved worksheet {worksheet_title}.".format(
            worksheet_title=worksheet_title))
    
    logger.debug("Clearing existing cells...")
    logger.debug("Sleeping...")
    sleep(10)  # Clear is a write, which counts against that limit.
    logger.debug("Awake!")
    sheet.clear()
    logger.debug("Cleared existing cells.")
    logger.debug("Sleeping...")
    sleep(10)  # Clear is a write, which counts against that limit.
    logger.debug("Awake!")

    logger.debug("Writing leaderboard to worksheet {worksheet_title}...".format(
            worksheet_title=worksheet_title))
    write_counts_to_sheet(rows, sheet, env=env)
    logger.info("Wrote leaderboard to worksheet {worksheet_title}.".format(
            worksheet_title=worksheet_title))
