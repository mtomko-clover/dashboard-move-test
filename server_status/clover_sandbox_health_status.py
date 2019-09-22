import webapp2
import requests
import json
import datetime
from google.appengine.ext.webapp import template

# api_token = "18635815-8df9-ef35-ef99-fec03f3854c" #Test Bad API Token
api_token = "18635815-8df9-ef35-ef99-fec03f3854c2"
merchant_id = "RYTGA0GMVQHSG"

base_url = "https://sandbox.dev.clover.com/v3/merchants"
merchant_url = base_url + "/" + merchant_id + "?access_token=" + api_token

down_start_time = ""
last_time_down = ""

slack_web_hook = "https://hooks.slack.com/services/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"
# slack_web_hook = "https://hooks.slack.com/services/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"
# slack_web_hook = "https://hooks.slack.com/services/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" #Test Webhook

merchant_status = True
merchant_down_payload = {'text':'Sandbox is Down! https://i.giphy.com/media/yr7n0u3qzO9nG/giphy.webp'}


docs_status = True
docs_down_payload = {'text':'docs.clover.com is Down!'}
docs_up_payload = {'text':'docs.clover.com is Up!'}

docs_clover_com_url = "docs.clover.com"

class CloverMerchantEndpoint(webapp2.RequestHandler):
    def get(self):
        global merchant_status
        global down_start_time
        global last_time_down

        try:
            response = requests.get(merchant_url)
            if response.status_code == 200:
                if not merchant_status:
                    merchant_status = True
                    last_time_down = datetime.datetime.now()
                    merchant_up_payload = {'text':'Sandbox is Up! It was down for %s.' % (last_time_down - down_start_time)}
                    requests.post(slack_web_hook, data=json.dumps(merchant_up_payload))
            else:
                raise
        except:
            if merchant_status:
                down_start_time = datetime.datetime.now()
                merchant_status = False
                requests.post(slack_web_hook, data=json.dumps(merchant_down_payload))
            else:
                merchant_down_for_payload = {'text':'Sandbox has been down for %s.' % (datetime.datetime.now() - down_start_time)}
                requests.post(slack_web_hook, data=json.dumps(merchant_down_for_payload))


class CloverDocStatus(webapp2.RequestHandler):
    def get(self):
        global docs_status
        try:
            response = requests.get(docs_clover_com_url)
            if response.status_code == 200:
                if not docs_status:
                    docs_status = True
                    requests.post(slack_web_hook, data=json.dumps(merchant_up_payload))
            else:
                raise
        except:
            docs_status = False
            requests.post(slack_web_hook, data=json.dumps(docs_down_payload))


class Home(webapp2.RequestHandler):
    def get(self):
        if merchant_status:
            self.response.write(template.render('index.html',{'merchantStatus':'Up - Last down %s' % (last_time_down) , 'icon':True}))
        else:
            self.response.write(template.render('index.html',{'merchantStatus':'Down - Down for %s' % (datetime.datetime.now() - down_start_time), 'icon':False}))

app = webapp2.WSGIApplication([
    (r'/', Home),
    (r'/merchant', CloverMerchantEndpoint),
], debug=True)
