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
        #self.epic_id = None
        self.app = None
        self.region = None
        self.dbhost = None
        self.dbname = None
        self.dbpass = None
        self.url = None

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

        self.url = self.url+app_info["app_uuid"]
        permissions_string = self.permissions_to_string(app_info)

        if ticket_type == "QA":
            existing_jira = self.search_jira("QA " + self.region + " " + app_info["app_uuid"], ticket_type)

            if existing_jira:
                print("JIRA for this app already exists at {}".format(existing_jira))
                return existing_jira
            else: #todo  'parent' : { 'key' : rootnn.key}
                issue_name = "QA {} {} by {} {}".format(self.region, app_info["app_name"], app_info["dev_name"], app_info["app_uuid"])
                issue_description = "App ID: {}\n\n{}\n\nApp Description: {}\n\nPermissions requested:\n{}".format(app_info["app_name"], self.url, app_info["description"], permissions_string)
                new_QA = self.jira.create_issue(project='DAA', summary=issue_name, description=issue_description, issuetype={"id" : "5"}, parent={'key': self.app.key})
                print("QA DAA has been created")
                return new_QA

        elif ticket_type == ("app_approval"):
            existing_jira = self.search_jira(self.region+ " " + app_info["app_uuid"], ticket_type)
            

            if existing_jira:
                app_exists = True
                print("JIRA for this app already exists at {}".format(existing_jira))
                self.app = existing_jira
                return existing_jira
            else:
                app_exists = False
                issue_name = "{} {} by {} {}".format(self.region, app_info["app_name"], app_info["dev_name"], app_info["app_uuid"])
                issue_description = "App ID: {}\nDev ID: {}\n\n{}".format(app_info["app_uuid"], app_info["dev_uuid"], self.url)

                new_DAA = self.jira.create_issue(project='DAA', summary=issue_name, description=issue_description, issuetype={'name': 'Task'})
                print("DAA has been created")
                self.app = new_DAA
                return new_DAA




        elif ticket_type == "logo":
            # search and download the icon to attach
            existing_jira = self.search_jira(app_info["app_name"], ticket_type)

            if existing_jira:
                print("JIRA for this app already exists at {}".format(existing_jira))
                return existing_jira
            else:
                self.get_icon(app_info["icon_filename"])

                issue_name = "{} LOGO/BRAND - {}".format(self.region, app_info["app_name"])
                issue_description = "Hi [~christopher.demetriades],\n{} by {} is attached for your review.\nThanks!".format(app_info["app_name"], app_info["dev_name"])

                new_DLV = self.jira.create_issue(project='DLV', summary=issue_name, description=issue_description, issuetype={'name': 'Task'})
                if app_info["icon_filename"] is not None:
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
                issue_name = "{} {} Privacy Policy".format(self.region, app_info["dev_name"])
                issue_description = "\n{} by {} privacy policy is linked for review: {}\n\n Permissions requested: \n\n{}\n\nThanks!".format(app_info["app_name"], app_info["dev_name"], app_info["privacy_policy"], permissions_string)

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
                issue_description = "The TOS for {} is linked for review: {}\n\n*App Description:* {}".format(app_info["app_name"], app_info["tos"], app_info["description"])

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
        if ticket_type == ("app_approval"):
            try:
                existing_jira = self.jira.search_issues('text ~ "{}" and project=DAA'.format(query))
                return existing_jira[0] # gives back Jira no.
            except:
                return None

        if ticket_type == "qa":
            try: existing_jira = self.jira.search_issues('text ~ "{}" and project=DAA'.format(query))
            except:
                return None
        if ticket_type == "logo":

            try:
                existing_jira = self.jira.search_issues('text ~ "LOGO/BRAND {}" and project=DLV and issue in linkedIssues({})'.format(query, self.app))
                return existing_jira[0]
            except:
                return None
        if ticket_type == "privacy":
            try:
                existing_jira = self.jira.search_issues('text ~ "{} Privacy" and project=DLV and issue in linkedIssues({})'.format(query, self.app))
                return existing_jira[0]
            except:
                return None
        if ticket_type == "tos":
            try:
                existing_jira = self.jira.search_issues('text ~ "{} TOS" and project=DLV and issue in linkedIssues({})'.format(query, self.app))
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
            user=self.dbname,
            password=self.dbpass,
            host= self.dbhost,
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
        if icon_filename is not None:
            icon_url = "https://www.clover.com/v2/image/" + icon_filename

            r = requests.get(icon_url)
            with open(icon_filename, 'wb') as f:
                f.write(r.content)
                print("Saved " + icon_filename)
        else:
            print("App does not yet include a logo. Please contact developer to add a logo.")

    def get_app(self, uuid):
        """
        Grab app information from p801 for tickets
        -----------
        Input: app uuid
        Output: app details in dictionary form
        """
        query = "SELECT app.uuid, app.name, developer.uuid, developer.name, app.filename_icon, app.privacy_policy, app.eula, app.description, app.package_name, app.site_url, app.application_id, app.permission_customers_read, app.permission_customers_write, app.permission_merchant_read, app.permission_merchant_write, app.permission_inventory_read, app.permission_inventory_write, app.permission_orders_read, app.permission_orders_write, app.permission_payments_read, app.permission_payments_write, app.permission_employees_read, app.permission_employees_write, app.permission_process_cards FROM developer_app AS app JOIN developer ON app.developer_id=developer.id WHERE app.uuid='{}'".format(uuid)
        app_output = self.query_p801(query)

        app_info = {
            "app_uuid": app_output[0][0],
            "app_name": app_output[0][1],
            "dev_uuid": app_output[0][2],
            "dev_name": app_output[0][3],
            "icon_filename": app_output[0][4],
            "privacy_policy": app_output[0][5],
            "tos": app_output[0][6],
            "description": app_output[0][7],
            "package name": app_output[0][8],
            "url": app_output[0][9],
            "RAID": app_output[0][10],
            "permissions": {"Merchant read": app_output[0][13], "Merchant write": app_output[0][14],
                            "Employees read": app_output[0][21], "Employees write": app_output[0][22], 
                            "Orders read": app_output[0][17], "Orders write": app_output[0][18], 
                            "Inventory read": app_output[0][15], "Inventory write": app_output[0][16],
                            "Customers read":app_output[0][11], "Customers write":app_output[0][12], 
                            "Payments read": app_output[0][19], "Payments write": app_output[0][20], 
                            "Process credit cards": app_output[0][23]}
        }

        return app_info

    def permissions_to_string(self, app_dict):
        permission_string = ""
        for key in app_dict["permissions"]:
            permission_int = int(app_dict["permissions"][key])
            if permission_int == 1:
                permission_string += key+"\n"
            else:
                continue
        return permission_string

    def create_jiras(self, uuid):
        app_info = self.get_app(uuid)

        app_approval = self.open_jira(app_info, "app_approval")
        qa_review = self.open_jira(app_info, "QA")
        logo = self.open_jira(app_info, "logo")
        privacy = self.open_jira(app_info, "privacy")
        tos = self.open_jira(app_info, "tos")

        self.jira.create_issue_link("blocks", qa_review, app_approval)
        self.jira.create_issue_link("blocks", logo, app_approval)
        self.jira.assign_issue(logo, "christopher.demetriades")
        print("logo issue linked")
        self.jira.create_issue_link("blocks", privacy, app_approval)
        print("privacy issue linked")
        #self.jira.assign_issue(privacy, "sue.minton@firstdata.com")
        self.jira.create_issue_link("blocks", tos, app_approval)
        print("tos issue linked")

        #For the QA ticket, who handles the ticket varies on the region, and the semi-integrration status
        #In the future, semi-ints may not be handled by Nathan in the EU, but for now they're associated to him.
        is_semi = input("Does this look like a semi-int? (y or n)")
        if "euprod" in self.dbhost:
            self.jira.assign_issue(qa_review, "nathan.binding")
        elif is_semi == "y":
            self.jira.assign_issue(qa_review, "paul.petyo")
        else:
            self.jira.assign_issue(qa_review, "sampada.gooty")

        webbrowser.open_new_tab("https://jira.dev.clover.com/browse/" + str(app_approval))

    def define_region(self, region_choice):


        if region_choice == "EU":
            self.region = "[EU]"
            self.dbhost = "db-euprod-shard0.corp.clover.com"
            self.url = "https://www.eu.clover.com/internal/apps/"
        elif region_choice == "US":
            self.region = "[US]"
            self.dbhost = "db-usprod-shard0.corp.clover.com"
            self.url =  "https://www.clover.com/internal/apps/"
        elif region_choice == "CAN":
            self.region ="[CAN]"
            self.dbhost = "db-usprod-shard0.corp.clover.com"
            self.url =  "https://www.clover.com/internal/apps/"
        #elif region_choice == "LA": #No database access yet
            #self.region = "[LA]"
        else:
            print("Sorry, I don't have access to that region.")


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
        print("Enter Shard username")
        self.dbname = input("> ")
        print("Enter Shard password")
        self.dbpass = getpass.getpass("> ")




        adding = True
        while adding:
            self.region = None
            print("Enter to App UUID to create DAA ticket for:")
            choice = input("> ")

            if len(choice) == 13:
                while not self.region:
                    print("Is this app for the EU, US, CAN, or LA?")
                    region_choice = input("> ")
                    self.define_region(region_choice)
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