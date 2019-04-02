## Jupyter Notebooks

Python 2.7 [Jupyter](https://jupyter.org/) notebooks for prototyping and exploratory data science.

### How to Use Jupyter Notebooks

#### First Time Setup
Follow DRA's [instructions](https://confluence.dev.clover.com/display/DRA/Jupyter+Notebook+Using+Data-Analytics-Tools):

* Obtain access to p809.
* Clone data-analytics-tools.
* Set up p801.cfg.

Then clone this repository to your p809 homedir. When you run `ls`, you should see:

```
[user@p809 ~]$ ls
data-analytics-tools
devrel-tools
```
If your directories are set up differently, edit the paths in `devrel-tools/notebooks/standard_imports.py`

#### Using the Notebooks

1. `cd devrel-tools/notebooks`
2. `jupyter notebook`
3. In your web browser, open `https://p809.corp.clover.com:{port}`

#### WARNING

Do not `git commit` notebooks that contain PII, which includes UUIDs.

Before committing, go to Kernel > Restart & Clear Output.

### Notebooks
* `app_approval_time_pending.ipynb` Histogram and descriptive statistics of the length of time apps have been waiting to be approved.
* `developer_percentiles.ipynb` Lagging indicators of developer success (e.g., combined install count across all of their apps).
* `developer_time_to_first_approval.ipynb` Descriptive statistics of time from prod developer account creation to first approved app.
* `developers_by_location.ipynb` Find developers located in particular states. Useful for generating email lists for regional events.
* `monthly_installs.ipynb` Exploratory work re: month-over-month growth in app install bases.
* `sandbox_prod_acc_bridge.ipynb` Exploratory work re: how to identify prod and sandbox developer accounts that belong to the same entitity.