import mysql.connector
import os
import requests
import webbrowser

# Import jira module for opening new jiras for developer app approval tracking
from jira import JIRA
import getpass

class DAA:
    def __init__(self):
        self.jira = None
        self.app = None

    # Initialize JIRA
    def auth(self, username):
        PWD = getpass.getpass('Jira Password: ') # prompt for Jira password
        self.jira = JIRA('https://jira.dev.clover.com', basic_auth=(username, PWD))

    ##########################################################
    ###################### FUNCTIONS #########################
    ##########################################################

    def open_jira(self, app_info, ticket_type):
        """
        Open a Jira:
        -----------
        * app_info - relevant info pulled from p801 in dictionary form
        Output: none - will open Jira and let you know which jira number it was
        """
        if ticket_type == "app_approval":
            existing_jira = self.search_jira(app_info["app_uuid"], ticket_type)

            if existing_jira:
                print("JIRA for this app already exists at {}".format(existing_jira))
                self.app = existing_jira
                return existing_jira
            else:
                issue_name = "[US] {} by {} {}".format(app_info["app_name"], app_info["dev_name"], app_info["app_uuid"])
                issue_description = "App ID: {}\nDev ID: {}".format(app_info["app_uuid"], app_info["dev_uuid"])

                new_DAA = self.jira.create_issue(project='DAA', summary=issue_name, description=issue_description, issuetype={'name': 'Task'})
                print("DAA has been created")
                return new_DAA

        elif ticket_type == "logo":
            # search and download the icon to attach
            existing_jira = self.search_jira(app_info["app_uuid"], ticket_type)

            if existing_jira:
                print("JIRA for this app already exists at {}".format(existing_jira))
                return existing_jira
            else:
                self.get_icon(app_info["icon_filename"])

                issue_name = "[US] LOGO/BRAND - {}".format(app_info["app_name"])
                issue_description = "Hi [~Christopher.Demetriades@firstdata.com],\n{} by {} is attached for your review.\nThanks!".format(app_info["app_name"], app_info["dev_name"])

                new_DLV = self.jira.create_issue(project='DLV', summary=issue_name, description=issue_description, issuetype={'name': 'Task'})
                self.jira.add_attachment(issue=new_DLV, attachment=app_info["icon_filename"])
                os.remove(app_info["icon_filename"])
                print("DLV LOGO has been created")
                return new_DLV

        elif ticket_type == "privacy":
            existing_jira = self.search_jira("{} by {}".format(app_info["app_name"], app_info["dev_name"]), ticket_type)

            if existing_jira:
                print("JIRA for this app already exists at {}".format(existing_jira))
                return existing_jira
            else:
                issue_name = "[US] {} Privacy Policy".format(app_info["dev_name"])
                issue_description = "Hi [~sue.minton@firstdata.com],\n{} by {} privacy policy is linked for your review: {}\nThanks!".format(app_info["app_name"], app_info["dev_name"], app_info["privacy_policy"])

                new_DLV = self.jira.create_issue(project='DLV', summary=issue_name, description=issue_description, issuetype={'name': 'Task'})
                print("DLV Privacy Policy has been created")
                return new_DLV

        elif ticket_type == "tos":
            existing_jira = self.search_jira("{} by {}".format(app_info["app_name"], app_info["dev_name"]), ticket_type)

            if existing_jira:
                print("JIRA for this app already exists at {}".format(existing_jira))
                return existing_jira
            else:
                issue_name = "{} TOS".format(app_info["dev_name"])
                issue_description = "Hi [~Carlene.Byers@firstdata.com] and [~Julie.sheibal@firstdata.com],\n{} by {} TOS is linked for your review: {}\nApp Description: {}".format(app_info["app_name"], app_info["dev_name"], app_info["tos"], app_info["description"])

                new_DLV = self.jira.create_issue(project='DLV', summary=issue_name, description=issue_description, issuetype={'name': 'Task'})
                print("DLV TOS has been created")
                return new_DLV

    def search_jira(self, query, ticket_type):
        """
        Search Jira for an existing open ticket for this app UUID:
        --------------
        Input:
        * uuid - uuid we are looking for an exisitng jira
        Output:
        * existing_jira - the existing ticket
        * null - when there is no existing ticket
        """
        if ticket_type == "app_approval":
            try:
                existing_jira = self.jira.search_issues('text ~ "{}" and project=DAA'.format(query))
                return existing_jira[0] # gives back Jira no.
            except:
                return None
        if ticket_type == "logo":

            try:
                existing_jira = self.jira.search_issues('text ~ "LOGO {}"'.format(query))
                return existing_jira[0]
            except:
                return None
        if ticket_type == "privacy":
            try:
                existing_jira = self.jira.search_issues('text ~ "{} Privacy" and project=DLV'.format(query))
                return existing_jira[0]
            except:
                return None
        if ticket_type == "tos":
            try:
                existing_jira = self.jira.search_issues('text ~ "{} TOS" and project=DLV'.format(query))
                return existing_jira[0]
            except:
                return None

    def query_p801(self, query):
        """
        Query p801:
        -----------
        Input: query in string format ex. str(SELECT * FROM developer WHERE uuid IN ('123124234'))
        Output: query_output which is tuple of data from the query output
        """
        ssl_set = {}
        ssl_set["cipher"] = "DHE-RSA-AES256-SHA"
        db = mysql.connector.connect(
            user="gpark",
            password="asWJn9rWa88=",  # pw Kess provided originally
            host="db-usprod-shard0.corp.clover.com",
            db="meta" #database you're trying to use
        )
        cur = db.cursor()
        cur.execute(query)
        query_output = cur.fetchall()
        db.close()

        return query_output

    def get_icon(self, icon_filename):
        """
        Grab app icon for attaching to logo ticket
        """
        icon_url = "https://www.clover.com/v2/image/" + icon_filename

        r = requests.get(icon_url)
        with open(icon_filename, 'wb') as f:
            f.write(r.content)
            print("Saved " + icon_filename)

    def get_app(self, uuid):
        """
        Grab app information from p801 for tickets
        -----------
        Input: app uuid
        Output: app details in dictionary form
        """
        query = "SELECT app.uuid, app.name, developer.uuid, developer.name, app.filename_icon, app.privacy_policy, app.eula, app.description FROM developer_app AS app JOIN developer ON app.developer_id=developer.id WHERE app.uuid='{}'".format(uuid)
        app_output = self.query_p801(query)

        app_info = {
            "app_uuid": app_output[0][0],
            "app_name": app_output[0][1],
            "dev_uuid": app_output[0][2],
            "dev_name": app_output[0][3],
            "icon_filename": app_output[0][4],
            "privacy_policy": app_output[0][5],
            "tos": app_output[0][6],
            "description": app_output[0][7]
        }

        return app_info

    def create_jiras(self, uuid):
        app_info = self.get_app(uuid)

        app_approval = self.open_jira(app_info, "app_approval")
        logo = self.open_jira(app_info, "logo")
        privacy = self.open_jira(app_info, "privacy")
        tos = self.open_jira(app_info, "tos")

        self.jira.create_issue_link("is blocked by", logo, app_approval)
        print("logo issue linked")
        self.jira.create_issue_link("is blocked by", privacy, app_approval)
        print("privacy issue linked")
        self.jira.assign_issue(privacy, "sue.minton@firstdata.com")
        self.jira.create_issue_link("is blocked by", tos, app_approval)
        print("tos issue linked")

        webbrowser.open_new_tab("https://jira.dev.clover.com/browse/" + str(app_approval))

    def print_menu(self):
        """
        Print menu for DAA script
        ------------------------------------
        Input: credentials
        Output: jira tickets created
        """
        print("Enter JIRA username ex) firstname.lastname")
        username = input("> ")
        self.auth(username)

        adding = True
        while adding:
            print("Enter to App UUID to create DAA ticket for:")
            choice = input("> ")

            if len(choice) == 13:
                app_info = self.get_app(choice)
                for k, v in app_info.items():
                    print("{}: {}\n".format(k, v))

                print("Do you want to continue? Enter (y/n)")
                choice2 = input("> ")

                if choice2 == "y":
                    self.create_jiras(choice)

            else:
                adding = False

##########################################################################################################

DAA().print_menu()