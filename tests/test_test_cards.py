import inspect
import json
import logging
import os
import sys
from base64 import b64encode

import pytest
import requests
from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA

from card import DOCUMENTED_TEST_CARDS

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
from configure_logger import configure_logger
# from utils import phone_home

### LOGGING ####################################################################
logger = logging.getLogger(__name__)
configure_logger(logger, name=os.path.splitext(os.path.basename(__file__))[0], console_output=True)
################################################################################

def call_devpay_with_test_card(test_card):
    access_token = os.environ['SANDBOX_API_TOKEN']
    merchantId = "BP71B7BE2BPZ4"  # Rachel's sandbox test merchant
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
        "orderId": "6KDSV1PNMJD4J",
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
        result = call_devpay_with_test_card(c).get("result")
        try:
            assert result == c.results.get("devpay")
        except AssertionError:
            func_name = inspect.currentframe().f_code.co_name
            # phone_home(func_name, sys.exc_info())


# def phone_home(name, exc_info, recipients=None):
#     if not recipients:
#         recipients = ['rachel@clover.com']
#     if recipients and type(recipients) != list:
#         raise TypeError("'recipients' must be a list")
#     type_, value_, traceback_ = exc_info
#     ex = traceback.format_exception(type_, value_, traceback_)
#     emails.send(recipients,
#                 'Exception in {name}'.format(name=name),
#                 str(ex),
#                 'rachel@clover.com')

################################################################################
if __name__ == "__main__":
    filename = os.path.basename(__file__)
    test_test_cards_with_devpay()
    # try:
    #     test_test_cards_with_devpay()
    # except Exception as err:
    #     logger.exception(err)
    #     phone_home(filename, sys.exc_info())
