import logging

logger = logging.getLogger(__name__)

class UserInfo:

    def __init__(self, slackid, roles={'default'}, name=''):
        self.id = slackid
        self.roles = roles
        self.name = name

    @staticmethod
    def get_userinfo(slackid):
        return UserInfo(slackid)
