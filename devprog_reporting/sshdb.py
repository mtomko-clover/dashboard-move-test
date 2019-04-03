import json
import os
import sys

import MySQLdb
import sshtunnel
import pandas as pd

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
from config import DATASCIENCE_DIR
sys.path.append(DATASCIENCE_DIR)
from services.db import BaseDb


class BaseSshDb(BaseDb):
    def __init__(self, ssh_host, ssh_username, ssh_password,
                 host, db, username, password=None,
                 ssh_port=22, port=3306):
        self.ssh_host = ssh_host
        self.ssh_port = ssh_port
        self.ssh_username = ssh_username
        self.ssh_password = ssh_password
        self.host = host
        self.port = port
        self.db = db
        self.username = username
        self.password = password

        try:
            self.server = sshtunnel.SSHTunnelForwarder(
                (self.ssh_host, self.ssh_port),
                ssh_username=self.ssh_username,
                ssh_password=self.ssh_password,
                remote_bind_address=(self.host, self.port)
            )
            self.server.start()
        except sshtunnel.BaseSSHTunnelForwarderError:
            # Is the SSH password in the config file up-to-date?
            raise
        
        try:
            if not self.password:
                self.conn = MySQLdb.connect(
                    host=self.host,
                    port=self.server.local_bind_port,
                    db=self.db,
                    compress=True,
                    connect_timeout=5, 
                    user=self.username
                )
            else:
                self.conn = MySQLdb.connect(
                    host=self.host,
                    port=self.server.local_bind_port,
                    db=self.db,
                    compress=True,
                    connect_timeout=5, 
                    user=self.username,
                    passwd=self.password
                )
        except MySQLdb.OperationalError:
            raise
        except MySQLdb.ProgrammingError:
            raise
    
    def close(self):
        self.conn.close()
        self.server.stop()


class SshDb(BaseSshDb):
    def __init__(self, config_file):
        config_file = os.path.expanduser(config_file)
        json_keys = json.load(open(config_file))
        super(SshDb, self).__init__(
            ssh_host=json_keys.get('ssh_host'),
            ssh_username=json_keys.get('ssh_username'),
            ssh_password=json_keys.get('ssh_password'),
            host='127.0.0.1',
            db=json_keys.get('db'),
            username=json_keys.get('username'),
            password=json_keys.get('password')
        )

################################################################################
if __name__ == "__main__":
    sb = SshDb("~/.clover/sb.cfg")
    query = """SELECT Count(*) FROM developer"""
    print(pd.read_sql(query, con=sb.conn))
    print(sb.select_count(query))
    sb.close()
