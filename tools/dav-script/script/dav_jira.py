from jira import JIRA
from io import StringIO

JIRA_STATUS_DAV_CREDIT='131'

def connect_jira(jira_host, jira_user, jira_pass):
    return JIRA(jira_host, basic_auth=(jira_user, jira_pass))

def open_jira(title, description, filename, data, DAV, dry_run):
    """
    Open a Jira:
    -----------
    * developer - developer info pulled from p801 in a list
    * file_name - file_name of the .txt file to attach to jira, in a string
    Output: none - will open Jira and let you know which jira number it was
    """

    if dry_run:
        print('++ creating jira dav issue')
        print(f'     {title}')
        print(f'     {attachment}')
        print(f'     {description}')

        print('\n - faked creating Jira')

    else:
        attachment = StringIO()
        attachment.write(data)

        new_DAV = DAV.create_issue(project='DAV', summary=title, description=description, issuetype={'name': 'Task'})
        DAV.add_attachment(issue=new_DAV, attachment=attachment, filename=filename)
        #todo: was magic number 131 - now JIRA_STATUS_DAV_CREDIT constant(ish)
        DAV.transition_issue(new_DAV,JIRA_STATUS_DAV_CREDIT) # transitions issue to 'Credit' at opening
    
        print("\n{} has been created".format(new_DAV))
        # print('oops- not ready for non-dry-run')


def search_jira(uuid, DAV):
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

def get_attachments(jira_number, DAV):
    """
    Get Attachments:
    ---------------
    Given a Jira, get the (text file) attachments so we can see if our new dev data is
    actually a duplicate of what the jira already has and avoid duplicating the attachment.
    This is to remove the need to track the dates that the script runs - make it a safe
    action.
    """

    # print("getting attachments")
    attachments = None
    issue = DAV.issue(jira_number)
    if issue is not None:
        attachments = issue.fields.attachment

    # print(attachments)

    return attachments

def update_jira(jira_number, filename, data, DAV, dry_run):
    """
    Update a Jira:
    -------------
    Input:
    * jira_number - existing Jira that is already open for this developer account
    * file_name - file_name of the .txt file to attach to jira, in a string
    Output: none - will update the jira with the new .txt file for the developer
    """

    #print("Updated Jira:", jira_number)
    if dry_run:
        print('++ updating jira dav issue')
        print(f'     {jira_number}')
        print(f'     {filename}')
        print(f'     {attachment_data}')

        print('\n - faked creating Jira & updating status')

    else:
        attachment = StringIO()
        attachment.write(data)
        DAV.add_attachment(issue=jira_number, attachment=attachment, filename=filename)
        try:
            # transition issue to 'Credit' after updating
            DAV.transition_issue(jira_number, JIRA_STATUS_DAV_CREDIT) 
        except:   # transitioning an issue back to Credit when it was in Credit state generates an exception. 
            print('failed to transition_issue')
            pass  # This empty exception-handling keeps the app from crashing in this case.


    print("\n{} has been updated".format(jira_number))

