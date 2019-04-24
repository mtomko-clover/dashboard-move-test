## Devkit Reporting
Python 2.7.13 scripts used to transform Shopify exports for [Developer Kit Monthly Reporting](https://confluence.dev.clover.com/display/AMO/Developer+Kit+Monthly+Reporting).

### How to Use Devkit Reporting Scripts

1. Following the [instructions on Confluence](https://confluence.dev.clover.com/display/AMO/Developer+Kit+Monthly+Reporting), export custom reports from Shopify.

2. [Export Shopify orders](https://cloverdevkit.myshopify.com/admin/orders) for the same time period covered by Accounting 1.
> _Note:_ All files shoud be in .csv format.

3. Place the Shopify export files in the same folder as the Python scripts.

4. In `setup.py`, Edit `ACCOUNTING_1_INFILE_NAME`, `ACCOUNTING_2_INFILE_NAME`, and `ORDERS_INFILE_NAME` (Accounting 3 does not require processing and Accounting 4 always has the same file name).

5. In Terminal, navigate to `/devkit_reporting` and run `python transform_exports.py`.
