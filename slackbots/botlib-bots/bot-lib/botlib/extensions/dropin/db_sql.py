import logging
import re

from botlib.extensions.dropin.dropin_base import DropinBase, DropinBaseOption

logger = logging.getLogger(__name__)


class DbSqlDropin(DropinBase):
    def __init__(self, filepath):
        try:
            print('opening sql file ' + str(filepath))

            # Filename to command
            filematch = re.search('^((.*)[\\\\/])?([a-zA-Z0-9_-]+).sql\s*$', filepath)
            print('regex: ' + str(filematch))
            name = filematch.group(3);
            print('file: ' + str(name))
            namematch = re.search('^([a-zA-Z0-9]+)(_([a-zA-Z0-9]+))?(_(.*))?$', name)

            command = namematch.group(1)  if namematch.group(1) is not None else 'get'
            obj = namematch.group(3) if namematch.group(3) is not None else ''
            modifier = namematch.group(5) if namematch.group(5) is not None else ''

            print(namematch.group(1))
            print(namematch.group(3))
            print(namematch.group(5))

            # File Contents
            blocks = []
            attributes = {}
            description = ''
            hasSql = False

            with open(filepath) as file:
                sql = ''

                line = file.readline()
                while line:
                    attributeMatch = re.search('^\\s*--\\s*@(\\w+)\\b\\s*[=:]?\\s*(.*)$', line)
                    commentMatch = re.search('^\\s*--.*$|^\\s*$', line)
                    if attributeMatch is not None:
                        attribute = attributeMatch.group(1).strip()
                        value = attributeMatch.group(2).strip() if attributeMatch.group(2) is not None else ''
                        print(attribute)
                        print('   : [' + value + ']')
                        attributes[attribute] = value
                    elif commentMatch is not None:
                        if not hasSql:
                          description += ' ' + line.strip()
                    else:
                        hasSql = true;
                        sql += ' ' + line.strip()
                        if sql.endswith(';'):
                            blocks.append(sql)
                            sql = ''
                    
                    line = file.readline()
                
                if sql != '':
                    blocks.append(sql)

            # run through the options and sql to create an object that looks the same as DBDropin
            self.enabled = attributes.get('self', True)
            self.command = command
            self.obj = obj
            self.modifier = modifier
            self.role = attributes.get('role', 'default')
            self.description = description
            self.type = attributes.get('type', '')
            self.help = attributes.get('help', self.command + ' ' + self.obj + ' ' + self.modifier + ': ' + description[1, 20])
            self.options = {}
            self.defaultoptions = {}
            self.defoptionlist = []

            for sql in blocks:
                item = {'sql': sql, 'header': 'Results'}
                option = DropinBaseOption(item)
                if option.default:
                    self.defoptionlist.append(option)
                self.options[option.option] = option


            if not self.options:
                self.options = self.defaultoptions

            print(self)
        except Exception as ex:
            # log it
            print('error converting sql to dropin:')
            print (ex)
            raise ex

class DbSqlDropinOption(DropinBaseOption):
    def __init__(self, item):
        try:
            self.option = None
            self.param = 0
            self.default = True
            self.help = ''
            self.description = ''
            self.defaultinputs = ''
            self.SQL = item.get('sql', '')
            self.header = item.get('header', '')
            self.aggregation = None
            self.format = None
            self.loop = False
            self.expand_groups = True
            self.requires_start_time = False
            self.requires_end_time = False

        except Exception as ex:
            # log it
            raise ex


