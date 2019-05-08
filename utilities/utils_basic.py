import logging
import traceback

from config import USERNAME
from configure_logger import configure_logger
import emails3

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name="cronjobs", console_output=False)
################################################################################

def enum(**enums):
    return type('Enum', (), enums)
 
def chunk(l, n):
    """Yield successive n-sized chunks from l."""
    for i in range(0, len(l), n):
        yield l[i:i + n]

def email_exception(origin, exc_info, recipients=None):
    if not recipients:
        recipients = [USERNAME+"@clover.com"]
    if type(recipients) != list:
        raise TypeError("'recipients' must be a list")
    sender = USERNAME+"@clover.com"
    type_, value_, traceback_ = exc_info
    ex = traceback.format_exception(type_, value_, traceback_)
    emails3.send(recipients,
                "Exception in {origin}".format(origin=origin),
                str(ex),
                sender)
