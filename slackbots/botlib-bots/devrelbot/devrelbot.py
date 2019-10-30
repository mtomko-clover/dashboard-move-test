#!/opt/clover/pyre/bin/python
import logging.config

from botlib.core.bot_dispatcher import BotDispatcher
from ruamel import yaml

logger = logging.getLogger(__name__)

# load the logging configuration
try:
    logging.config.dictConfig(yaml.load(open('cfg/log.yaml', 'r')))
except:
    pass


def main():
    dispatcher = BotDispatcher()
    dispatcher.run()


if __name__ == "__main__":
    main()
