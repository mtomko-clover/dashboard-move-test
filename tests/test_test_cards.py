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
import emails3
from config import USERNAME
from configure_logger import configure_logger
from utils_basic import email_exception

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def call_devpay_with_test_card(test_card):
    access_token = os.environ["SANDBOX_API_TOKEN"]
    merchantId =  os.environ["SANDBOX_TEST_MERCHANT_ID"]
    target_env = "https://sandbox.dev.clover.com"
    v2_merchant_path = "/v2/merchant/"
    headers = {"Authorization": "Bearer " + access_token}
    url = target_env + v2_merchant_path + merchantId + "/pay/key"
    response = requests.get(url, headers=headers)
    response = response.json()
    modulus = int(response['modulus'])
    exponent = int(response['exponent'])
    prefix = str(response['prefix'])
    key = RSA.construct((modulus, exponent))
    cipher = PKCS1_OAEP.new(key)
    encrypted = cipher.encrypt((prefix + test_card.pan).encode())
    card_encrypted = b64encode(encrypted)
    url = target_env + v2_merchant_path + merchantId + '/pay'
    data = {
        "orderId": os.environ["SANDBOX_DEVPAY_ORDER_ID"],
        "currency": "usd",
        "amount": 100,
        "tipAmount": 0,
        "taxAmount": 0,
        "expMonth": test_card.expMonth,
        "expYear": test_card.expYear,
        "cvv": test_card.cvv,
        "cardEncrypted": card_encrypted,
        "last4": test_card.last4,
        "first6": test_card.first6,
        "zip": test_card.zip_code
    }
    response = requests.post(url, headers=headers, data=data)
    response = response.json()
    return response


def test_test_cards_with_devpay():
    for c in DOCUMENTED_TEST_CARDS:
        expected_result = c.results.get("devpay")
        actual_result = call_devpay_with_test_card(c).get("result")
        try:
            assert actual_result == expected_result
        except AssertionError:
            func_name = inspect.currentframe().f_code.co_name
            sender = USERNAME+"@clover.com"
            recipients = [sender]
            # recipients = [sender] + TECH_WRITERS
            message = "Test Card {pan}\nActual Result: {actual}\nExpected Result: {expected}".format(pan=c.pan, expected=expected_result, actual=actual_result)
            emails3.send(recipients,
                        "AssertionError in {origin}".format(origin=func_name),
                        message,
                        sender)

################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    try:
        test_test_cards_with_devpay()  # Re-write in parallel, why make sync requests
    except Exception as err:
        logger.exception(err)
        email_exception(filename, sys.exc_info())
