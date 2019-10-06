import json
import logging

logger = logging.getLogger(__name__)


class DropinBase(object):
    def __init__(self, filepath):
        try:
            self.json_keys = json.load(open(filepath))
            self.enabled = self.json_keys.get('enabled',True)
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
            self.defaultoptions = self.json_keys.get('defaultoptions')
            self.defoptionlist = []
            for item in self.json_keys.get('options'):
                option = DropinBaseOption(item)
                if option.default:
                    self.defoptionlist.append(option)
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


class DropinBaseOption(object):
    def __init__(self, item):
        try:
            self.option = item.get('option', None)
            self.param = item.get('param', 0)
            self.default = item.get('default', False)
            self.help = item.get('help')
            self.description = item.get('description','')
            self.defaultinputs = item.get('defaultinputs')
            self.SQL = " ".join(item.get('SQL'))
            self.header = item.get('header')
            self.aggregation = item.get('aggregation', None)
            self.format = item.get('format', None)
            self.loop = item.get('loop', False)
            self.expand_groups = item.get('expand_groups', True)
            self.requires_start_time = item.get('requires_start_time', False)
            self.requires_end_time = item.get('requires_end_time', False)

        except Exception as ex:
            # log it
            raise ex
