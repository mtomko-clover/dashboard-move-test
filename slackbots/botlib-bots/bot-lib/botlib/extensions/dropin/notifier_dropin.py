import json
import logging

logger = logging.getLogger(__name__)


class NotifierDropin:

    def __init__(self,filepath):
        self.json_keys = json.load(open(filepath))
        self.commands = self.json_keys.get('commands')
        self.schedule = self.json_keys.get('schedule')
        self.channel = self.json_keys.get('channel')
        self.user = self.json_keys.get('user')
        self.message = self.json_keys.get('message')
        self.description = self.json_keys.get('description','')
        self.enabled = self.json_keys.get('enabled',True)
        self.quiet = self.json_keys.get('quiet',False)
        if self.json_keys.get('interval'):
            self.interval = IntervalTrigger(**self.json_keys.get('interval'))
        else:
            self.interval = None
        if self.json_keys.get('cron'):
            self.cron = CronTrigger(**self.json_keys.get('cron'))
        else:
            self.cron = None


class CronTrigger:
    def __init__(self, *initial_data, **kwargs):
        self.year = None
        self.month = None
        self.day = None
        self.week = None
        self.day_of_week = None
        self.hour = None
        self.minute = None
        self.second = None
        self.start_date = None
        self.end_date = None
        self.timezone = None
        self.jitter = None
        for dictionary in initial_data:
            for key in dictionary:
                setattr(self, key, dictionary[key])
        for key in kwargs:
            setattr(self, key, kwargs[key])


class IntervalTrigger:
    def __init__(self, *initial_data, **kwargs):
        self.weeks = 0
        self.days = 0
        self.hours = 0
        self.minutes = 0
        self.seconds = 0
        self.start_date = None
        self.end_date = None
        self.timezone = None
        self.jitter = None
        for dictionary in initial_data:
            for key in dictionary:
                setattr(self, key, dictionary[key])
        for key in kwargs:
            setattr(self, key, kwargs[key])
