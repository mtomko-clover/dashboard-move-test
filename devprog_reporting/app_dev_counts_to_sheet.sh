#!/bin/bash
source /home/rachel/virtualenvs/devprog/bin/activate
source /home/rachel/devrel-tools/devprog_reporting/envar.sh
python /home/rachel/devrel-tools/devprog_reporting/app_counts_to_sheet.py
python /home/rachel/devrel-tools/devprog_reporting/dev_counts_to_sheet.py
deactivate
