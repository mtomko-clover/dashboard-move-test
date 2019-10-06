import logging

# from .security import acl
from botlib.security import acl

from userinfo import UserInfo

WHITE_LISTED_USERS = {}
logger = logging.getLogger(__name__)


def update_whitelist():
    WHITE_LISTED_USERS.clear()
    with open('cfg/users.txt', "r") as userfile:
        for line in userfile:
            line = line.strip()
            if not line.startswith("#") and '|' in line:
                try:
                    slackid, roles, name = line.split("|", 3)
                    WHITE_LISTED_USERS[slackid] = UserInfo(slackid, roles.split(','), name)
                except Exception as ex:
                    print "Bad entry:" + line + ' ignored'


update_whitelist()


def user_allowed(user):
    if user not in WHITE_LISTED_USERS:  # and source != 'devices':
        # send_output(channel, 'User not permitted to use source and/or command')
        return False
    return True


def permission_control(channel, user, cmd, obj):
    if user not in WHITE_LISTED_USERS:  # and source != 'devices':
        # send_output(channel, 'User not permitted to use source and/or command')
        return False
    try:
        for role in WHITE_LISTED_USERS[user].roles:
            if 'runas' in cmd:
                if acl.is_allowed(role, cmd, ''):
                    return True
            else:
                if acl.is_allowed(role, cmd, obj):
                    return True
    except:
        return False
    return False
