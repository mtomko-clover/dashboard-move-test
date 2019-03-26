import datetime
import getpass
import os
import sys

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

USERNAME = str(getpass.getuser())
HOME_DIR = os.environ['HOME']

DATASCIENCE_DIR = HOME_DIR + '/data-analytics-tools/monitoring'
sys.path.append(DATASCIENCE_DIR)
from services.db import Db

sys.path.append(HOME_DIR + '/Scripts/devprog_reporting')
from sshdb import SshDb
from mysql_str import NOT_LIKE_DEVELOPER_NAMES_ACCOUNT_EMAILS
MYSQL_DATE_FORMAT = "%Y-%m-%d"