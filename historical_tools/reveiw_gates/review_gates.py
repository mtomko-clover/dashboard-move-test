import mysql.connector
import os
import requests

from jira import JIRA
import getpass

class ReviewJira:
	self.jira = None

	# Initialize JIRA
    def auth(self, username):
        PWD = getpass.getpass('Jira Password: ') # prompt for Jira password
        self.jira = JIRA('https://jira.dev.clover.com', basic_auth=(username, PWD))


    ###Functions###

    def open_jira(self, app_info, ticket_type):
    	#Search Jira for the DAA the ticket should be associated with
    	#If no corresponding Jira, communicate to the user and ask if they'd like a DAA created
    	#Else, create a DLV Jira ticket matching ticket_type that gets attached to the DAA 
    	#(Potentially search the DLVs asstached to the existing DAA and attach or link any doc
    	#called UPFRONT DOC so that it can be easily copied/modified)

    def search_jira(self, app_info):
    	#search Jira for a DAA ticket that matches the app UUID in app_info

    def query_shard(self, query_string):
    	#Using the query string, search Shard for the updated information
    	#This function may be unecessary given the nature of the review gates UI

    def get_icon(self, app_info):
    	#get the icon information for the app in order to create a new logo Jira

    def get_app(self, uuid):
    	#Find the existing DAA ticket to attach changes to

    def set_region(self, input):
    	#based on user input, figure out which version of Shard needs to be called
