#!/home/rachel/virtualenvs/devprog/bin/python

from __future__ import print_function
import datetime
import logging
import os
import sys
import time

import gspread
import pandas as pd
import requests
from requests.auth import HTTPBasicAuth

### IMPORTS ####################################################################
HOME_DIR = os.environ['HOME']
UTILS_DIR = HOME_DIR + '/devrel-tools/utilities'
sys.path.append(UTILS_DIR)
import utils
from config_logger import configure_logger
### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
### GLOBALS ####################################################################
try:
    HARVEST_API_KEY = os.environ['HARVEST_API_KEY']
except KeyError as e:
    logger.exception(e)
################################################################################

def call_api(url, params=None):
    """Calls Greenhouse API (sleeping to avoid being rate limited) and returns a
    Response object."""
    r = requests.get(url=url,
                     params=params,
                     auth=HTTPBasicAuth(HARVEST_API_KEY, None))
    logger.debug(r.status_code, r.headers.get("x-ratelimit-remaining"), r.url)
    r.raise_for_status
    # Harvest API does not return a an X-RateLimit-Reset header, but as of
    # 8/22/2018, the rate limit is per 10 seconds.
    # https://developers.greenhouse.io/harvest.html#throttling
    if r.headers.get("x-ratelimit-remaining") and r.headers["x-ratelimit-remaining"] <= 2:
        logger.debug("{num} requests remaining. Sleeping for 10 seconds...".format(num=r.headers["x-ratelimit-remaining"]))
        time.sleep(10)
    logger.debug(r)
    return r


def build_results(response):
    """Takes page of responses from Greenhouse API and calls next link,
    progressively building the full list of JSON response bodies."""
    try:
        results = response.json()
    except TypeError:
        return None
    while response.links.get("next"):
        url = response.links.get("next").get("url")
        response = call_api(url)
        try:
            results.extend(response.json())
        except TypeError as e:
            logger.exception(e)
            return results
    logger.debug(results)
    return results


def pull_applications(period_start, period_end):
    url = "https://harvest.greenhouse.io/v1/applications"
    params = {"created_after": period_start,
              "created_before": period_end,
              "per_page": 500}
    results = build_results(call_api(url, params))
    logger.debug("Pulled {num} applications.".format(num=len(results)))
    logger.debug(results)
    return results


def get_job_department(job_id):
    job_endpoint = "https://harvest.greenhouse.io/v1/jobs/" + str(job_id)
    try:
        department = call_api(job_endpoint).json().get("departments")[0]
    except (requests.exceptions.HTTPError, requests.exceptions.ConnectionError, TypeError, IndexError) as e:
        logger.exception(e)
        return None
    logger.debug(department)
    return department


def application_results_to_df(results):
    def process_how_heard(answer):
        answer = answer.strip().lower()
        if answer[:4] == "www.":
            answer = answer[4:]
        if answer[-4:] == ".com":
            answer = answer[:-4]
        if answer == "stack overflow":
            answer = "stackoverflow"
        if answer == "glass door":
            answer = "glassdoor"
        logger.debug(answer)
        return answer
    rows = list()
    prospects = 0
    for result in results:
        # https://developers.greenhouse.io/harvest.html#applications
        if result.get("prospect"):
            prospects += 1
            logger.debug("Skipping prospect application {id}.".format(id=result.get("id")))
        else:
            row = {"application_id": result.get("id"),
                   "candidate_id": result.get("candidate_id"),
                   "applied_at": result.get("applied_at"),
                   # Because the application is not a prospect, we know that it
                   # has exactly 1 job.
                   "job_id": result.get("jobs")[0].get("id"),
                   "job_name": result.get("jobs")[0].get("name")}
            department = get_job_department(row["job_id"])
            if department:
                row["department_id"] = department.get("id")
                row["department_name"] = department.get("name")
            if result.get("answers"):
                for answer in result["answers"]:
                    if answer.get("question") == "How did you hear about this job?" and answer.get("answer"):
                        row["how_heard"] = process_how_heard(answer["answer"])
            logger.debug(row)
            rows.append(row)
    df = pd.DataFrame(rows)
    logger.debug("Skipped {p_num} prospects. Wrote {r_num} rows to dataframe.".format(p_num=prospects, r_num=len(rows)))
    logger.debug(df)
    return df


def write_df_to_sheet(df, sheet):
    # Google Sheets API can't handle "nan", so we need to replace nan with None.
    # https://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.where.html
    # https://pandas.pydata.org/pandas-docs/stable/generated/pandas.notnull.html
    df_converted = df.where(cond=pd.notnull(df), other=None)
    rows = df_converted.values.tolist()
    for row in rows:
        logger.debug(row)
        sheet.append_row(row, value_input_option='USER_ENTERED')
        if len(rows) > 99:
            logger.debug("Sleeping 1.1 seconds...")
            time.sleep(1.1)  # Rate limited to 100 writes in 100 seconds
    return len(rows)


def daily_greenhouse_to_sheet():
    # On any given day, we can pull the previous day's applications.
    spreadsheet_title = "[DA-166] Greenhouse"
    today = datetime.datetime.utcnow()
    yesterday = today - datetime.timedelta(days=1)
    period_start = yesterday.strftime("%Y-%m-%d")
    period_end = today.strftime("%Y-%m-%d")

    logger.debug("Starting to pull applications for {period_start}...".format(
        period_start=period_start))
    df = application_results_to_df(pull_applications(period_start, period_end))
    logger.debug("Pulled applications from Greenhouse.")

    logger.debug("Retreiving {spreadsheet_title}...".format(
        spreadsheet_title=spreadsheet_title))
    sheet = utils.get_sheet(spreadsheet_title)
    logger.debug("Retrieved {spreadsheet_title}.".format(
        spreadsheet_title=spreadsheet_title))
    
    logger.debug("Writing counts to {spreadsheet_title}...".format(
        spreadsheet_title=spreadsheet_title))
    row_count = write_df_to_sheet(df, sheet)
    logger.info("Wrote {row_count} rows for {yesterday} to {spreadsheet_title}.".format(
        row_count=row_count,
        yesterday=period_start,
        spreadsheet_title=spreadsheet_title))

################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    logger.debug("Starting {filename}...".format(filename=filename))
    try:
        daily_greenhouse_to_sheet()
        logger.debug("Finished {filename}.".format(filename=filename))
    except Exception as err:
        logger.exception(err)
        utils.phone_home(filename, sys.exc_info())
