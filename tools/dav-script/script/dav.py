import requests
import argparse
import yaml
from pathlib import Path
from DAVlib import *
from SlackLib import *

validation = True

print("""
Clover DAV Developer Application Vetting script

usage: dav.py <region> <date>
examp: dav.py US 1/1/2011

""")

##
## Commandline Args
##

# parse arguments
parser = argparse.ArgumentParser()
parser.add_argument("region", nargs='?', default='ask')
parser.add_argument("date", nargs='?', default='ask')
args = parser.parse_args()

if args.region == "ask":
    args.region = input('region (US, EU, or LA) [US]: ').upper()
    if args.region == '':
        args.region = 'US'
        print(f"  using {args.region}")
if args.date == "ask":
    args.date = input('start date [2019-11-1]: ')
    if args.date == '':
        args.date='2019-11-1'
        print(f"  using {args.date}")

print(f"running for {args.region} region from {args.date}")

##
## Import config files
##

# Setup default values
values = {}
values["db"] = {}
values["db"]["US"] = 'db-usprod-shard0.corp.clover.com'
values["db"]["EU"] = 'db-euprod-shard0.corp.clover.com'
values["db"]["LA"] = 'db-laprod-shard0.corp.clover.com'

# Load config.yaml values - these values are checked into github & in docker
config = Path('config.yaml')
if config.is_file():
    with config.open() as configfile:
        configvalues = yaml.load(configfile, Loader=yaml.FullLoader)
    values = configvalues
else:
    print('no config file, using presets')

# Load secret.yaml values - these values are never checked in github and are imported to docker
secrets = Path('/config/secrets.yaml')
if secrets.is_file():
    with secrets.open() as secretsfile:
        secretsvalues = yaml.load(secretsfile, Loader=yaml.FullLoader)
else:
    print('no secrets.yaml file, cannot continue. (refer to secrets.yaml.template for format)')
    secretsvalues = {}
    #validation = False

##
## Final validation
##

# input validation to this point
if validation and not args.region in values["db"]:
    print(f"ERROR: {args.region} is not a defined region in config.yaml")
    validation = False
if validation and not "jira" in values:
    print(f"ERROR: jira link is not defined in config.yaml")
    validation = False
if validation and not "db_user" in secretsvalues:
    print(f"ERROR: db_user missing from secrets.yaml")
    secretsvalues["db_user"] = input("db user:")
    #validation = False
if validation and not "db_password" in secretsvalues:
    secretsvalues["db_password"] = input("db password:")
    print(f"ERROR: db_password missing from secrets.yaml")
    #validation = False
if validation and not "jira_user" in secretsvalues:
    secretsvalues["jira_user"] = input("jira user:")
    print(f"ERROR: jira_user missing from secrets.yaml")
    #validation = False
if validation and not "jira_password" in secretsvalues:
    secretsvalues["jira_password"] = input("jira password:")
    print(f"ERROR: jira_password missing from secrets.yaml")
    #validation = False            

##
## Perform if valid inputs
##

# if valid inputs
if validation:

    db_url = values["db"][args.region]
    jira_url = values["jira"]

    db_user = secretsvalues["db_user"]
    db_pass = secretsvalues["db_password"]
    jira_user = secretsvalues["jira_user"]
    jira_pass = secretsvalues["jira_password"]
    utc_start_time = args.date

    slack_host=values["slack"]
    slack_channels=values["slack-channels"]

    dry_run = False

    ##
    ## Validation Done
    ##

    print(f"using database {values['db'][args.region]}")

    # call the lib to create jiras and text files
    devs = update_developers_by_date(utc_start_time, db_url, db_user, db_pass, jira_url, jira_user, jira_pass, args.region, dry_run)
    print(f"{devs} new or updated developers in region {args.region} since {args.date}")

    update_slack(f"DAV script: {devs} new or updated developers in region {args.region} since {args.date}", slack_host, slack_channels)
