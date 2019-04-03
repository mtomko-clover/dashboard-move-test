#!/bin/bash
source /home/rachel/virtualenvs/devprog/bin/activate
source /home/rachel/devrel-tools/devprog_reporting/envar.sh
python /home/rachel/devrel-tools/devprog_reporting/popular_apps_to_sheet.py
python /home/rachel/devrel-tools/devprog_reporting/popular_devs_to_sheet.py
deactivate