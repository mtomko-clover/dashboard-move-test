import logging

logger = logging.getLogger(__name__)


class GroupInfo:

    def __init__(self, mid, name='', friendlyname=''):
        self.mid = mid.strip()
        self.name = name.strip()
        self.friendlyname = friendlyname.strip()
