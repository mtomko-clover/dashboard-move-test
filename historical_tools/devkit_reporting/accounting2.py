from __future__ import print_function
import csv
import setup

INFILE_NAME = setup.ACCOUNTING_2_INFILE_NAME


# Accounting 2: Accounting 2 Sales by Date Type Qty and Location

def accounting2():
    print("Processing " + setup.ACCOUNTING_2_INFILE_NAME)
    with open('accounting2_output.csv', 'wb') as outfile:
        with open(INFILE_NAME, 'rb') as infile:
            writer = csv.writer(outfile)
            reader = csv.reader(infile)
            for row in reader:
                new_row = list()
                new_row.append(row[1])  # product_title
                new_row.append(row[2])  # prodcut_price
                new_row.append(row[6])  # shipping_region
                new_row.append(row[5])  # shipping_country
                new_row.append(row[7])  # shipping_city
                new_row.append(row[0])  # day
                new_row.append(row[3])  # name
                new_row.append(row[4])  # email
                new_row.append("")  # Add empty column for month.
                new_row.append("")  # Add empty column for year.
                new_row.append(row[8])  # fulfillment_status
                new_row.append(row[10])  # quantity_count
                new_row.append(row[9])  # total_sales
                writer.writerow(new_row)

if __name__ == "__main__":
    accounting2()
