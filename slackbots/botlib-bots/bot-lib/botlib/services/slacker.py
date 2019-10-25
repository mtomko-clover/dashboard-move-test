import logging
import os
import random
import re
from time import gmtime, strftime, sleep, time

from botlib.core import ConfigRegistry
from singleton_decorator import singleton
from websocket import WebSocketConnectionClosedException
from botlib.security.model import user_allowed

from botlib.services.RateLimitedSlackClient import RateLimitedSlackClient

logger = logging.getLogger(__name__)

BOT_ROOT_DIR = os.path.abspath(os.path.dirname(__file__)) + "/../"

@singleton
class Slacker():
    def __init__(self):

        self.conf_registry = ConfigRegistry()
        self.bot_name = self.conf_registry.get_bot_name()
        self.bot_token = self.conf_registry.get_bot_token()
        self.slack_client = RateLimitedSlackClient(self.bot_token)
        # instantiate self.slack_client
        self.botid = self.get_botid()

    def sendwait(self, channel, user, text):
        self.slack_client.rtm_send_message(channel,
                                           random.choice(self.conf_registry.get_prompts()).format(self.get_slack_user(user)['display_name'])
                                           + '. Working on _*' + text + '*_')

    def sendtyping(self, channel, user, text):
        self.slack_client.rtm_send_typing(channel)

    def get_botid(self):
        """
            Returns the BOT_ID
        """
        api_call = self.slack_client.api_call('users.list')
        if api_call.get('ok'):
            # retrieve all users so we can find our bot
            users = api_call.get('members')
            for user in users:
                if 'name' in user and user.get('name') == self.bot_name:
                    return user.get('id')
        else:
            print('could not find bot user with the name ' + self.bot_name)

    def connect(self):
        while not self.slack_client.server.websocket:
            self.slack_client.rtm_connect(with_team_state=False, auto_reconnect=True)
            if self.slack_client.server.websocket.sock:
                self.slack_client.server.websocket.sock.setblocking(True)
            else:
                # Something is up with the slack websocket connection, we'll try again later
                sleep(2)
        return True

    def keepalive(self):
        try:
            self.slack_client.server.ping()
        except WebSocketConnectionClosedException as e:
            logger.error('Caught websocket disconnect, reconnecting...')
            logger.exception(e)
            self.slack_client.rtm_connect(with_team_state=False, auto_reconnect=True)

    def read(self):
        try:
            messages = self.slack_client.rtm_read()
            for msg in list(messages):

                # Check if message is in pm or a mention to the bot
                if ('type' in msg) and ('message' == msg['type']) and ('text' in msg) and ('user' in msg):
                    user = msg['user']
                    # ignore messages if the user isn't whitelisted. We'll check roles when we
                    # have completely parsed the message are are preparing to execute it
                    if not user_allowed(user):
                        messages.remove(msg)
                        continue
                    if user == self.botid:  # filter messages sent by this bot
                        messages.remove(msg)
                        continue
                    if not (self.is_private_chat(msg)):  # limit to pm or a direct mention
                        messages.remove(msg)
                        continue
                else:
                    messages.remove(msg)
        except WebSocketConnectionClosedException as ex:
            raise ex
        return messages

    def get_slack_user(self, slackid):
        # fetches selected user.info data from slack
        result = self.slack_client.api_call('users.info', user=slackid)
        if result['ok']:
            user = result['user']
            if user['deleted'] is False and user['is_bot'] is False:
                profile = user['profile']
                display_name = profile['display_name']
                if not display_name:
                    display_name = profile['first_name']

                return {'id': user['id'], 'name': user['name'], 'display_name': display_name,
                        'real_name': profile['real_name'], 'image_48': profile['image_48'], 'is_bot': user['is_bot']}

            logging.info('user: %s; deleted: %s; is_bot: %s' %
                         (id, user['deleted'], user['is_bot']))

        return None

    def get_group_id(self, name):
        result = self.slack_client.api_call('groups.list', exclude_members=True)
        if result['ok']:
            for group in result['groups']:
                if name == group['name']:
                    return group['id']
        return None

    def get_slack_user_byname(self, name):
        # fetches selected user.info data from slack
        result = self.slack_client.api_call('users.list')
        if result['ok']:
            for user in result['members']:
                if name in user['name']:
                    if user['deleted'] is True:
                        return None
                    else:
                        return {'id': user['id'], 'name': user['name'], 'display_name': user['profile']['display_name'],
                                'real_name': user['real_name'], 'image_48': user['profile']['image_48'],
                                'is_bot': user['is_bot']}
        return None

    @staticmethod
    def logactivity(user, channel, message):
        time = strftime('%Y-%m-%d %H:%M:%S', gmtime())
        message = re.sub('[^0-9a-zA-Z ,.-]', '', message)
        with open('drabot.log', 'a') as f:
            f.write('%s - user: %s from channel: %s asked: %s\n' % (time, user, channel, message))

    def is_private_chat(self, msg):
        # Filter by channel:
        """
        if a channel ID begins with a:
            C, it's a public channel
            D, it's a DM with the user
            G, it's either a private channel or mention
        :param msg:
        :return:
        """
        channel = msg['channel']
        # Direct Message
        if channel.startswith('D'):
            return True
        # Make sure it is a direct mention
        if msg is not None and msg['text'] is not None:
            if self.botid in msg['text']:
                return True

        return False

    def send_output(self, channel, text, prefix_fmt='', suffix_fmt=''):

        if self.slack_client is None or channel is None:
            print(text)
        else:
            if not self.slack_client.server.websocket.connected:
                self.slack_client.rtm_connect(with_team_state=False, auto_reconnect=True)
            # Handle large payloads. Limit for message is 16k, so use a 3k in case each character is a multibyte
            # Also, can't send more than 1/sec or connection will be closed
            if len(text) < 3 * 1024:
                self.slack_client.rtm_send_message(channel, prefix_fmt + text + suffix_fmt)
            else:
                lines = text.splitlines(True)
                buffer = ''
                for line in lines:
                    buffer += line
                    if len(buffer) < 3 * 1024:
                        continue
                    else:
                        self.slack_client.rtm_send_message(channel, prefix_fmt + buffer + suffix_fmt)
                        buffer = ''
                # Send the last line
                self.slack_client.rtm_send_message(channel, prefix_fmt + buffer + suffix_fmt)

    def send_attachment(self, channel, content, filetype='csv', title='output.csv', filename='output.csv'):
        self.slack_client.api_call(
            'files.upload',
            channels=channel,
            as_user=False,
            content=content,
            filetype=filetype,
            title=title, filename=filename)


