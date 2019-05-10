import logging
import sys
import traceback

from config import DATASCIENCE_DIR, USERNAME
from configure_logger import configure_logger
sys.path.append(DATASCIENCE_DIR)
from services import emails

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name="cronjobs", console_output=True)
################################################################################

def email_exception(origin, exc_info, recipients=None):
    if not recipients:
        recipients = [USERNAME+"@clover.com"]
    if type(recipients) != list:
        raise TypeError("'recipients' must be a list")
    sender = USERNAME+"@clover.com"
    type_, value_, traceback_ = exc_info
    ex = traceback.format_exception(type_, value_, traceback_)
    emails.send(recipients,
                "Exception in {origin}".format(origin=origin),
                str(ex),
                sender)
