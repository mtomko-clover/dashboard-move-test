import argparse
from requests import Session
from getpass import getpass
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


def main():

    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default=dev1_address,
                        help='Hostname for environment to use (e.g. https://api.clover.com)')

    args = parser.parse_args()

    application_ids = raw_input("Enter application ids (separate by \';\'): ")
    application_ids_list = application_ids.split(";")
    app_id_set = set(application_ids_list)
    if '' in app_id_set:
        app_id_set.remove('')
    if ' ' in app_id_set:
        app_id_set.remove(' ')
    if len(app_id_set) == 0:
        exit("at least one application ID must be provided")

    merchant_ids = raw_input("Enter merchant ids (separate by \';\'): ")
    merchant_ids_list = merchant_ids.split(";")
    merchant_id_set = set(merchant_ids_list)
    if ' ' in merchant_id_set:
        merchant_id_set.remove(' ')
    if '' in merchant_id_set:
        merchant_id_set.remove('')
    if len(merchant_ids_list) == 0:
        exit("at least one merchant ID must be provided")

    print

    session = Session()

    if get_login_info(session, args.host) == 200:
        print "Logged in successfully"
        print
        app_push(session, app_id_set, merchant_id_set, args.host)
    else:
        raise Exception("LDAP login failed")


if __name__ == "__main__":
    main()

