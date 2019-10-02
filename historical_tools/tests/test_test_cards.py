#!/home/rachel/virtualenvs/tests/bin/python

import inspect
import json
import logging
import os
import sys
from base64 import b64encode

import requests
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA

from card import DOCUMENTED_TEST_CARDS
from contact_list import TECH_WRITERS

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
from utils_emails import email_exception
from clover_api import CloverAPI
from config import DATASCIENCE_DIR, USERNAME
from configure_logger import configure_logger
sys.path.append(DATASCIENCE_DIR)
from services import emails

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=False)
################################################################################

API = CloverAPI(
    base_url="https://sandbox.dev.clover.com",
    merchant_id=os.environ["SANDBOX_TEST_MERCHANT_ID"],
    access_token=os.environ["SANDBOX_API_TOKEN"]
)

def test_test_cards_with_devpay():
    def encrypt_pan(pan):
        key = RSA.construct((modulus, exponent))
        cipher = PKCS1_OAEP.new(key)
        encrypted = cipher.encrypt((prefix + pan).encode())
        card_encrypted = b64encode(encrypted)
        return card_encrypted

    def call_devpay(test_card):
        payload = {
            "orderId": os.environ["SANDBOX_DEVPAY_ORDER_ID"],
            "currency": "usd",
            "amount": 100,
            "tipAmount": 0,
            "taxAmount": 0,
            "expMonth": test_card.expMonth,
            "expYear": test_card.expYear,
            "cvv": test_card.cvv,
            "cardEncrypted": encrypt_pan(test_card.pan),
            "last4": test_card.last4,
            "first6": test_card.first6,
            "zip": test_card.zip_code
        }
        response = API.post("/v2/merchant/{mId}/pay", payload)
        return response

    # Get encryption variables once.
    pay_key_data = API.get("/v2/merchant/{mId}/pay/key")
    modulus = int(pay_key_data['modulus'])
    exponent = int(pay_key_data['exponent'])
    prefix = str(pay_key_data['prefix'])

    for card in DOCUMENTED_TEST_CARDS:
        expected_result = card.results.get("devpay")
        actual_result = call_devpay(card).get("result")
        message = "Test Card {pan}{delimiter}Actual Result: {actual}{delimiter}Expected Result: {expected}".format(
            delimiter=" | ", pan=card.pan, expected=expected_result, actual=actual_result)
        try:
            assert actual_result == expected_result
            logger.info(message)
        except AssertionError:
            logger.warning(message)
            func_name = inspect.currentframe().f_code.co_name
            sender = USERNAME+"@clover.com"
            recipients = [sender] + TECH_WRITERS
            emails.send(recipients,
                        "AssertionError in {origin}".format(origin=func_name),
                        message,
                        sender)

################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    try:
        test_test_cards_with_devpay()
    except Exception as err:
        logger.exception(err)
        email_exception(filename, sys.exc_info())
