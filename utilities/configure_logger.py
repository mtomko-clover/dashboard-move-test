import logging
import os
from config import LOG_OUTPUT_DIR

def configure_logger(logger, name, console_output=False):
    if not os.path.exists(LOG_OUTPUT_DIR):
        os.mkdir(LOG_OUTPUT_DIR)
    logger.setLevel(logging.DEBUG)
    fh = logging.FileHandler(LOG_OUTPUT_DIR + name + ".log")
    fh.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s | %(levelname)s | %(module)s | %(message)s')
    fh.setFormatter(formatter)
    logger.addHandler(fh)
    if console_output:
        ch = logging.StreamHandler()
        ch.setLevel(logging.DEBUG)
        ch.setFormatter(formatter)
        logger.addHandler(ch)
