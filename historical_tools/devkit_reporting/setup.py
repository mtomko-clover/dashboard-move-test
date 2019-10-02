from __future__ import print_function


ACCOUNTING_1_INFILE_NAME = ""
ACCOUNTING_2_INFILE_NAME = ""
ACCOUNTING_4_INFILE_NAME = "payment_transactions_export.csv"
ORDERS_INFILE_NAME = ""


def validate_names():
    if not (ACCOUNTING_1_INFILE_NAME[-4:] == ".csv" and
        ORDERS_INFILE_NAME[-4:] == ".csv" and
        ACCOUNTING_2_INFILE_NAME[-4:] == ".csv" and
        ACCOUNTING_4_INFILE_NAME[-4:] == ".csv"):
        raise IOError("setup.py is missing .csv files.")

if __name__ == "__main__":
    print(validate_names())