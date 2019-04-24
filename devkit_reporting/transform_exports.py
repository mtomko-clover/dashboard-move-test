import setup, accounting1, accounting2, accounting4

if __name__ == "__main__":
    setup.validate_names()
    zips = accounting1.create_zips_dict()
    accounting1.accounting1(zips)
    accounting2.accounting2()
    accounting4.accounting4()
