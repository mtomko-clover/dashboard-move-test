import logging

from botlib.extensions.dropin.dropin_base import DropinBase, DropinBaseOption

logger = logging.getLogger(__name__)


class DBDropin(DropinBase):
    def __init__(self, item):
        DropinBase.__init__(self, item)


class DBDropinOption(DropinBaseOption):
    def __init__(self, item):
        DropinBaseOption.__init__(self, item)

