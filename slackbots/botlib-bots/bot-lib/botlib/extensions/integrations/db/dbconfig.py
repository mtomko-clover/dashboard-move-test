import logging
import sys
import traceback

import MySQLdb as db
import botlib
import pandas as pd
import sshtunnel
from botlib.core.formatters import Formatters
from sshtunnel import open_tunnel

local_host = "127.0.0.1"

sshtunnel.SSH_TIMEOUT = 5.0
sshtunnel.TUNNEL_TIMEOUT = 5.0
pd.set_option('expand_frame_repr', False)
pd.set_option('display.max_colwidth', -1)

DBPOOL = {}
logger = logging.getLogger(__name__)

TESTQUERY = 'SELECT 1 FROM dual'


class DbManager(object):

    def __init__(self, target):
        self.target = target

    @staticmethod
    def get_connection(config):
        if config.name in DBPOOL:
            connection = DBPOOL.get(config.name)
            try:
                # Validate the connection is still alive
                result = pd.read_sql_query(TESTQUERY, connection)
            except Exception as ex:
                connection = None
            if connection:
                return connection
        if config.tunnel:
            server = open_tunnel(config.ssh_host,
                                 ssh_username=config.ssh_username,
                                 ssh_port=config.ssh_port,
                                 ssh_password=config.ssh_password,
                                 remote_bind_address=(local_host, config.db_port),
                                 local_bind_address=(local_host,))
            server.start()
            logger.debug('Connecting to ' + config.name + ' through ' + local_host + ':' + str(server.local_bind_port))
            connection = db.connect(connect_timeout=5, host=local_host, port=server.local_bind_port,
                                    user=config.db_user,
                                    passwd=config.db_password)
            # Don't cache results
            connection.autocommit(True)
            DBPOOL.update({config.name: connection})
        else:
            connection = db.connect(connect_timeout=5, host=config.ssh_host, port=config.db_port, user=config.db_user,
                                    passwd=config.db_password, ssl=config.ssl)
            # Don't cache results
            connection.autocommit(True)
            DBPOOL.update({config.name: connection})
        return connection


def run_query(sc, channel, cmdline, quiet, message, config):
    if isinstance(config,list):
        # Preparing for sharded support, fan out across all configs passed
        for cfg in config:
            run_query_cfg(sc, channel, cmdline, quiet, message, cfg)
    else:
        run_query_cfg(sc, channel, cmdline, quiet, message, config)

def run_query_cfg(sc, channel, cmdline, quiet, message, config):
    from botlib.core import registry

    logger.debug('Running against ' + config.name)
    dropin = registry.get_dropin(cmdline.command, cmdline.object, cmdline.modifier)
    connection = DbManager.get_connection(config)

    optionlist = []
    if cmdline.options:
        try:
            for option in cmdline.options:
                optionlist.append(dropin.options[option])
        except Exception as ex:
            print "Exception: " + ex.message
    else:
        optionlist = dropin.defoptionlist

    for option in optionlist:
        try:
            inp = cmdline.inputs
            expanded = False
            if option.expand_groups:
                expanded = True
                inp = expand_groups(inp)
            if option.loop:
                # Iterate over the inputs as separate queries
                for input in inp:
                    data = get_data(cmdline, input, config.name)
                    formatted_sql = option.SQL.format(**data)
                    run_command(sc, connection, channel, option, formatted_sql, cmdline, quiet, message, config)
            else:
                if isinstance(inp, list):
                    inp = ','.join(inp)
                data = get_data(cmdline, inp, config.name)
                formatted_sql = option.SQL.format(**data)
                run_command(sc, connection, channel, option, formatted_sql, cmdline, quiet, message, config)
        except Exception as ex:
            exc_type, exc_value, exc_traceback = sys.exc_info()
            sc.send_output(channel, '*Failed executing command*' + '```' + ''.join(
                traceback.format_exception(exc_type, exc_value, exc_traceback)) + '```')
    return


def expand_groups(inputs):
    for input in inputs:
        key = input.replace("'", "").lower()
        if botlib.core.registry.groups_registry.has_key(key):
            new_inputs = botlib.core.registry.get_groupmids(key)
            return new_inputs
        else:
            return inputs


def run_command(sc, connection, channel, option, formatted_sql, cmdline, quiet, message, config):
    try:
        if cmdline.sqldebug:
            sc.send_output(channel, formatted_sql, '```', '```')
        if cmdline.dryrun:
            # Don't actually run the command, just dump the sql
            return
        df = pd.read_sql_query(formatted_sql, connection)
        data = get_data(cmdline, cmdline.inputs, config.name)
        if df.empty:
            result_str = 'No results found'
            if quiet:
                return
            sc.send_output(channel, option.header.format(**data), '*', '*')
        else:
            sc.send_output(channel, option.header.format(**data), '*', '*')
            if cmdline.formatters:
                format_output(sc, channel, cmdline, df)
                return
            elif option.format and 'vertical' in option.format:
                result_str = Formatters.vertical_str(df)
            else:

                pd.set_option('expand_frame_repr', False)
                result_str = df.to_string(index=False, justify='center')
        if message:
            sc.send_output(channel, message)
        sc.send_output(channel, result_str, '```', '```')
    except Exception as ex:
        raise ex


def get_data(cmdline, inputs, target):
    return {
        'inputs': inputs,
        'start_time': cmdline.start_time.strftime("'%Y-%m-%d %H:%M:%S'"),
        'end_time': cmdline.end_time.strftime("'%Y-%m-%d %H:%M:%S'"),
        'target': target
    }


def format_output(sc, channel, cmdline, df):
    if cmdline.formatters and 'csv' in cmdline.formatters:
        result_str = Formatters.to_csv(df)
        sc.send_attachment(channel, result_str, filetype='csv', title='output.csv',
                           filename='output.csv')
        return
    elif cmdline.formatters and 'tsv' in cmdline.formatters:
        # Tab separated
        result_str = Formatters.to_csv(df, sep='\t')
        sc.send_attachment(channel, result_str, filetype='tsv', title='output.tsv',
                           filename='output.tsv')
        # Markdown
    elif cmdline.formatters and 'md' in cmdline.formatters:
        result_str = Formatters.to_md(df)
        sc.send_attachment(channel, result_str, filetype='markdown', title='output.md',
                           filename='output.md')
    elif cmdline.formatters and 'pdf' in cmdline.formatters:
        output = Formatters.to_pdf(df, cmdline.original)
        sc.send_attachment(channel, output, filetype='pdf', title='output.pdf',
                           filename='output.pdf')
