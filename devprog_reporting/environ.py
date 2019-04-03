import datetime
import os
import sys

from dateutil import parser

from sshdb import SshDb

sys.path.append((os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) + '/utilities'))
from utils import enum
from config import DATASCIENCE_DIR
sys.path.append(DATASCIENCE_DIR)
from services.db import Db

Status = enum(CREATED=1, SUBMITTED=2, APPROVED=3, PUBLISHED=4)
EnvironType = enum(PROD_US=1, PROD_EU=2, PROD_LA=3, SANDBOX=4)

class ApprovalStage(object):
    def __init__(self, status, start_date):
        self.status = status
        
        if type(start_date) == str:
            try:
                self.start_date = parser.parse(start_date)
            except:
                raise ValueError
        elif type(start_date) == datetime.datetime:
           self.start_date = start_date
        else:
            raise TypeError
    
    def __str__(self):
        if self.status == Status.CREATED:
            return 'Created'
        elif self.status == Status.SUBMITTED:
            return 'Submitted'
        elif self.status == Status.APPROVED:
            return 'Approved'
        elif self.status == Status.PUBLISHED:
            return 'Published'
    
    def __repr__(self):
        return 'ApprovalStage(%s, %s)' % (self.status, self.start_date)


class BaseEnviron(object):
    def __init__(self, name, environ_type, db, dev_reports, app_reports, countries):
        self.name = name
        self.environ = environ_type
        self.db = db
        self.dev_reports = dev_reports
        self.app_reports = app_reports
        self.countries = countries

    def __str__(self):
        return self.name
    
    def __repr__(self):
        return 'Environ(%s, %s, %s, %s, %s, %s)' % (self.name, self.environ, self.db, self.dev_reports, self.app_reports, self.countries)

class Environ(BaseEnviron):
    def __init__(self, environ_type):
        if environ_type == EnvironType.PROD_US:
            super(Environ, self).__init__(name="Prod US/CA",
                                          environ_type=environ_type,
                                          db=Db("~/.clover/p801.cfg"),
                                          dev_reports=[
                                            ApprovalStage(Status.CREATED, '2013-08-01'),
                                            ApprovalStage(Status.SUBMITTED, '2013-08-01'),
                                            ApprovalStage(Status.APPROVED, '2013-08-01')
                                          ],
                                          app_reports=[
                                            ApprovalStage(Status.CREATED, '2014-06-26'),
                                            ApprovalStage(Status.SUBMITTED, '2018-10-31'),
                                            ApprovalStage(Status.APPROVED, '2014-06-26'),
                                            ApprovalStage(Status.PUBLISHED, '2014-06-26')
                                          ],
                                          countries=["US", "CA"])
        elif environ_type == EnvironType.SANDBOX:
            super(Environ, self).__init__(name="Sandbox",
                                          environ_type=environ_type,
                                          db=SshDb("~/.clover/sb.cfg"),
                                          dev_reports=[
                                            ApprovalStage(Status.CREATED, '2015-09-15')
                                          ],
                                          app_reports=[
                                            ApprovalStage(Status.CREATED, '2018-10-30')
                                          ],
                                          countries=None)
        elif environ_type == EnvironType.PROD_EU:
            super(Environ, self).__init__(name="Prod EU",
                                          environ_type=environ_type,
                                          db=Db("~/.clover/p804r.cfg"),
                                          dev_reports=None,
                                          app_reports=None,
                                          countries=None)
        else:
            raise ValueError
