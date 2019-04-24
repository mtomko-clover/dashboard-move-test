import MySQLdb
from datetime import date

from jira import JIRA
import getpass

class Infolease:


	def gen_month(self):
		day = date.today()
		month_switch = {
			1: "Jan", 
			2: "Feb",
			3: "Mar",
			4: "Apr",
			5: "May",
			6: "Jun",
			7: "Jul",
			8: "Aug",
			9: "Sep",
			10: "Oct",
			11: "Nov",
			12: "Dec"
		} 
		this_month = month_switch[day.month] + " " + str(day.year)

		return this_month



	def __init__(self):
		self.jira = None
		self.month = self.gen_month() 	#String with the current month and year.


	def auth(self, username):
		PWD = getpass.getpass('Jira Password: ')   #Prompting for the JIRA password
		self.jira = JIRA('https://jira.dev.clover.com', basic_auth=(username, PWD))

	def create_jira(self, list_of_devs):
		issue_name = "[US] Developer Info to be Modified in Infolease {}".format(self.month)

		issue_description = """Hi [~lisa], the following developers need their infolease information updated:\n\n"""

		for dev in list_of_devs:
			for key in dev:
				print("dev[key]", dev[key])
				issue_description = issue_description + key + ": "
				issue_description = issue_description + dev[key] + "\n"
			issue_description = issue_description + "\n"

		issue_description = issue_description + "Please pull the developer ABA and DBA for the following UUIDs from Ashwini's Excel file.\n\n"

		for dev in list_of_devs:
			issue_description = issue_description + dev["UUID"] + "\n"



		new_co = self.jira.create_issue(project='PRODUCTOPS', summary=issue_name, description=issue_description, issuetype={'name': 'Task'})
		print(issue_description)
		print("CO Infolease issue has been created.")
		return new_co

	def query_p801(self, query):
		'''
		Query p801:
		-----------
		Input: query in string format ex. str(SELECT * FROM developer WHERE uuid IN ('123124234'))
		Output: query_output which is tuple of data from the query output
		'''

		ssl_set = {}
		ssl_set["cipher"] = "DHE-RSA-AES256-SHA"
		db = MySQLdb.connect(host="p801.corp.clover.com",
							user="gpark",
							passwd="asWJn9rWa88=", # pw Kess provided originally
							db="meta", # database you're trying to use
							ssl=ssl_set)
		cur = db.cursor()
		cur.execute(query)
		query_output = cur.fetchall()
		db.close()

		print("Query output: ", query_output)
		return query_output


	def pull_bank_info(self, uuids):
		"""
	 	Grab dev information from p801 for tickets
   		-----------
		Input: list of dev uuids
		Output: list of developers with a dictionary containing their data
		"""
		query = "SELECT d.name, infolease_vendor_code, d.uuid, dbi.bank_routing_number FROM developer as d JOIN developer_bank_info as dbi ON dbi.developer_uuid = d.uuid WHERE d.uuid IN({});".format(",".join(uuids))
		print("query: ", query)
		dev_output = self.query_p801(query)
		list_of_devs = []

		for dev in dev_output:
			dev_info = {
				"*Developer Name*": dev[0],
				"*Infolease Vendor Code*": dev[1],
				"*UUID*": dev[2],
				"*Bank Routing Number*": dev[3],
			}
			list_of_devs.append(dev_info)
			print("List of devs:", list_of_devs)



		return list_of_devs

	def convert_uuids(self):
		#Convert comma-separated, user-entered UUIDs into a list of UUIDs for a P801 query

		uuid_string = input("Enter UUIDs in the format UUID1, UUID2, ...: \n")
		uuids = uuid_string.split(",")

		#Format UUIDs to work
		
		edited_uuids =[] #For some reason, Python doesn't reliably do an in-place modification of
						 #a list.
		for uuid in uuids:
			uuid = uuid.strip()
			uuid = "\'"+uuid+"\'"
			edited_uuids.append(uuid)

		return edited_uuids

	def print_menu(self):
		"""
        Print menu for Infolease script
        ------------------------------------
        Input: credentials
        Output: jira ticket created
        """
		print("Enter JIRA username ex) firstname.lastname")
		username = input("> ")
		self.auth(username)

		uuids = self.convert_uuids()
		dev_data = self.pull_bank_info(uuids)
		infolease_jira = self.create_jira(dev_data)
		print("Jira created")
		#webbrowser.open_new_tab("https://jira.dev.clover.com/browse/" + str(infolease_jira))



		



### Testing ###

info = Infolease()
#info.convert_uuids()
info.print_menu()
#print(info.month)
#the_devs = info.pull_bank_info(["\'2PC7HRFDVH7D6\'"])
#info.open_jira(the_devs)


#usrnm = input("Enter JIRA username ex: firstname.lastname: ")

#info.auth(usrnm)
#print("Success!")

#print(info.gen_month())