import datetime
import os
import pytest
import sys

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
from utils import create_date_ranges

### app_timestamps_to_sheet.create_date_ranges #################################

def test_create_date_ranges_day():
    # create_date_ranges(period_start="2016-06-01", period_end="2016-06-08", period_type="DAY")
    day_answer = [(datetime.datetime(2016, 6, 1, 0, 0), datetime.datetime(2016, 6, 2, 0, 0)),
                  (datetime.datetime(2016, 6, 2, 0, 0), datetime.datetime(2016, 6, 3, 0, 0)),
                  (datetime.datetime(2016, 6, 3, 0, 0), datetime.datetime(2016, 6, 4, 0, 0)),
                  (datetime.datetime(2016, 6, 4, 0, 0), datetime.datetime(2016, 6, 5, 0, 0)),
                  (datetime.datetime(2016, 6, 5, 0, 0), datetime.datetime(2016, 6, 6, 0, 0)),
                  (datetime.datetime(2016, 6, 6, 0, 0), datetime.datetime(2016, 6, 7, 0, 0)),
                  (datetime.datetime(2016, 6, 7, 0, 0), datetime.datetime(2016, 6, 8, 0, 0))]
    assert create_date_ranges(period_start="2016-06-01", period_end="2016-06-08", period_type="DAY") == day_answer

def test_create_date_ranges_month():
    # create_date_ranges(period_start="2017-01-01", period_end="2018-02-01", period_type="MONTH")
    month_answer = [(datetime.datetime(2017, 1, 1, 0, 0), datetime.datetime(2017, 2, 1, 0, 0)),
                    (datetime.datetime(2017, 2, 1, 0, 0), datetime.datetime(2017, 3, 1, 0, 0)),
                    (datetime.datetime(2017, 3, 1, 0, 0), datetime.datetime(2017, 4, 1, 0, 0)),
                    (datetime.datetime(2017, 4, 1, 0, 0), datetime.datetime(2017, 5, 1, 0, 0)),
                    (datetime.datetime(2017, 5, 1, 0, 0), datetime.datetime(2017, 6, 1, 0, 0)),
                    (datetime.datetime(2017, 6, 1, 0, 0), datetime.datetime(2017, 7, 1, 0, 0)),
                    (datetime.datetime(2017, 7, 1, 0, 0), datetime.datetime(2017, 8, 1, 0, 0)),
                    (datetime.datetime(2017, 8, 1, 0, 0), datetime.datetime(2017, 9, 1, 0, 0)),
                    (datetime.datetime(2017, 9, 1, 0, 0), datetime.datetime(2017, 10, 1, 0, 0)),
                    (datetime.datetime(2017, 10, 1, 0, 0), datetime.datetime(2017, 11, 1, 0, 0)),
                    (datetime.datetime(2017, 11, 1, 0, 0), datetime.datetime(2017, 12, 1, 0, 0)),
                    (datetime.datetime(2017, 12, 1, 0, 0), datetime.datetime(2018, 1, 1, 0, 0)),
                    (datetime.datetime(2018, 1, 1, 0, 0), datetime.datetime(2018, 2, 1, 0, 0))]
    assert create_date_ranges(period_start="2017-01-01", period_end="2018-02-01", period_type="MONTH") == month_answer

def test_create_date_ranges_year():
    # create_date_ranges(period_start="2016-01-01", period_end="2018-02-01", period_type="YEAR")
    year_answer = [(datetime.datetime(2016, 1, 1, 0, 0), datetime.datetime(2017, 1, 1, 0, 0)),
                   (datetime.datetime(2017, 1, 1, 0, 0), datetime.datetime(2018, 1, 1, 0, 0))]
    assert create_date_ranges(period_start="2016-01-01", period_end="2018-02-01", period_type="YEAR") == year_answer

def test_create_date_ranges_validate_arg_types():
    with pytest.raises(TypeError):
        create_date_ranges(period_start=7, period_end="2018-02-01", period_type="YEAR")
    with pytest.raises(TypeError):
        create_date_ranges(period_start="2016-01-01", period_end=7, period_type="YEAR")

def test_create_date_ranges_validate_arg_values():
    with pytest.raises(ValueError):
        # period_start after period_end
        create_date_ranges(period_start="2018-01-02", period_end="2018-01-01", period_type="DAY")
    with pytest.raises(ValueError):
        # period_type too large MONTH
        create_date_ranges(period_start="2018-01-01", period_end="2018-01-02", period_type="MONTH")
    with pytest.raises(ValueError):
        # period_type too large YEAR
        create_date_ranges(period_start="2018-01-01", period_end="2018-01-02", period_type="YEAR")
    with pytest.raises(ValueError):
        # period_type too small MONTH
        create_date_ranges(period_start="2018-01-01", period_end="2018-01-31", period_type="MONTH")
    with pytest.raises(ValueError):
        # period_type too small YEAR
        create_date_ranges(period_start="2018-01-01", period_end="2018-12-31", period_type="YEAR")
    with pytest.raises(ValueError):
        # period_type invalid
        create_date_ranges(period_start="2016-01-01", period_end="2018-02-01", period_type="MONKEY")

################################################################################
