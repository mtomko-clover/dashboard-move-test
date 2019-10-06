import re
import traceback

import sys

from botlib.core.command_dispatcher import CommandDispatcher
from botlib.core.command_parser import CommandParser
from botlib.security.model import permission_control
from botlib.services.slacker import Slacker


class BotDispatcher:
    # def __init__(self,options):
    #     self.options = options

    def __init__(self):

        pass

    @staticmethod
    def run():
        sc = Slacker()
        cmdDispatcher = CommandDispatcher()
        while sc.connect():
            try:
                while True:
                    # Blocking read to get current new message list
                    messages = sc.read()
                    text = ''
                    for m in messages:
                        if ('type' in m) and ('message' == m['type']) and ('text' in m) and ('user' in m):
                            text = m['text'].strip()
                            text = re.sub(r"(?:<@|https?://)\S+\s*", "", text)
                            user = m['user']
                            channel = m['channel']

                        cmdline = CommandParser()
                        cmdline.parse(sc, channel, text.split(), user)
                        if cmdline.command is None or 'help' in cmdline.object or 'help' in cmdline.modifier:
                            continue

                        # Does the user have permission to run the command?
                        if not permission_control(channel, user, cmdline.command, cmdline.object):
                            continue
                        cmdDispatcher.dispatch(sc, channel, user, cmdline)
            except Exception as ex:
                sc.connect()
                exc_type, exc_value, exc_traceback = sys.exc_info()
                sc.send_output(channel, '*Aborted*' + '```' + ''.join(
                    traceback.format_exception(exc_type, exc_value, exc_traceback)) + '```')
                # reconnect
                pass
