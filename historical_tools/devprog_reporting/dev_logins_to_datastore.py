#!/home/rachel/virtualenvs/devprog/bin/python

from __future__ import print_function
import datetime
import logging
import os
import sys

import pandas as pd
from google.cloud import datastore

import pulls

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
import utils
from configure_logger import configure_logger

from config import DATASCIENCE_DIR
sys.path.append(DATASCIENCE_DIR)
from services.db import Db

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def pull_last_login(db, ids_to_exclude, period_start, period_end):
    query = """
        SELECT d.id, a.last_login
        FROM developer AS d
        JOIN account AS a
        ON a.id = d.owner_account_id
        WHERE d.id NOT IN ({ids_to_exclude}) AND
        a.last_login BETWEEN '{period_start}' AND '{period_end}'
        ORDER BY d.id ASC""" \
        .format(ids_to_exclude=str(ids_to_exclude)[1:-1],
                period_start=period_start,
                period_end=period_end)
    logger.debug(query)
    df = pd.read_sql(query, con=db.conn)
    # logger.debug(df)
    return df


def create_todays_logins(db):
    now = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    period_start = now.strftime("%Y-%m-%d")
    period_end = (now + datetime.timedelta(days=1)).strftime("%Y-%m-%d")
    ids_to_exclude = pulls.pull_first_party_ids(db)
    df = pull_last_login(db, ids_to_exclude, period_start, period_end)
    db.close()
    logger.debug(df)
    return df


def create_login_entities(df, env):
    client = datastore.Client("developer-logins")
    login_entities = list()
    for index, row in df.iterrows():
        incomplete_key = client.key('Login')
        login_entity = datastore.Entity(key=incomplete_key)
        login_entity.update({
            'env': env,
            'did': row["id"],
            'created': datetime.datetime.utcnow(),
            'login_dt': row["last_login"].to_pydatetime()
        })
        login_entities.append(login_entity)
    logger.debug(login_entities)
    return login_entities


def write_entities_to_datastore(entities, project_id):
    client = datastore.Client(project_id)
    chunks = list(utils.chunk(entities, 500))
    logger.debug("Split entities into {num_chunks} chunks.".format(
        num_chunks=len(chunks)
    ))
    for chunk in chunks:
        try:
            with client.batch():
                logger.debug("Writing chunk...")
                client.put_multi(chunk)
        except Exception as e:
            logger.exception(e)
            logger.error(chunk)
            logger.error(entities)
            raise


def daily_dev_logins_to_datastore():
    prod_us = Db("~/.clover/p801.cfg")
    project_id = "developer-logins"
    today = datetime.datetime.utcnow().strftime("%Y-%m-%d")
    
    logger.debug("Pulling today's logins from database...")
    todays_logins = create_todays_logins(prod_us)
    logger.debug("Pulled today's logins from database.")

    logger.debug("Creating login entities...")
    login_entities = create_login_entities(todays_logins, "prod-us")
    logger.debug("Created {num} login entities.".format(
        num=len(login_entities)
    ))

    logger.debug("Writing {num} entities to Cloud Datastore for project {project_id}...".format(
        num=len(login_entities),
        project_id=project_id
    ))
    write_entities_to_datastore(login_entities, project_id)
    logger.info("Wrote {num} entities for {today} to Cloud Datastore for project {project_id}.".format(
        num=len(login_entities),
        today=today,
        project_id=project_id
    ))

################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    logger.debug("Starting {filename}...".format(filename=filename))
    try:
        daily_dev_logins_to_datastore()
        logger.debug("Finished {filename}.".format(filename=filename))
    except Exception as err:
        logger.exception(err)
        utils.phone_home(filename, sys.exc_info())