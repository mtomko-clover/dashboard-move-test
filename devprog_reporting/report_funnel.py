import os
import sys

import pandas as pd

from pulls import pull_first_party_ids

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
import utils
from config import DATASCIENCE_DIR, USERNAME

sys.path.append(DATASCIENCE_DIR)
from services.db import Db
from services import emails


def add_dates_clause(filter_field, period_start=None, period_end=None):
    clause = " AND " + filter_field
    if period_start and not period_end:
        clause += " > '" + period_start + "'"
    elif period_end and not period_start:
        clause += " < '" + period_end + "'"
    else:
        clause += " BETWEEN '" + period_start + "' AND '" + period_end + "'"
    return clause
    
# FUNNEL STAGE 1: DEV ACCOUNT CREATED
def pull_count_devs_created(db, ids_to_exclude, period_start=None, period_end=None):
    query = """
        SELECT Count(*)
        FROM developer AS d
        WHERE d.id NOT IN (""" + str(ids_to_exclude)[1:-1] + """)"""
    if period_start or period_end:
        clause = add_dates_clause('d.created_time', period_start, period_end)
        query += clause
    df = pd.read_sql(query, con=db.conn)
    count = df.iloc[0,0]
    return count
    
# FUNNEL STAGE 2: LOGGED INTO DEV ACCOUNT
def pull_count_devs_logged_into(db, ids_to_exclude, period_start=None, period_end=None):
    query = """
        SELECT Count(*)
        FROM developer AS d
        JOIN account AS a
        ON d.owner_account_id = a.id
        WHERE d.id NOT IN (""" + str(ids_to_exclude)[1:-1] + """)
        AND a.last_login IS NOT NULL"""
    if period_start or period_end:
        clause = add_dates_clause('d.created_time', period_start, period_end)
        query += clause
    df = pd.read_sql(query, con=db.conn)
    count = df.iloc[0,0]
    return count

# FUNNEL STAGE 3: APPLIED FOR DEV ACCT APPROVAL
def pull_count_devs_applied_for_approval(db, ids_to_exclude, period_start=None, period_end=None):
    query = """
        SELECT Count(*)
        FROM developer AS d
        WHERE d.id NOT IN (""" + str(ids_to_exclude)[1:-1] + """)
        AND d.approval_status != 'NEW'"""
    if period_start or period_end:
        clause = add_dates_clause('d.created_time', period_start, period_end)
        query += clause
    df = pd.read_sql(query, con=db.conn)
    count = df.iloc[0,0]
    return count

# FUNNEL STAGE 4: DEV ACCT APPROVED
def pull_count_devs_approved(db, ids_to_exclude, period_start=None, period_end=None):
    query = """
        SELECT Count(*)
        FROM developer AS d
        WHERE d.id NOT IN (""" + str(ids_to_exclude)[1:-1] + """)
        AND d.approval_status = 'APPROVED'"""
    if period_start or period_end:
        clause = add_dates_clause('d.created_time', period_start, period_end)
        query += clause
    df = pd.read_sql(query, con=db.conn)
    count = df.iloc[0,0]
    return count

# FUNNEL STAGE 5: APPLIED FOR APP APPROVAL (Includes Devs with Pending Status)
def pull_count_devs_applied_for_app_approval(db, ids_to_exclude, period_start=None, period_end=None):
    query = """
        SELECT Count(DISTINCT da.developer_id)
        FROM developer AS d
        JOIN developer_app AS da
        ON da.developer_id = d.id
        WHERE d.id NOT IN (""" + str(ids_to_exclude)[1:-1] + """)
        AND d.approval_status in ('PENDING', 'APPROVED')
        AND da.approval_status != 'NEW'"""
    if period_start or period_end:
        clause = add_dates_clause('d.created_time', period_start, period_end)
        query += clause
    df = pd.read_sql(query, con=db.conn)
    count = df.iloc[0,0]
    return count

# FUNNEL STAGE 6: DEV WITH APPROVED APP
def pull_count_devs_approved_app(db, ids_to_exclude, period_start=None, period_end=None):
    query = """
        SELECT Count(DISTINCT da.developer_id)
        FROM developer AS d
        JOIN developer_app AS da
        ON da.developer_id = d.id
        WHERE d.id NOT IN (""" + str(ids_to_exclude)[1:-1] + """)
        AND da.approval_status in ('APPROVED', 'PUBLISHED')"""
    if period_start or period_end:
        clause = add_dates_clause('d.created_time', period_start, period_end)
        query += clause
    df = pd.read_sql(query, con=db.conn)
    count = df.iloc[0,0]
    return count


def create_funnel_df(period_start=None, period_end=None):
    results = list()
    prod_us = Db("~/.clover/p801.cfg")
    ids_to_exclude = pull_first_party_ids(prod_us)
    results.append(pull_count_devs_created(prod_us, ids_to_exclude, period_start, period_end))
    results.append(pull_count_devs_logged_into(prod_us, ids_to_exclude, period_start, period_end))
    results.append(pull_count_devs_applied_for_approval(prod_us, ids_to_exclude, period_start, period_end))
    results.append(pull_count_devs_approved(prod_us, ids_to_exclude, period_start, period_end))
    results.append(pull_count_devs_applied_for_app_approval(prod_us, ids_to_exclude, period_start, period_end))
    results.append(pull_count_devs_approved_app(prod_us, ids_to_exclude, period_start, period_end))
    prod_us.close()

    if period_start and period_end:
        label_dates = utils.create_daterange_for_label(period_start, period_end)
        column_label = "%s Cohort" % label_dates
    else:
        column_label = "Cohort"
    index_labels = [
        "Created Dev Acct",
        "Logged into Dev Acct",
        "Applied for Dev Approval",
        "Dev Acct Approved",
        "Applied for App Approval",
        "App Approved"
    ]

    frame = pd.Series(data=results, index=index_labels).to_frame().rename(columns={0: column_label})
    return frame


def run_funnel_report(period_start, period_end, email=None):
    """Runs funnel report for cohort and writes it to disk.

    Args:
        period_start (str): Start date in YYYY-MM-DD format.
        period_end (str): End date in YYYY-MM-DD format. Non-inclusive (analogous to stop in slice syntax).
        email (str): username appended to '@clover.com'. None by default. If included, sends email with results in body and attached as csv.
    
    Returns:
        None -- however, it does write a csv to CSV_OUTPUT_DIR, and emails that csv if email is passed.
    """

    funnel_df = create_funnel_df(period_start, period_end)
    utils.print_full(funnel_df)

    name = [period_start, period_end, "devprog_funnel"]
    csvname = '_'.join(name)
    csvloc = utils.write_dataframe_to_csv(funnel_df, csvname)

    if email:
        body = "Report: %s" % (funnel_df.to_html(header=True, index=True))
        emails.send([email+'@clover.com'],
                    'Developer Program Funnel: ' + period_start + ' - ' + period_end,
                    body,
                    USERNAME+'@clover.com',
                    attachmentFile=csvloc)

################################################################################
if __name__ == "__main__":
    # Specifying period works like string slicing: period_end is not included.
    # Email is None by default and may be omitted.
    run_funnel_report(period_start='2018-07-01',
                      period_end='2018-10-01',
                      email=USERNAME)
