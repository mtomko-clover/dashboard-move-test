from __future__ import print_function
import csv
import setup

INFILE_NAME = setup.ACCOUNTING_4_INFILE_NAME


# Accounting 4: Payment Transactions

def accounting4():
    with open('accounting4_output.csv', 'wb') as outfile:
        print("Processing " + setup.ACCOUNTING_4_INFILE_NAME)
        with open(INFILE_NAME, 'rb') as infile:
            writer = csv.writer(outfile)
            reader = csv.reader(infile)
            for row in reader:
                new_row = list()
                new_row.extend(row[:7])
                new_row.extend(row[8:])
                writer.writerow(new_row)

if __name__ == "__main__":
    accounting4()
