from __future__ import print_function
import logging
import os
import sys

from pypika import MySQLQuery, Table, Tables, Field, functions as fn

from mysql_str import MYSQL_DATE_FORMAT

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
from configure_logger import configure_logger

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def count_third_party_apps_filter_on_timestamp_field(environ, date_range, filter_field):
    """
    Returns:
        long
    """
    if not isinstance(filter_field, Field):
        raise TypeError("Filter field must be an instance of pypika.terms.Field.")
    if not date_range[0] or not date_range[1]:
        raise ValueError("Start and end dates required.")

    date_range = map(lambda x: x.strftime(MYSQL_DATE_FORMAT), date_range)

    developer_app = Table("developer_app")
    q = MySQLQuery.from_(developer_app).select(
        fn.Count(developer_app.id)
    ).where(
        developer_app.developer_id.notin(environ.first_party_dev_ids)  # developer_id is indexed
    ).where(
        (filter_field >= date_range[0]) & (filter_field < date_range[1])
    )
    query = q.get_sql()
    result = environ.db.select_count(query)
    logger.debug(query + "\n" + str(result))
    return result


def count_third_party_devs_filter_on_timestamp_field(environ, date_range, filter_field):
    """
    Returns:
        long
    """
    if not isinstance(filter_field, Field):
        raise TypeError("Filter field must be an instance of pypika.terms.Field.")
    if not date_range[0] or not date_range[1]:
        raise ValueError("Start and end dates required.")

    date_range = map(lambda x: x.strftime(MYSQL_DATE_FORMAT), date_range)

    developer, account = Tables('developer', 'account')
    q = MySQLQuery.from_(developer).join(
        account
    ).on(
        developer.owner_account_id == account.id  # owner_account_id is indexed
    ).select(
        fn.Count(developer.id)
    ).where(
        developer.id.notin(environ.first_party_dev_ids)
    ).where(
        account.last_login.notnull()
    ).where(
        account.email.not_like('%clover.com') & 
        account.email.not_like('%firstdata.com')
    ).where(
        (filter_field >= date_range[0]) & (filter_field < date_range[1])
    )
    query = q.get_sql()
    result = environ.db.select_count(query)
    logger.debug(query + "\n" + str(result))
    return result
