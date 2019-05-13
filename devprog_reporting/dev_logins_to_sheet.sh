#!/bin/bash
source /home/rachel/virtualenvs/devprog/bin/activate
source /home/rachel/devrel-tools/devprog_reporting/envar.sh
python /home/rachel/devrel-tools/devprog_reporting/dev_logins_to_sheet.py
deactivate
