# Developer Program Reporting

Python 2.7.5 scripts designed to be used on p809 to output quarterly reports, plus Python 2.7.15 scripts that run on p809 as cron jobs and output supplemental data to Google Cloud Datastore and Google Sheets.

## Reports

### How to Generate Reports

#### First Time Setup
Follow DRA's [instructions](https://confluence.dev.clover.com/display/DRA/Jupyter+Notebook):

* Obtain access to p809.
* Clone data-analytics-tools.
* Set up p801.cfg.

Then clone this repository to your p809 homedir. When you run `ls`, you should see:

```
[user@p809 ~]$ ls
data-analytics-tools
devrel-tools
```
> _Optional:_ If your directories are not set up like the above, you can change the location of `data-analytics-tools` in `config.py`.

#### Creating a Period Report

Navigate to `devrel-tools/devprog_reporting/` and open `report_period.py`.

`report_period.py` does not have a CLI, so adjust the arguments of `run()` in the block `if __name__ == "__main__"`.

* environs (list): List of environ.Environ objects. For example, `[Environ(EnvironType.SANDBOX), Environ(EnvironType.PROD_US)]`.
* period_start (str): Start date in YYYY-MM-DD format.
* period_end (str): End date in YYYY-MM-DD format. Non-inclusive (analogous to stop in slice syntax).
* relative_period (dateutil.relativedelta.relativedelta): If present, uses relativedelta to calculate previous period. If None, uses absolute timedelta. For example, if you are running a quarterly report, set `relative_period=relativedelta(months=3)`.
* email (str): username appended to '@clover.com'. None by default. If included, sends email with results in body and attached as csv.

`run()` does not return anything, but it does:

* Print the report.
* Write the report to a csv.
* If `email`, email the report.

After saving, run `python report_period.py`.

#### Creating a Funnel Report

`report_funnel.py` works similarly to `report_period.py`. Adjust the arguments of `run_funnel_report()` in the block `if __name__ == "__main__"`.

`run_funnel_report()` has three parameters:

* period_start (str): Start date in YYYY-MM-DD format.
* period_end (str): End date in YYYY-MM-DD format. Non-inclusive (analogous to stop in slice syntax).
* email (str): username appended to '@clover.com'. `None` by default. If included, sends email with results in body and attached as csv.

`run_funnel_report()` does not return anything, but it does:

* Print the report.
* Write the report to a csv.
* If `email`, email the report.

## Cron Jobs

### Crontab
```
59 23 * * * /home/rachel/devrel-tools/devprog_reporting/dev_logins_to_datastore.sh
5 0 * * * /home/rachel/devrel-tools/devprog_reporting/dev_logins_to_sheet.sh
30 0 * * 1 /home/rachel/devrel-tools/devprog_reporting/popular_apps_devs_to_sheet.sh
0 2 1 * * /home/rachel/devrel-tools/devprog_reporting/app_dev_timestamps_to_sheet.sh
```

### Google Sheets

Scripts that write to Google Sheets do so by using a service account's credentials. In order for the service account to be able to find the Google Sheet, you need to [share the sheet with the service account's email address](https://www.twilio.com/blog/2017/02/an-easy-way-to-read-and-write-to-a-google-spreadsheet-in-python.html). Otherwise, gspread will raise `SpreadsheetNotFound`.

### Geckoboards

Some of the cron jobs update Geckoboards:

* [App and Developer Install Leaderboard](https://app.geckoboard.com/edit/dashboards/280964)

### Adding New Cron Jobs

* If using the approach above, make sure to make the .sh script executable with `chmod +x`.
> Executable scripts appear colored green in Terminal.

* The crontab file must finish with a new line in order to install successfully.