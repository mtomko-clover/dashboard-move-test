from __future__ import print_function
import csv
import setup

ACCOUNTING_INFILE_NAME = setup.ACCOUNTING_1_INFILE_NAME
ORDERS_INFILE_NAME = setup.ORDERS_INFILE_NAME


def create_zips_dict():
    """Read orders export csv, return dictionary with order name keys and
    shipping zip code values: {'#2094': "'33172"}"""

    print("Processing " + ORDERS_INFILE_NAME)
    zips = dict()
    with open(ORDERS_INFILE_NAME, 'rb') as infile:
        reader = csv.reader(infile)
        for row in reader:
            # Don't overwrite the order's existing zip code with an empty string.
            if not row[0] in zips:
                zips[row[0]] = row[40]
    return zips


# Accounting 1: Dev Kit Sales by Day including Taxes, Shipping, Discounts, and Totals

def accounting1(zips):
    """Read accounting1 csv, write accounting1_output.csv for FD reporting.
    Parameters
    ----------
    zips : dict
        Dictionary of order name keys and shipping zip code values returned by
        create_zips_dict.
    Returns
    -------
    None"""

    print("Processing " + ACCOUNTING_INFILE_NAME)
    with open('accounting1_output.csv', 'wb') as outfile:
        with open(ACCOUNTING_INFILE_NAME, 'rb') as infile:
            writer = csv.writer(outfile)
            reader = csv.reader(infile)

            for row in reader:
                new_row = list()
                new_row.append(row[0])  # day
                new_row.append(row[1])  # shipping_city
                new_row.append(row[2])  # shipping_region

                if row[0] == "day":
                    new_row.append("Shipping Zip Code")
                else:
                    try:
                        # Look up shipping zip code by order_name.
                        zipcode = zips[row[6]]

                        # Slice off apostrophe and format for Excel as text rather
                        # than number to prevent leading zeros disappearing.
                        if zipcode and zipcode[0] == "'":
                            zipcode = '="' + zipcode[1:] + '"'

                        new_row.append(zipcode)
                    except KeyError:
                        new_row.append("")
                        print(row[6] + " not found in zips dict. Was this order canceled? Perhaps the orders export and accounting1 dates are mismatched.")

                new_row.append(row[3])  # shipping_country

                if row[0] == "day":
                    new_row.append("month")
                    new_row.append("year")
                else:
                    new_row.append(row[0][:7])  # Add year-month.
                    new_row.append(row[0][:4])  # Add year.

                new_row.append(row[4])  # fullfilment_status
                new_row.append(row[5])  # customer_name

                # Adding order_name to Accounting 1 custom report inserted a
                # column, so the remainder are shifted.

                new_row.append(row[11])  # refunds (total_cancelled in FD report)
                new_row.append(row[10])  # ordered_item_quantity (order_count in FD report)
                new_row.append(row[7])  # total_sales
                new_row.append(row[8])  # taxes
                new_row.append(row[9])  # shipping
                new_row.append(row[13])  # net_sales (total_subtotal in FD report)
                new_row.append(row[12])  # discounts

                writer.writerow(new_row)

if __name__ == "__main__":
    zips = create_zips_dict()
    accounting1(zips)
