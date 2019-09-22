import datetime
import json
import os
import requests
import webapp2
# import threading
from google.appengine.ext.webapp import template


sandbox_api_token='18635815-8df9-ef35-ef99-fec03f3854c2'
# Invalid token to simulate server down status
# sandbox_api_token='18635815-8df9-ef35-ef99-fec03f3854cc'
sandbox_merchant_id='RYTGA0GMVQHSG'
sandbox_url='sandbox.dev.clover.com'
sandbox_merchant_url='https://' + sandbox_url + '/v3/merchants/' + sandbox_merchant_id + '?access_token=' + sandbox_api_token

sandboxdev_api_token='0a1cb050-b31c-c9d2-4a28-54108eaba93f'
# Invalid token to simulate server down status
# sandboxdev_api_token='0a1cb050-b31c-c9d2-4a28-54108eaba93c'
sandboxdev_merchant_id='4H4YEKJWMASZ1'
sandboxdev_url='sandboxdev.dev.clover.com'
sandboxdev_merchant_url='https://' + sandboxdev_url + '/v3/merchants/' + sandboxdev_merchant_id + '?access_token=' + sandboxdev_api_token

# docs_url='docs.clover.com'

# slack_webhook='https://hooks.slack.com/services/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'
# Slack test webhook
slack_webhook='https://hooks.slack.com/services/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'

class Endpoint:
    def __init__(self, name, url):
        self.name=name
        self.url=url
        self.is_up=True
        self.down_start_time=None
        self.last_time_down=None

sandbox=Endpoint(sandbox_url, sandbox_merchant_url)
sandboxdev=Endpoint(sandboxdev_url, sandboxdev_merchant_url)
# docs=Endpoint(docs_url, 'https://' + docs_url)

endpoints=[sandbox, sandboxdev]

def round_time(dt=None, round_to=60):
    if dt == None : dt = datetime.datetime.now()
    seconds = (dt.replace(tzinfo=None) - dt.min).seconds
    return dt + datetime.timedelta(0, seconds, -dt.microsecond)

class EndpointTester(webapp2.RequestHandler):
    def tester(self, endpoint):
        try:
            response = requests.get(endpoint.url)

            if response.status_code == 200:
                if not endpoint.is_up:
                    endpoint.is_up=True
                    endpoint.last_time_down=round_time(datetime.datetime.now())
                    slack_webhook_payload={'text':endpoint.name + ' is up! It was down for %s' % (endpoint.last_time_down - endpoint.down_start_time)}
                    requests.post(slack_webhook, data=json.dumps(slack_webhook_payload))
            else:
                raise
        except:
            # Uh oh. Endpoint is down
            if endpoint.is_up:
                endpoint.down_start_time=round_time(datetime.datetime.now())
                endpoint.is_up=False
                requests.post(slack_webhook, data=json.dumps({'text':endpoint.name + ' is down!'}))
            else:
                slack_webhook_payload={'text':endpoint.name + ' has been down for %s' % (round_time(datetime.datetime.now()) - endpoint.down_start_time)}
                requests.post(slack_webhook, data=json.dumps(slack_webhook_payload))

    def get(self):
        global endpoints

        for endpoint in endpoints:
            self.tester(endpoint)


class Home(webapp2.RequestHandler):
    def get(self):
        global endpoints

        self.response.write(template.render('index.html', {}))

        for endpoint in endpoints:
            last_down=' - Last down %s' % (endpoint.last_time_down) if endpoint.last_time_down else ''
            down_for=' - Down for %s' % (datetime.datetime.now() - endpoint.down_start_time) if endpoint.down_start_time else ''
            if endpoint.is_up:
                self.response.write(template.render('section.html',{'endpointStatus':'Up' + last_down, 'icon':True, 'endpointURL':endpoint.name}))
            else:
                self.response.write(template.render('section.html',{'endpointStatus':'Down' + down_for, 'icon':False, 'endpointURL':endpoint.name}))

app=webapp2.WSGIApplication([
    (r'/', Home),
    (r'/merchant', EndpointTester)
], debug=True)

# endpointtester=EndpointTester()
# def local_test():
#     threading.Timer(5.0, local_test).start()
#     endpointtester.get()
# local_test()