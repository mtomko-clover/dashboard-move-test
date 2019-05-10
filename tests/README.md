# Tests

Python 2.7.15 scripts designed to quietly monitor a few things.

## Scripts

* `test_test_cards.py` uses the test card numbers in our documentation with DevPay and asserts that the transaction is approved or declined as documented. If there is an AssertionError, it emails the tech writers to alert them.

## Cron Jobs

### Crontab
```
0 17 * * * /home/rachel/devrel-tools/tests/test_test_cards.sh
```