import json
import urllib2

from botlib.core import config_registry


class RestManager:
    def __init__(self):
        self.default_token = config_registry.get_rest_token()

    def get(self, url, address='https://clover.com', token=None):
        if not token:
            token = self.default_token
        req = urllib2.Request(address + url)
        req.add_header('Content-Type', 'application/json')
        req.add_header('Authorization', 'Bearer ' + token)
        url = '/v2/internal/merchant/{0}/info'
        data = {'mId': mid, 'merchantUuid': merchantId, 'serial': serial}

        print 'Accessing ' + address+url

        try:
            response = urllib2.urlopen(req, json.dumps(data))
            contents = ''
            for line in response.readlines():
                contents += line
            if contents is not '':
                contents = contents.replace('"', '')
            print 'Success: PIN = ' + contents
        except urllib2.HTTPError as e:
            if e.code == 499:
                rData = json.loads(e.read())
                print "*** Error: ", rData.get("message")
            else:
                print "*** Error: ", e.code, e.read()