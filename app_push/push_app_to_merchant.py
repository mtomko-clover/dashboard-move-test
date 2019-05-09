import argparse
from requests import Session
from getpass import getpass
from datetime import datetime
import json
import sys

dev1_address = "https://dev1.dev.clover.com"


def app_push(session, application_ids, merchant_ids, host):
    url = "/v3/internal/bulk_install/apps/"
    for application_id in application_ids:
        print 'Starting app push for: ' + application_id
        tempUrl = url + application_id
        app_subscription = get_app_info(session, host, application_id)
        for merchant_id in merchant_ids:
            merchant = {'merchant': {'id': merchant_id}}
            current_subscription = {'currentSubscription': {'id': app_subscription}}
            body_list = [merchant, current_subscription]
            try:
                resp = session.post(host+tempUrl, json={'elements':body_list})
                if resp.status_code == 200:
                    print "app push successful for merchant " + merchant_id
                else:
                    print "app push failed for merchant " + merchant_id
            except Exception as e:
                print e.message
        print


# Need to log in to create a Session so we can use internal Clover pages
def get_login_info(session, host):
    ldap_username = raw_input("Enter your LDAP username: ")
    ldap_password = getpass("Enter your LDAP password: ", sys.stderr)
    print

    resp = session.post(host+"/cos/v1/dashboard/internal/login", json={'username': ldap_username, 'password':ldap_password})
    return resp.status_code


# Need to get appSubscription info. It will pick the first one.
# Maybe need to iterate through for the right one?
def get_app_info(session, host, app_id):
    url = host + '/cos/v1/dashboard/internal/apps/' + app_id
    try:
        resp = session.get(url)
        response_object = json.loads(resp.content)
        app_subscription = response_object['app']['appSubscriptions'][0]['id']
        return app_subscription
    except Exception as e:
        print e.message


def search_for_merchant(session, host):
    merchants = []
    merchant_id = ""
    find_param = ""
    while True:
        merchant_search_type = raw_input('Enter [1] for search by name or [2] for search by merchant ID: ')
        if merchant_search_type != "" and int(merchant_search_type) == 1:
            merchant_id = raw_input('Merchant name: ')
            find_param = "name LIKE" + merchant_id + "%"
        elif merchant_search_type != "" and int(merchant_search_type) == 2:
            merchant_id = raw_input("Enter merchant ID: ")
            find_param = "id LIKE" + merchant_id + "%"
        else:
            continue
        date_string = datetime.now().strftime("%s")
        query_params = {"orderBy": "name ASC", "limit": "50", "find": find_param, "_": str(date_string)}
        url = host + "/v3/merchants"

        try:
            response = session.get(url, params=query_params)
            if response.status_code == 200:
                response_object = json.loads(response.content)
                potential_merchants = response_object['elements']
                i = 1
                print "Are any of these merchants correct?"
                print
                for merchant in potential_merchants:
                    print '[' + str(i) + ']' + merchant['name'] + ' (' + merchant['id'] + ')'
                    i += 1
                print
                choice = raw_input('If so, choose one. Otherwise, press [Enter]: ')
                if choice != "":
                    merchants.append(potential_merchants[int(choice)-1])

        except Exception as e:
            print e.message

        ans = raw_input('Search more? [Y/n]: ')
        if ans.lower() == 'n':
            return merchants


def search_for_application(session, host):
    application_id = ""
    applications = []
    while True:
        app_search_type = raw_input('Enter [1] for search by name or [2] for search by application ID: ')
        find_param = ""
        if app_search_type != "" and int(app_search_type) == 1:
            application_id = raw_input("Enter application name: ")
            find_param = "name LIKE" + application_id + "%"
        elif app_search_type != "" and int(app_search_type) == 2:
            application_id = raw_input("Enter application ID: ")
            find_param = "id LIKE" + application_id + "%"
        else:
            continue
        date_string = datetime.now().strftime("%s")
        query_params = {"limit": str(50), "find": find_param, "_": date_string}
        url = host + "/v3/apps"
        try:
            response = session.get(url, params=query_params)
            if response.status_code == 200:
                response_object = json.loads(response.content)
                potential_applications = response_object['elements']
                i = 1
                print "Are any of these applications correct?"
                print
                for application in potential_applications:
                    print '[' + str(i) + ']' + application['name'] + ' (' + application['id'] + ')'
                    i += 1
                print
                choice = raw_input('If so, choose one. Otherwise, press [Enter]: ')
                if choice != "":
                    applications.append(potential_applications[int(choice)-1])

        except Exception as e:
            print e.message

        ans = raw_input('Search more? [Y/n]: ')
        if ans.lower() == 'n':
            return applications


def get_ids(object_list):
    ids = []
    for object in object_list:
        ids.append(object['id'])
    return ids


def main():

    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default=dev1_address,
                        help='Hostname for environment to use (e.g. https://api.clover.com)')

    args = parser.parse_args()

    session = Session()

    if get_login_info(session, args.host) == 200:
        print "Logged in successfully"
        print
        print 'Merchant Search'
        merchants = search_for_merchant(session, args.host)
        print
        print 'Application Search'
        applications = search_for_application(session, args.host)
        app_push(session, get_ids(applications), get_ids(merchants), args.host)

    else:
        raise Exception("LDAP login failed")


if __name__ == "__main__":
    main()

