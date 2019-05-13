#!/bin/bash
source /home/rachel/virtualenvs/tests/bin/activate
source /home/rachel/devrel-tools/tests/secrets.sh
python /home/rachel/devrel-tools/tests/test_test_cards.py
deactivate
