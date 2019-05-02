import mysql.connector
from jira import JIRA
import getpass

self = ()

db = mysql.connector.connect(host="db-usprod-shard0.corp.clover.com", user="susanc", passwd="asWJn9rWa88=", db="meta")

dev_uuid = input("Enter the developer UUID: ")

query = ("""select name, business_country, infolease_vendor_code, billing_status, developer_bank_info.modified_time  from developer
join developer_bank_info on developer.uuid = developer_bank_info.developer_uuid
where uuid = '%s'""") %(dev_uuid)
query_output = ()
results = ()
cursor = db.cursor()

cursor.execute(query)
for results in cursor:
    dev_name = results[0]
    app_country = results[1]
    infolease = results[2]
    billing_status = results[3]
    modified_time = results[4]
    print("Developer Name: ", results[0])
    print("Country: ", results[1])
    print("Infolease Vendor", results[2])
    print ("Billing Status: ", results[3])
    print ("Last Modified: ", results[4])

open_jira = input("Do you want to open an issue in jira? Enter yes or no.").lower()
if open_jira == "yes":
    username = input("JIRA Username: ")
    password = getpass.getpass("JIRA Password: ")
    jira = JIRA(basic_auth=(username, password), options={'server': 'https://jira.dev.clover.com'})
    issue_type = input("""What is the billing issue?:
                        - If the developer is missing a monthly disbursement, enter 1.
                        - If the developer is missing payment for a specific merchant, enter 2.
                        - If the developer is inquiring about Pending Charges for merchants, enter 3. 
                        - If you know the developer recently updated their billing, enter 4.""")
    if issue_type == "1":
        month = input("What month are they missing the disbursement for? ").lower()
        new_issue = jira.create_issue(
            project='BILL',
            summary='Developer %s missing disbursement for %s' %(dev_uuid, month),
            description=('%s Developer %s (%s), InfoLease Vendor Code %s, has not received disbursements for %s') %(app_country, dev_name, dev_uuid, infolease, month),
            issuetype={'name': 'Task'},
            assignee={'name': 'susan.chambers'}
        )

    if issue_type == "2":
        merchant_uuid = input("What is the merchant UUID? ")
        new_issue = jira.create_issue(
            project='BILL',
            summary='Developer %s missing disbursement for %s' %(dev_uuid, merchant_uuid),
            description=('%s Developer %s (%s), InfoLease Vendor Code %s, has not received disbursements for %s') %(app_country, dev_name, dev_uuid, infolease, merchant_uuid),
            issuetype={'name': 'Task'},
            assignee={'name': 'susan.chambers'}
        )
    if issue_type == "3":
        merchant_uuid = input("What are the merchant UUIDs? Please enter as UUID1, UUID2, ... ")
        new_issue = jira.create_issue(
            project='BILL',
            summary='Developer %s is showing pending charges for merchant(s): %s' %(dev_uuid, merchant_uuid),
            description=('%s Developer %s (%s), InfoLease Vendor Code %s, shows pending charges for merchant(s): %s') %(app_country, dev_name, dev_uuid, infolease, merchant_uuid),
            issuetype={'name': 'Task'},
            assignee={'name': 'susan.chambers'}
        )
    if issue_type == "4":
        check_status = input("Have you sent the voided check to Lisa? ").lower()
        if check_status == "no":
            print("Please email the copy of the voided check to Lisa prior to or immediately after opening Jira issue.")
        account_updated = input("Do you know when the developer changed their banking information? ").lower()
        if account_updated == "yes":
            change_date = input("Please enter the month that the banking info was changed: ")
        if account_updated == "no":
            query = ("select modified_time, bank_account_last_four, bank_routing_number from developer_bank_info_history where developer_uuid = '%s' order by modified_time asc") %(dev_uuid)
            query_output = ()
            results = ()
            cursor = db.cursor()
            cursor.execute(query)
            for results in cursor:
                if results == None:
                    print("No modification to the banking information has been found for this developer.")
                change_date = results[0]
                bank_acct = results[1]
                routing = results[2]
                print("Modified Time: ", results[0])
                print("Last 4 of Account: ", results[1])
                print("Routing Number", results[2])
        new_issue = jira.create_issue(
            project='BILL',
            summary='Developer %s billing needs to be updated' %(dev_uuid),
            description=('%s Developer %s (%s), InfoLease Vendor Code %s, updated their account information in %s. A copy of the voided check has been emailed to Lisa.') %(app_country, dev_name, dev_uuid, infolease, change_date),
            issuetype={'name': 'Task'},
            assignee={'name': 'susan.chambers'}
        )
# else:
#     csv = input("Do you want to download a CSV with the developer banking history?")


#
# ssl_set = {}
# ssl_set["cipher"] = "DHE-RSA-AES256-SHA"
# db = MySQLdb.connect(host="db-usprod-shard0.corp.clover.com",
#                      user="susanc",
#                      passwd="asWJn9rWa88=", # pw Kess provided originally
#                      db="meta", # database you're trying to use
#                      ssl=ssl_set)
#
# # query_shard0()
# cursor.execute("SELECT * FROM employees")
# row = cursor.fetchone()
# while row is not None:
#     print(row)
#     row = cursor.fetchone()
