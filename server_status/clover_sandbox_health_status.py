import datetime
import json
import os
import requests
import webapp2

# Comment for local testing
from google.appengine.ext.webapp import template

# Uncomment for local testing
# import threading

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


slack_webhook='https://hooks.slack.com/services/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'

# For testing (sends Slack notifications to Frank Faustino)
# slack_webhook='https://hooks.slack.com/services/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'

class Endpoint:
    def __init__(self, name, url):
        self.name=name
        self.url=url
        self.is_up=True
        self.down_start_time=None
        self.last_time_down=None

sandbox=Endpoint(sandbox_url, sandbox_merchant_url)
sandboxdev=Endpoint(sandboxdev_url, sandboxdev_merchant_url)

class EndpointTester(webapp2.RequestHandler):
    def get(self):
        response=None

        for endpoint in [sandbox, sandboxdev]:
            try:
                response=requests.get(endpoint.url)
                response.raise_for_status()
            except:
                if endpoint.is_up:
                    print('\n---------down first time: ' + 'code ' + str(response.status_code) + '/ text ' + response.text)
                    endpoint.down_start_time=datetime.datetime.now().replace(microsecond=0,second=0)
                    endpoint.is_up=False
                    requests.post(slack_webhook, data=json.dumps({'text':endpoint.name + ' is down!'}))
                else:
                    print('\n---------down again: ' + 'code ' + str(response.status_code) + '/ text ' + response.text)
                    slack_webhook_payload={'text':endpoint.name + ' has been down for %s' % (datetime.datetime.now().replace(microsecond=0,second=0) - endpoint.down_start_time)}
                    print(slack_webhook_payload)
                    requests.post(slack_webhook, data=json.dumps(slack_webhook_payload))
            else:
                if not endpoint.is_up:
                    print('\n---------up yay!: ' + 'code ' + str(response.status_code) + '/ text ' + response.text)
                    endpoint.is_up=True
                    endpoint.last_down_time=datetime.datetime.now().replace(microsecond=0,second=0)
                    slack_webhook_payload={'text':endpoint.name + ' is up! It was down for %s' % (endpoint.last_down_time - endpoint.down_start_time)}
                    print(slack_webhook_payload)
                    requests.post(slack_webhook, data=json.dumps(slack_webhook_payload))


class Home(webapp2.RequestHandler):
    def get(self):
        self.response.write(template.render('index.html', {}))

        for endpoint in [sandbox, sandboxdev]:
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