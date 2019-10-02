import getpass
import os

USERNAME = str(getpass.getuser())
HOME_DIR = os.environ['HOME']
LOG_OUTPUT_DIR = HOME_DIR + '/logs/'
CSV_OUTPUT_DIR = HOME_DIR
DATASCIENCE_DIR = HOME_DIR + '/data-analytics-tools/monitoring'
