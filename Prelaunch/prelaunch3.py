import mysql.connector
import openpyxl
import time

# Import jira module for opening new jiras for developer account tracking
from jira import JIRA
import getpass
import  pytz, datetime, shelve


# Initialize JIRA
username = input("LDAP username: ")
PWD = getpass.getpass('LDAP Password: ') # prompt for Jira password
DAV = JIRA('https://jira.dev.clover.com', basic_auth=(username, PWD))

##########################################################
###################### FUNCTIONS #########################
##########################################################

def open_jira(developer,file_name, status_string):
    """
    Open a Jira:
    -----------
    * developer - developer info pulled from p801 in a list
    * file_name - file_name of the .txt file to attach to jira, in a string
    Output: none - will open Jira and let you know which jira number it was
    """


    issue_name = "[US] {} {}".format(*developer)
    issue_description = "{}\n{}\n{}".format(*developer)

    new_DAV = DAV.create_issue(project='DAV', summary=issue_name, description=issue_description + status_string, issuetype={'name': 'Task'})
    DAV.add_attachment(issue=new_DAV,attachment=file_name)
    DAV.transition_issue(new_DAV,'131') # transitions issue to 'Credit' at opening

    print("\n{} has been created".format(new_DAV))


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
    try:
        DAV.transition_issue(jira_number,'131') # transitions issue to 'Credit' after updating
    except: #transitioning an issue back to Credit when it was in Credit state generates an exception. 
        pass      #This empty exception-handling keeps the app from crashing in this case.

    print("\n{} has been updated".format(jira_number))


def query_p801(query):
    """
    Query p801:
    -----------
    Input: query in string format ex. str(SELECT * FROM developer WHERE uuid IN ('123124234'))
    Output: query_output which is tuple of data from the query output
    """

    ssl_set = {}
    shard_user = input("What is your Shard id?\n> ")
    shard_PWD = getpass.getpass("What is your password?\n> ")
    ssl_set["cipher"] = "DHE-RSA-AES256-SHA"
    db = mysql.connector.connect(host="db-usprd-shard0.corp.clover.com",
                        user= shard_user,
                        passwd= shard_PWD, 
                        db="meta" # database you're trying to use
                        )
    cur = db.cursor()
    cur.execute(query)
    query_output = cur.fetchall()
    db.close()

    return query_output


def auto_credit(last_time):
    """
    Auto-generate the latest developer UUIDs given the last time the script was run.

    input: last time the script was run
    output: a string of UUIDs to be sent into credit
    """

    formatted_utc_time = str(last_time)
    changed_developer_accts = "SELECT uuid FROM developer WHERE approval_status = \"PENDING\" AND modified_time  > \"" +formatted_utc_time +"\" ORDER BY modified_time asc;"

    uuid_tuple = query_p801(changed_developer_accts)
    stringified_uuids = uuid_tuple_to_string(uuid_tuple)

    #If there are any UUIDs in the string, run credit, else do nothing
    if len(stringified_uuids) > 2:
        credit(stringified_uuids)
    else:
        print ("No DAV tickets to add.")


def uuid_tuple_to_string(uuid_tuple):
    """
    Format the UUIDs received from a Shard query so that they can immediately be used as a string for the Shard query that will pull the necessary information for 
    DAV tickets

    Input: Tuple in the format of [('UUID1',), ('UUID2',), ...]
    Output: String in the format of "'UUID1', 'UUID2', ..."
    """

    new_tu = []

    for item in uuid_tuple:
        new_tu.append(item[0])

    tu_string = str(new_tu)
    tu_string = "(" + tu_string.strip("[]") + ")"

    return tu_string




def credit(uuids):
    """
    Create .txt files for each developer UUID provided:
    -----------
    Input: uuids in tuple format for query ex. ('1234234','123123123')
    Output: none - .txt files will be created for each UUID in the list provided, and saved in the local directory of python file
    """

    query = "SELECT name, uuid, email, business_legal_name, business_address, business_city, business_state, business_country, business_postal_code, tin, CONCAT(first_name,' ',last_name), address, city, state, country, postal_code FROM developer WHERE uuid IN " + uuids
    developer_output = query_p801(query)

    for developer in developer_output:
        status_string = ""
        developer_str = ""
        developer_list = list(developer)

        if developer_list[3] == '':
            status_string += "\n\n*Status*\nIndividual\n- {color:red}Credit{color} \n- {color:red}OFAC{color}"
            count = 3
            while count < 10:
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
            status_string += "\n\n*Status*\nBusiness\n- {color:red}EIN{color} \n- {color:red}Credit{color}\n- {color:red}OFAC{color}"
            status_string += "\n\nIndividual\n- {color:red}Credit{color} \n- {color:red}OFAC{color}"
            developer_list.insert(3,'')
            developer_list.insert(4, "Corporate Information")
            developer_list.insert(5, "---------------------")
            developer_list.insert(13,'')
            developer_list.insert(14, "Individual Information")
            developer_list.insert(15, "----------------------")

            developer_list[6] = "Business Name: {}".format(developer_list[6])
            developer_list[7] = "Address: {}".format(developer_list[7])
            developer_list[8] = "City: {}".format(developer_list[8])
            developer_list[9] = "State: {}".format(developer_list[9])
            developer_list[10] = "Country: {}".format(developer_list[10])
            developer_list[11] = "Postal Code: {}".format(developer_list[11])
            developer_list[12] = "EIN/Tax ID: {}".format(developer_list[12])

            developer_list[16] = "Name: {}".format(developer_list[16])
            developer_list[17] = "Address: {}".format(developer_list[17])
            developer_list[18] = "City: {}".format(developer_list[18])
            developer_list[19] = "State: {}".format(developer_list[19])
            developer_list[20] = "Country: {}".format(developer_list[20])
            developer_list[21] = "Postal Code: {}".format(developer_list[21])

        for line in developer_list:
            developer_str += line + "\r\n"

        # Output to .txt file and open Jira
        file_name = "dev_txt_files/{}.txt".format(developer_list[0])
        file = open(file_name,'w')
        file.write(developer_str)
        file.write("\n\n")

        file.close()

        # Check for an existing JIRA if it exists
        uuid = str(developer_list[1])
        existing_jira = search_jira(uuid)

        if existing_jira == None:
            open_jira(developer,file_name, status_string)
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

    query = "SELECT uuid, name, business_address, business_city, business_state, business_country, business_postal_code, tin, business_legal_name, CONCAT(first_name,' ',last_name), address, city, state, country, postal_code FROM developer WHERE uuid IN " + uuids
    developer_output = query_p801(query)

    developer = []

    for developer_tuple in developer_output:
        developer_list = list(developer_tuple)
        # Copy all individual info into business info if empty
        if developer_list[2] == "":
            developer_list[2] = developer_list[10]
            developer_list[3] = developer_list[11]
            developer_list[4] = developer_list[12]
            developer_list[5] = developer_list[13]
            developer_list[6] = developer_list[14]
            developer_list[8] = developer_list[9]

        developer.append(developer_list)

    number_of_developers = len(developer)

    add_to_ofac_master(developer,number_of_developers)


    '''
THESE LINES ARE IN PROGRESS. PLEASE IGNORE FOR NOW
-Richelle
'''


#def auto_ofac():
#    ofac_run_time = datetime.datetime.now()
#    ofac_utc_time = ofac_run_time.astimezone(pytz.utc)
#    ofac_uuids = []

    #query = "SELECT uuid IN developer WHERE approval_status = \'APPROVED\' AND modified_time > " + ofac_utc_time

    #Note to self: cannot pull modified time from shard to get the UUIDs that need to be OFAC-ed. Will need to use JQL


def add_to_ofac_master(developer,number_of_developers):
    """
    Update .xlsx file for Master OFAC form:
    -----------
    Input:
    * developer - developer info pulled from p801 in list form. Includes all developers
    * number_of_developers - int of how many developers there are to add
    Output: none - Master OFAC .xlsx file will be updated with developers
    """
    # Open the Master OFAC file
    master_file = openpyxl.load_workbook('Master OFAC_WLF_CLV MMDDYYYY.xlsx')
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
            'Q' + str(business_max_row+num), # business tin
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
            master_principal[cell] = developer[num][dev_idx+9]

    master_file.save("Master OFAC_WLF_CLV MMDDYYYY.xlsx")
    print("Developers added to Master OFAC")

def open_shelf(txt_files = False):
    new_time = datetime.datetime.now()
    utc_time = new_time.astimezone(pytz.utc)

    last_time = ""


    with shelve.open("timestamp") as the_shelf:
        last_time = the_shelf["last time"]
        last_time = last_time.astimezone(pytz.utc)
        print("App was last run on", last_time)

        if txt_files:
            the_shelf["last time"] = utc_time

    print(last_time)
    return last_time


def print_menu():
    """
    Print menu for this prelaunch script
    ------------------------------------
    Input: none
    Output: Credit .txt or OFAC .xlsx file for prelaunch activities
    """
    global utc_time
    choosing = True
    while choosing:
        print("""Choose what you would like to run:
    (1) Create Credit .txt files
    (2) Create OFAC spreadsheet
    (3) Quit
    (4) Override Auto-Credit
        """)
        choice = input("> ")

        if choice == "1":
            utc_time = open_shelf(txt_files = True)
            #the_shelf["last time"] = new_time

            
            auto_credit(utc_time)
        elif choice == "2":
            print("\nEnter OFAC UUIDs in the following format: ('UUID1', 'UUID2')")
            ofac_uuids = input("> ")
            ofac(ofac_uuids)
        elif choice == "4":
            print("\nEnter Credit UUIDs in the following format: ('UUID1', 'UUID2')")
            credit_uuids = input("> ")
            # should look like this ('GVAEY1AB0JVMW','AAC2MMHKJR6N2')
            credit(credit_uuids)

        else:
            choosing = False

##########################################################################################################

print_menu()

