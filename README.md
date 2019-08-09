## ADB Scripts
Commonly used ADB tasks wrapped in simplified commands. These scripts require [Android Debug Bridge](http://adbshell.com/) and to already have a device connected through USB.

### adb_screen
Use: `adb_screen [file_name]`

Takes a screenshot of the device and saves it to your current directory as `file_name`.png (default=screenshot.png)

### adb_record
Use: `adb_record [file_name] [duration]`

Begins recording the screen of the device for `duration` seconds (default=180 seconds or 3 minutes). Once completed, saves the video in your current directory as `file_name.mp4` (default=video.mp4)

---

## App Approvals
No ReadMe provided

---

## Devkit Reporting
Python 2.7.13 scripts used to transform Shopify exports for [Developer Kit Monthly Reporting](https://confluence.dev.clover.com/display/AMO/Developer+Kit+Monthly+Reporting). See [/devkit_reporting/README.md](https://github.com/clover/Scripts/tree/master/devkit_reporting) for instructions.

---

## Developer Program Reporting
Python 2.7.5 scripts designed to be used on p809 to output quarterly reports. See [devprog_reporting/README.md](https://github.com/kristalinc/devrel-tools/tree/master/devprog_reporting) for instructions.

Also includes scripts that run on p809 as cronjobs to update dashboards.

---

## Greenhouse
Decommissioned script that recorded how job applicants heard about Clover in order to analyze the impact of events like Grace Hopper Celebration.

---

## Infolease Script
If a developer lets you know that they've changed their banking information:

1. Open Terminal
2. _(First time setup)_ Confirm python 3 is installed by running `python3 --version`
3. _(First time setup)_ Run `pip3 install -r requirements.txt` to install all dependencies
4. Run `python3 daa.py`
5. Enter JIRA username, then password
6. Enter in the UUIDs that need their Infolease vendor information updated, separated by commas
7. The script will create a new CO ticket for Lisa and Ashwini

---

## Meetup Finder
Python 2.7.15 script designed to find itinerant Meetup groups that we can build relationships with and potentially host at our offices.

---

## Notebooks
Jupyter notebooks, see [notebooks/README.md](https://github.com/kristalinc/devrel-tools/tree/master/notebooks) for details.

---

## Utilities
No ReadMe provided
