from collections import namedtuple
import re
import getpass
import hashlib
import datetime
import difflib
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
        created, updated, skipped = jira_create_update_with_files(files, jira_host, jira_user, jira_pass, dry_run)
    else:
        created, updated, skipped = 0, 0, 0
        print ("No DAV tickets to add.")
    
    return namedtuple('Result', ('total', 'created', 'updated', 'skipped'))(record_count, created, updated, skipped)


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

        status_string += f"{dev.name or '<missing>'}\n"
        status_string += f"{dev.uuid or '<missing>'}\n"
        status_string += f"{dev.email or '<missing>'}\n\n"
        developer_str += f"{dev.name or '<missing>'}\n"
        developer_str += f"{dev.uuid or '<missing>'}\n"
        developer_str += f"{dev.email or '<missing>'}\n\n"
        
        # Optional Business sections
        if dev.business_legal_name is not None:
            status_string += "\n\n*Status*\nBusiness\n- {color:red}EIN{color} \n- {color:red}Credit{color}\n- {color:red}OFAC{color}"
            developer_str += "Corporate Information\n"
            developer_str += "---------------------\n"
            developer_str += f"Business Name: {dev.business_legal_name or ''}\n"
            developer_str += f"Address: {dev.business_address or ''}\n"
            developer_str += f"City: {dev.business_city or ''}\n"
            developer_str += f"State: {dev.business_state or ''}\n"
            developer_str += f"Country: {dev.business_country or ''}\n"
            developer_str += f"Postal Code: {dev.business_postal_code or ''}\n"
            developer_str += f"EIN/Tax ID: {dev.tin or ''}\n\n"

        # Required Individual sections
        status_string += "\n\n*Status*\nIndividual\n- {color:red}Credit{color} \n- {color:red}OFAC{color}\n"
        if region != "US" or dev.country != ("US" or "USA" or "United States"):
            status_string +="\n- {color:red}Valid passport{color}"
        status_string += "\n\n"
        developer_str += "Individual Information\n"
        developer_str += "----------------------\n"
        developer_str += f"Name: {dev.individual_name or ''}\n"
        developer_str += f"Address: {dev.address or ''}\n"
        developer_str += f"City: {dev.city or ''}\n"
        developer_str += f"State: {dev.state or ''}\n"
        developer_str += f"Country: {dev.country or ''}\n"
        developer_str += f"Postal Code: {dev.postal_code or ''}\n\n\n"

        # print("== file:")
        # print(developer_str)

        # print("== jira:")
        # print(status_string)

        filename = f"{dev.name}.txt"

        # Output to .txt file - TODO: refactor/remove
        # file_name = f"text_files/{filename}"
        # print(" - " + file_name)
        # file = open(file_name,'w', encoding='utf-8')
        # file.write(developer_str)
        # file.close()

        title=f"[{region}] {dev.name}  {dev.uuid}"

        credit_files.append({'uuid': dev.uuid, 'title': title, 'filename': filename, 'data': developer_str, 'jira': status_string, 'region': region})

    #print('== files:')
    #print(listdir('text_files'))

    return credit_files

# change a string (text attachment) to be comparable ignoring whitespace and blank lines
def CannonicalizeString(string):
    value = string.strip()
    value = value.replace('\r','').replace('\n', '; ').replace('\t', '    ')
    value = re.sub(r' +', ' ', value)
    value = value.replace(';', '\n')
    return value

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
        file_data = CannonicalizeString(file.data)
        description = file.jira
        region = file.region
        # print(uuid)
        # print(file.filename)
        # print('description', description)
        jira_id = search_jira(uuid, DAV)

        if jira_id == None:
            print('  - no jira, CREATE NEW')
            open_jira(title, description, file.filename, file.data, DAV, dry_run)
            created += 1
        else:
            print(jira_id)
            print(f'  - existing jira, maybe UPDATE {jira_id}  {title}')

            attachments = get_attachments(jira_id, DAV)
            dupe = False
            for attachment in attachments:
                if attachment.mimeType == 'text/plain':
                    # print(f'  : attachment {attachment.filename}')
                    attach = CannonicalizeString(str(attachment.get().decode('utf-8')))

                    if attach == file_data:
                        # print(' + attachments match')
                        dupe = True
                        break
                    else:
                        print(' - nonmatching attachment')

                        # print details and diff on cannonicalized attachments - verify good diff or not
                        prefix = '\n     | '
                        print(' -- original and contents --\n')
                        print(prefix + file_data.replace('\n', prefix))
                        print('\n -- ------------------- --\n')
                        print(prefix + attach.replace('\n', prefix))
                        print('\n -- attachment contents --')

                        print('\n -- diff --')
                        for i,s in enumerate(difflib.ndiff(file_data, attach)):
                            if s[0]==' ': continue
                            elif s[0]=='-':
                                print(u'   Delete "{}" from position {}'.format(s[-1],i))
                            elif s[0]=='+':
                                print(u'   Add "{}" to position {}'.format(s[-1],i))    
                        print('\n -- diff --')
                        print()   
            if not dupe:
                print(' no matching attachment, attaching new data')
                update_jira(jira_id, file.filename, file.data, DAV, dry_run)
                updated += 1
            else:
                print(' found matching attachment, skipping updating')
                skipped += 1
            

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
    print()
    print(f'jiras_create_update_with_files complete: {created} created, {updated} updated, {skipped} skipped as already current')
    return created, updated, skipped
