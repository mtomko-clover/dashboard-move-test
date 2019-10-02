import MySQLdb
import openpyxl
import time

# Import jira module for opening new jiras for developer account tracking
from jira import JIRA
import getpass

# Initialize JIRA
PWD = getpass.getpass('Jira Password: ') # prompt for Jira password
DAV = JIRA('https://jira.dev.clover.com', basic_auth=('LDAP', PWD))

##########################################################
###################### FUNCTIONS #########################
##########################################################

def open_jira(developer,file_name):
    """
    Open a Jira:
    -----------
    Input:
    * developer - developer info pulled from p804 in a list
    * file_name - file_name of the .txt file to attach to jira, in a string
    Output: none - will open Jira and let you know which jira number it was
    """
    issue_name = "[EU] {} {}".format(*developer)
    issue_description = "{}\n{}\n{}".format(*developer)

    new_DAV = DAV.create_issue(project='DAV', summary=issue_name, description=issue_description, issuetype={'name': 'Task'})
    DAV.add_attachment(issue=new_DAV,attachment=file_name)
    DAV.transition_issue(new_DAV,'131') # transitions issue to 'Credit'
    DAV.assign_issue(new_DAV, 'nathan.binding') # assign to Nathan

    print "\n{} has been created".format(new_DAV)


def search_jira(uuid):
    """
    Search Jira for an existing open ticket for this developer UUID:
    --------------
    Input:
    * uuid - uuid we are looking for an exisitng jira
    Output:
    * existing_jira - the existing ticket
    * null - when there is no existing ticket
    """
    try:
        existing_jira = DAV.search_issues('text ~ "{}" and project=DAV'.format(uuid))
        return str(existing_jira[0]) # gives back Jira number in str
    except:
        return None


def update_jira(jira_number,file_name):
    """
    Update a Jira:
    -------------
    Input:
    * jira_number - existing Jira that is already open for this developer account
    * file_name - file_name of the .txt file to attach to jira, in a string
    Output: none - will update the jira with the new .txt file for the developer
    """
    DAV.add_attachment(issue=jira_number,attachment=file_name)
    # DAV.transition_issue(jira_number,'131') # transitions issue to 'Credit' after updating

    print "\n{} has been updated".format(jira_number)


def query_p804(query):
    """
    Query p804:
    -----------
    Input: query in string format ex. str(SELECT * FROM developer WHERE uuid IN ('123124234'))
    Output: query_output which is tuple of data from the query output
    """
    ssl_set = {}
    ssl_set["cipher"] = "DHE-RSA-AES256-SHA"
    db = MySQLdb.connect(host="p804.corp.clover.com",
                        user="LDAP",
                        passwd="P804PASSWORD", # pw Kess provided originally
                        db="reporting") # database you're trying to use
    cur = db.cursor()
    cur.execute(query)
    query_output = cur.fetchall()
    db.close()

    return query_output


def credit(uuids):
    """
    Create .txt files for each developer UUID provided:
    -----------
    Input: uuids in tuple format for query ex. ('1234234','123123123')
    Output: none - .txt files will be created for each UUID in the list provided, and saved in the local directory of python file
    """
    query = "SELECT developer_name, uuid, email, business_legal_name, business_address, business_city, business_state, business_country, business_postal_code, CONCAT(first_name,' ',last_name), address, city, state, country, postal_code FROM eu_developers WHERE uuid IN " + uuids + " GROUP BY uuid"
    developer_output = query_p804(query)

    for developer in developer_output:
        developer_str = ""
        developer_list = list(developer)

        developer_list = [field.replace('-1','N/A') for field in developer_list]

        if developer_list[3] == '':
            count = 3
            while count < 9:
                del developer_list[3]
                count += 1

            developer_list.insert(3,'')
            developer_list.insert(4, "Individual Information")
            developer_list.insert(5, "----------------------")

            developer_list[6] = "Name: {}".format(developer_list[6])
            developer_list[7] = "Address: {}".format(developer_list[7])
            developer_list[8] = "City: {}".format(developer_list[8])
            developer_list[9] = "State: {}".format(developer_list[9])
            developer_list[10] = "Country: {}".format(developer_list[10])
            developer_list[11] = "Postal Code: {}".format(developer_list[11])

        else:
            developer_list.insert(3,'')
            developer_list.insert(4, "Corporate Information")
            developer_list.insert(5, "---------------------")
            developer_list.insert(12,'')
            developer_list.insert(13, "Individual Information")
            developer_list.insert(14, "----------------------")

            developer_list[6] = "Business Name: {}".format(developer_list[6])
            developer_list[7] = "Address: {}".format(developer_list[7])
            developer_list[8] = "City: {}".format(developer_list[8])
            developer_list[9] = "State: {}".format(developer_list[9])
            developer_list[10] = "Country: {}".format(developer_list[10])
            developer_list[11] = "Postal Code: {}".format(developer_list[11])
            # developer_list[12] = "EIN/Tax ID: {}".format(developer_list[12])

            developer_list[15] = "Name: {}".format(developer_list[15])
            developer_list[16] = "Address: {}".format(developer_list[16])
            developer_list[17] = "City: {}".format(developer_list[17])
            developer_list[18] = "State: {}".format(developer_list[18])
            developer_list[19] = "Country: {}".format(developer_list[19])
            developer_list[20] = "Postal Code: {}".format(developer_list[20])

        for line in developer_list:
            developer_str += line + "\r\n"

        # Output to .txt file and open Jira
        file_name = "{}.txt".format(developer_list[0])
        file = open(file_name,'w')
        file.write(developer_str)
        file.close()

        # Check for an existing JIRA if it exists
        uuid = str(developer_list[1])
        existing_jira = search_jira(uuid)

        if existing_jira == None:
            open_jira(developer,file_name)
        else:
            update_jira(existing_jira,file_name)


def ofac(uuids):
    """
    Create .xlsx file in OFAC form for UUIDs provided
    -----------
    Input: uuids in tuple format for query ex. ('1234234','123123123')
    Output: none - .xlsx file will be created named OFAC_WLF_CLVMMDDYYYY.xlsx where MMDDYYYY is today, and Master OFAC file will be updated.
    """
    # Open the current OFAC file
    # ofac_file = openpyxl.load_workbook('[DRAFT] OFAC_WLF_CLVMMDDYYYY.xlsx')
    # business = ofac_file.get_sheet_by_name('Business')
    # principal = ofac_file.get_sheet_by_name('Principal')

    query = "SELECT uuid, developer_name, business_address, business_city, business_state, business_country, business_postal_code, business_legal_name, CONCAT(first_name,' ',last_name), address, city, state, country, postal_code FROM eu_developers WHERE uuid IN " + uuids
    developer_output = query_p804(query)

    developer = []

    for developer_tuple in developer_output:
        developer_list = list(developer_tuple)
        # Copy all individual info into business info if empty
        if developer_list[2] == "":
            developer_list[2] = developer_list[9]
            developer_list[3] = developer_list[10]
            developer_list[4] = developer_list[11]
            developer_list[5] = developer_list[12]
            developer_list[6] = developer_list[13]
            developer_list[7] = developer_list[8]

        developer_list = [field.replace('-1','N/A') for field in developer_list]
        developer.append(developer_list)

    number_of_developers = len(uuids.split(','))

    # for num in range(number_of_developers):
    #     clv = 'A' + str(4+num) # CLV value
    #     uuid_cell = 'B' + str(4+num) # uuid value
    #     date_cell = 'C' + str(4+num) # date field
    #     date = time.strftime("%m/%d/%Y")
    #
    #     business_sheet = [
    #         uuid_cell, # uuid_cell
    #         'F' + str(4+num), # dba name
    #         'G' + str(4+num), # business address
    #         'J' + str(4+num), # business city
    #         'K' + str(4+num), # business state
    #         'L' + str(4+num), # business country
    #         'N' + str(4+num), # business zip
    #         # 'Q' + str(4+num), # business tin
    #         'S' + str(4+num) # business legal name
    #     ]
    #
    #     # Populate business info
    #     b_A = 'AE' + str(4+num) # A value
    #     b_X = 'AF' + str(4+num) # X value
    #
    #     business[clv] = "CLV"
    #     business[b_A] = "A"
    #     business[b_X] = "X"
    #     business[date_cell] = date
    #
    #     for dev_idx in range(len(business_sheet)):
    #         cell = business_sheet[dev_idx]
    #         business[cell] = developer[num][dev_idx]
    #
    #     # Populate principal info
    #     dob = 'T' + str(4+num) # Set to 1/1/1990
    #     ssn = 'U' + str(4+num) # Set to 0
    #     p_A = 'W' + str(4+num) # A value
    #     p_X = 'X' + str(4+num) # X value
    #     p_1 = 'D' + str(4+num) # 1 value
    #
    #     principal_sheet = [
    #         'E' + str(4+num), # first name,last name
    #         'H' + str(4+num), # address
    #         'K' + str(4+num), # city
    #         'L' + str(4+num), # state
    #         'M' + str(4+num), # country
    #         'N' + str(4+num), # zip
    #     ]
    #
    #     # Populate principal info
    #     principal[clv] = "CLV"
    #     principal[date_cell] = date
    #     principal[uuid_cell] = developer[num][0]
    #     principal[dob] = "1/1/1990"
    #     principal[ssn] = "0"
    #     principal[p_A] = "A"
    #     principal[p_X] = "X"
    #     principal[p_1] = "1"
    #
    #     for dev_idx in range(len(principal_sheet)):
    #         cell = principal_sheet[dev_idx]
    #         principal[cell] = developer[num][dev_idx+8]
    #
    # date_format = date.split('/')
    # date_format = ''.join(date_format)
    #
    # file_name = 'EU OFAC_WLF_CLV' + date_format + '.xlsx'
    # ofac_file.save(file_name)

    add_to_ofac_master(developer,number_of_developers)


def add_to_ofac_master(developer,number_of_developers):
    """
    Update .xlsx file for Master OFAC form:
    -----------
    Input:
    * developer - developer info pulled from p804 in list form. Includes all developers
    * number_of_developers - int of how many developers there are to add
    Output: none - Master OFAC .xlsx file will be updated with developers
    """
    # Open the Master OFAC file
    master_file = openpyxl.load_workbook('Master EU OFAC_WLF_CLV MMDDYYYY.xlsx')
    master_business = master_file.get_sheet_by_name('Business')
    master_principal = master_file.get_sheet_by_name('Principal')

    # Find the first empty row on the business sheet
    business_max_row = 1
    while master_business['A'+str(business_max_row)].value is not None:
        business_max_row += 1

    # Find the first empty row on the principal sheet
    principal_max_row = 1
    while master_principal['A' + str(principal_max_row)].value is not None:
        principal_max_row += 1

    # Add data to the master OFAC file - Business Sheet
    for num in range(number_of_developers):
        clv = 'A' + str(business_max_row+num) # CLV value
        uuid_cell = 'B' + str(business_max_row+num) # uuid value
        date_cell = 'C' + str(business_max_row+num) # date field
        date = time.strftime("%m/%d/%Y")

        business_sheet = [
            uuid_cell, # uuid_cell
            'F' + str(business_max_row+num), # dba name
            'G' + str(business_max_row+num), # business address
            'J' + str(business_max_row+num), # business city
            'K' + str(business_max_row+num), # business state
            'L' + str(business_max_row+num), # business country
            'N' + str(business_max_row+num), # business zip
            # 'Q' + str(business_max_row+num), # business tin
            'S' + str(business_max_row+num) # business legal name
        ]

        # Populate business info
        b_A = 'AE' + str(business_max_row+num) # A value
        b_X = 'AF' + str(business_max_row+num) # X value

        master_business[clv] = "CLV"
        master_business[b_A] = "A"
        master_business[b_X] = "X"
        master_business[date_cell] = date

        for dev_idx in range(len(business_sheet)):
            cell = business_sheet[dev_idx]
            master_business[cell] = developer[num][dev_idx]

    # Add data to the master OFAC file - Principal Sheet
        clv = 'A' + str(principal_max_row+num) # CLV value
        uuid_cell = 'B' + str(principal_max_row+num) # uuid value
        date_cell = 'C' + str(principal_max_row+num) # date field
        date = time.strftime("%m/%d/%Y")

        dob = 'T' + str(principal_max_row+num) # Set to 1/1/1990
        ssn = 'U' + str(principal_max_row+num) # Set to 0
        p_A = 'W' + str(principal_max_row+num) # A value
        p_X = 'X' + str(principal_max_row+num) # X value
        p_1 = 'D' + str(principal_max_row+num) # 1 value

        principal_sheet = [
            'E' + str(principal_max_row+num), # first name,last name
            'H' + str(principal_max_row+num), # address
            'K' + str(principal_max_row+num), # city
            'L' + str(principal_max_row+num), # state
            'M' + str(principal_max_row+num), # country
            'N' + str(principal_max_row+num), # zip
        ]

        # Populate principal info
        master_principal[clv] = "CLV"
        master_principal[date_cell] = date
        master_principal[uuid_cell] = developer[num][0]
        master_principal[dob] = "1/1/1990"
        master_principal[ssn] = "0"
        master_principal[p_A] = "A"
        master_principal[p_X] = "X"
        master_principal[p_1] = "1"

        for dev_idx in range(len(principal_sheet)):
            cell = principal_sheet[dev_idx]
            master_principal[cell] = developer[num][dev_idx+8]

    master_file.save("Master EU OFAC_WLF_CLV MMDDYYYY.xlsx")
    print "Developers added to Master EU OFAC"


def print_menu():
    """
    Print menu for this prelaunch script
    ------------------------------------
    Input: none
    Output: Credit .txt or OFAC .xlsx file for prelaunch activities
    """

    choosing = True
    while choosing:
        print """
Choose what you would like to run:
    (1) Create Credit .txt files
    (2) Create OFAC spreadsheet
    (3) Quit
        """
        choice = raw_input("> ")

        if choice == "1":
            print "\nEnter Credit UUIDs in the following format: ('UUID1', 'UUID2')"
            credit_uuids = raw_input("> ")
            # should look like this ('GVAEY1AB0JVMW','AAC2MMHKJR6N2')
            credit(credit_uuids)
        elif choice == "2":
            print "\nEnter OFAC UUIDs in the following format: ('UUID1', 'UUID2')"
            ofac_uuids = raw_input("> ")
            ofac(ofac_uuids)
        else:
            choosing = False

##########################################################################################################

print_menu()
