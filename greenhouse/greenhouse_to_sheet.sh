#!/bin/bash
source /home/rachel/virtualenvs/devprog/bin/activate
source /home/rachel/Scripts/devprog_reporting/envar.sh
source /home/rachel/devrel-tools/greenhouse/greenhouse_secrets.sh
python /home/rachel/devrel-tools/greenhouse/greenhouse_to_sheet.py
deactivate