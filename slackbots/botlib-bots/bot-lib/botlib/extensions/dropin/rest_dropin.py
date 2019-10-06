import urllib2

from botlib.extensions.dropin.dropin_base import DropinBaseOption, DropinBase
import json
import logging

default_address = "https://dev1.dev.clover.com"
default_token = "4e71b239-7d5f-54c0-ff6f-8d232e5bce8e"

logger = logging.getLogger(__name__)


class RestDropin(DropinBase):
    def __init__(self, item, filepath):
        DropinBase.__init__(self, item)
        try:
            self.json_keys = json.load(open(filepath))

            self.command = self.json_keys.get('cmd')
            self.obj = self.json_keys.get('object')
            self.role = self.json_keys.get('role')
            # If a plugin does not specify a role we assume it requires admin privileges
            if not self.role:
                self.role = 'admin'
            self.modifier = self.json_keys.get('modifier')
            self.description = self.json_keys.get('description')
            self.type = self.json_keys.get('type')
            self.help = self.json_keys.get('help')

            self.options = {}
            self.defaultoptions = self.json_keys.get("defaultoptions")
            for item in self.json_keys.get('options'):
                option = DropinBaseOption(item)
                self.options[option.option] = option
            if not self.options:
                self.options = self.defaultoptions
        except Exception as ex:
            # log it
            raise ex

    def get_default_options(self):
        default_options = []
        for option in self.options:
            if option.default is True:
                default_options.append(option)
        return default_options


class RestDropinOption(DropinBaseOption):
    def __init__(self, item):
        DropinBaseOption.__init__(self, item)
        self.option = item.get('option')
        self.param = item.get('param', 0)
        self.default = item.get('default', False)
        self.help = item.get('help')
        self.description = item.get('description')
        self.SQL = " ".join(item.get('SQL'))
        self.header = item.get('header')
        self.aggregation = item.get('aggregation', None)


def get(self, address='https://clover.com', token=default_token):
    url = '/v2/internal/merchant/{0}/info'
    data = {'mId': mid, 'merchantUuid': merchantId, 'serial': serial}
    req = urllib2.Request(address+url)
    req.add_header('Content-Type', 'application/json')
    req.add_header('Authorization', 'Bearer ' + token)
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
