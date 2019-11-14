from collections import namedtuple
import getpass
import datetime
import pymysql
from dav_jira import *

def query_metadb(query, db_host, shard_user, shard_PWD):
    """
    Query p801:
    -----------
    Input: query in string format ex. str(SELECT * FROM developer WHERE uuid IN ('123124234'))
    Output: query_output which is tuple of data from the query output
    """

    print(f'query db: {query}')

    ssl_set = {}
    ssl_set["cipher"] = "DHE-RSA-AES256-SHA"
    db = pymysql.connect(host = db_host,
                         user = shard_user,
                         password = shard_PWD, 
                         db = "meta", # database you're trying to use
                         charset='utf8mb4',
                         cursorclass=pymysql.cursors.DictCursor,
                         ssl=ssl_set
                        )
    cur = db.cursor()
    cur.execute(query)
    query_output = cur.fetchall()
    db.close()

    print('query db complete')
    # print(query_output)

    return query_output


def update_developers_by_date(last_time, db_host, db_user, db_pass, jira_host, jira_user, jira_pass, region, dry_run):
    """
    Auto-generate the latest developer UUIDs given the last time the script was run.

    input: last time the script was run
    output: a string of UUIDs to be sent into credit
    """

    record_count = 0

    formatted_utc_time = str(last_time)
    changed_developer_accts = "SELECT uuid FROM developer WHERE approval_status = \"PENDING\" AND modified_time  > \"" +formatted_utc_time +"\" ORDER BY modified_time asc;"

    uuid_tuple = query_metadb(changed_developer_accts, db_host, db_user, db_pass)
    if uuid_tuple is not None and len(uuid_tuple) > 0:
        record_count = len(uuid_tuple)

    print(f'query metadb results: {record_count} developers')
    # print('== uuids')
    # print(len(uuid_tuple))
    # print(uuid_tuple)

    #If there are any UUIDs in the string, run credit, else do nothing
    if record_count > 0:
        stringified_uuids = uuid_tuple_to_string(uuid_tuple)

        # get updated developer record data; create files and fresh jira text for new data for JIRA merge
        files = create_text_and_credit_files_from_db(stringified_uuids, db_host, db_user, db_pass, region)

        # print('== create_text_and_credit_files_from_db results')
        # print(str(files).replace('},', '},\n'))

        # merge (create/update) Jiras with data from db
        jira_create_update_with_files(files, jira_host, jira_user, jira_pass, dry_run)
    else:
        print ("No DAV tickets to add.")
    
    return record_count


def uuid_tuple_to_string(uuid_tuple):
    """
    Format the UUIDs received from a Shard query so that they can immediately be used as a string for the Shard query that will pull the necessary information for 
    DAV tickets

    Input: Tuple in the format of [('UUID1',), ('UUID2',), ...]
    Output: String in the format of "'UUID1', 'UUID2', ..."
    """

    output_list = []

    for item in uuid_tuple:
        output_list.append(item["uuid"])

    # format output_list as a sql in statement: ['item', 'item'] => ('item', 'item')
    output = str(output_list)
    output = "(" + output.strip("[]") + ")"
    return output

def create_text_and_credit_files_from_db(uuids, db_host, db_user, db_pass, region):
    """
    Create .txt files for each developer UUID provided:
    -----------
    Input: uuids in tuple format for query ex. ('1234234','123123123')
    Output: none - .txt files will be created for each UUID in the list provided, and saved in the local directory of python file
    """

    print("building text files: create_text_and_credit_files_from_db()")

    # global region
    credit_files = []

    query = """

    SELECT name, 
        uuid, 
        email, 
        business_legal_name, 
        business_address, 
        business_city, 
        business_state, 
        business_country, 
        business_postal_code, 
        tin, 
        CONCAT(first_name,' ',last_name) as individual_name, 
        address, 
        city, 
        state, 
        country, 
        postal_code 
    FROM developer 
    WHERE uuid IN 
    
    """ + uuids
    
    developer_output = query_metadb(query, db_host, db_user, db_pass)

    for developer in developer_output:
        # print('**************************')
        # print(developer)
        status_string = ""
        developer_str = ""
        # Convert db row dictionary to named object for easier report code maintenance
        dev = namedtuple('Developer', developer.keys())(*developer.values())
        # print(dev)

        status_string += f"{dev.name}\n"
        status_string += f"{dev.uuid}\n"
        status_string += f"{dev.email}\n\n"
        developer_str += f"{dev.name}\n"
        developer_str += f"{dev.uuid}\n"
        developer_str += f"{dev.email}\n\n"
        
        # Optional Business sections
        if dev.business_legal_name is not None:
            status_string += "\n\n*Status*\nBusiness\n- {color:red}EIN{color} \n- {color:red}Credit{color}\n- {color:red}OFAC{color}"
            developer_str += "Corporate Information\n"
            developer_str += "---------------------\n"
            developer_str += f"Business Name: {dev.business_legal_name}\n"
            developer_str += f"Address: {dev.business_address}\n"
            developer_str += f"City: {dev.business_city}\n"
            developer_str += f"State: {dev.business_state}\n"
            developer_str += f"Country: {dev.business_country}\n"
            developer_str += f"Postal Code: {dev.business_postal_code}\n"
            developer_str += f"EIN/Tax ID: {dev.tin}\n\n"

        # Required Individual sections
        status_string += "\n\n*Status*\nIndividual\n- {color:red}Credit{color} \n- {color:red}OFAC{color}\n"
        if region != "US" or dev.country != ("US" or "USA" or "United States"):
            status_string +="\n- {color:red}Valid passport{color}"
        status_string += "\n\n"
        developer_str += "Individual Information\n"
        developer_str += "----------------------\n"
        developer_str += f"Name: {dev.individual_name}\n"
        developer_str += f"Address: {dev.address}\n"
        developer_str += f"City: {dev.city}\n"
        developer_str += f"State: {dev.state}\n"
        developer_str += f"Country: {dev.country}\n"
        developer_str += f"Postal Code: {dev.postal_code}\n\n"

        # print("== file:")
        # print(developer_str)

        # print("== jira:")
        # print(status_string)

        # Output to .txt file - refactor question: should this func just return data and let Jira func create files if it needs them?
        file_name = f"text_files/{dev.name}.txt"
        # print(" - " + file_name)
        file = open(file_name,'w')
        file.write(developer_str)
        file.write("\n\n")
        file.close()

        title=f"[{region}] {dev.name}  {dev.uuid}"

        credit_files.append({'uuid': dev.uuid, 'title': title, 'file': file_name, 'jira': status_string, 'region': region})

    #print('== files:')
    #print(listdir('text_files'))

    return credit_files

def jira_create_update_with_files(credit_files, jira_host, jira_user, jira_pass, dry_run):
    """
    Given a list of input credit_files, jira text, and uuids, handle Jira tasks: create new jiras, attach updated DAV text file data
    -----------
    Input: credit_files list of records with uuid, credit text filename, fresh jira base text
    Output: Jira updates
    
    """

    print(f'jira_create_update_with_files for {len(credit_files)} developers')

    created = 0
    updated = 0
    skipped = 0

    # Jira connection
    DAV = connect_jira(jira_host, jira_user, jira_pass)

    print('-- files: ')
    for filerecord in credit_files:
        file = namedtuple('DevFile', filerecord.keys())(*filerecord.values())
        # print(file)
        uuid = file.uuid
        title = file.title
        file_name = file.file
        description = file.jira
        region = file.region
        # print(uuid)
        # print(file_name)
        # print('description', description)
        jira_id = search_jira(uuid, DAV)

        if jira_id == None:
            print('  - no jira, CREATE NEW')
            open_jira(title, description, file_name, DAV, dry_run)
            created += 1
        else:
            print(jira_id)
            print(f'  - existing jira, UPDATE {jira_id}  {title}')
            updated += 1

        # Check for an existing JIRA if it exists
        ### uuid = str(developer_list[1])
        ### existing_jira = search_jira(uuid, DAV)
        ### 
        ### if existing_jira == None:
        ###     print('would create jira - skipping')
        ###     # open_jira(developer, file_name, status_string, DAV)
        ### else:
        ###     print('would update jira - skipping')
        ###     # update_jira(existing_jira, file_name, DAV)

    print(f'jiras_create_update_with_files complete: {created} created, {updated} updated, {skipped} skipped as already current')
