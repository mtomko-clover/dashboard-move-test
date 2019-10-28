import atexit
import copy
import logging
import os
import re
import signal
import sys
import traceback
from StringIO import StringIO
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from botlib.core.command_dispatcher import CommandDispatcher
from botlib.core.command_parser import CommandParser
from botlib.extensions.dropin.db_dropin import DBDropin
from botlib.extensions.dropin.db_sql import DbSqlDropin
from botlib.extensions.dropin.groupinfo import GroupInfo
from botlib.extensions.dropin.notifier_dropin import NotifierDropin
from botlib.security import acl
from botlib.services import slacker
from singleton_decorator import singleton

logger = logging.getLogger(__name__)
logging.getLogger('apscheduler').setLevel(logging.WARNING)


@singleton
class DropinRegistry:
    dropinregistry = {}
    cmdregistry = {}
    objregistry = {}
    groups_registry = {}
    notifier_registry = []

    def __init__(self):
        self.scheduler = BackgroundScheduler()
        # Shut down the scheduler when exiting the app
        atexit.register(lambda: self.scheduler.shutdown(wait=False))
        self.load_time = datetime.now()
        self.reload()

        try:
            signal.signal(signal.SIGHUP, self.handler)
        except AttributeError:  # Windows doesn't support SIGHUP
            pass

    def handler(self, signum, frame):
        if signum is signal.SIGHUP:
            self.reload()

    def reload(self):
        self.load_dropins()
        self.load_groups()
        self.load_time = datetime.now()

    def load_dropins(self):
        # Loads the drop-ins from the file system.
        self.dropinregistry.clear()
        self.cmdregistry.clear()
        self.objregistry.clear()
        self.notifier_registry = []

        plugin_dirs = ['dropins/rest', 'dropins/py', 'dropins/db', 'dropins/notify']
        for dir in plugin_dirs:
            expanded_path = os.path.expanduser(dir)

            if not os.path.exists(expanded_path):
                continue
            for name in os.listdir(expanded_path):
                pathname = os.path.join(expanded_path, name)
                try:
                    if expanded_path.endswith('notify') and (pathname.endswith('.dropin')):
                        drop_in = NotifierDropin(pathname)
                        if drop_in.enabled:
                            self.notifier_registry.append(drop_in)
                    elif expanded_path.endswith('db') and (pathname.endswith('.dropin') or pathname.endswith('.sql')):
                        try:
                            if pathname.endswith('.dropin'):
                                drop_in = DBDropin(pathname)
                            elif pathname.endswith('.sql'):
                                drop_in = DbSqlDropin(pathname)

                            if not drop_in.enabled:
                                print('disabled dropin file: ' + str(pathname))
                                continue
                            
                            print ('loaded ' + str(drop_in.command) +'.'+ str(drop_in.obj) +'.'+ str(drop_in.modifier) + ' from ' + str(pathname))

                            cmdtuple = drop_in.command, drop_in.obj, drop_in.modifier
                            self.dropinregistry[cmdtuple] = drop_in
                            if drop_in.command in self.cmdregistry:
                                self.cmdregistry[drop_in.command].add(drop_in)
                            else:
                                self.cmdregistry[drop_in.command] = {drop_in}

                            key = drop_in.command, drop_in.obj
                            if key in self.objregistry:
                                self.objregistry[key].add(drop_in)
                            else:
                                self.objregistry[key] = {drop_in}
                            # Build the RBAC
                            # # resources
                            # for resource in resources:
                            acl.add_resource(drop_in.obj)
                            acl.allow(drop_in.role, drop_in.command, drop_in.obj)
                        except:
                            print('error loading from ' + str(pathname))
                            raise
                    elif expanded_path.endswith('rest') and (pathname.endswith('.dropin')):
                        # @TODO - add rest dropin support
                        pass
                    elif expanded_path.endswith('py') and (pathname.endswith('.dropin')):
                        # @TODO - add py dropin support
                        pass
                except Exception as ex:
                    exc_type, exc_value, exc_traceback = sys.exc_info()
                    print traceback.format_exception(exc_type, exc_value, exc_traceback)
                    pass  # Ignore any malformed dropins

        self.schedule_notifiers()

    def load_groups(self):
        # Loads the drop-ins from the file system.
        self.groups_registry.clear()

        expanded_path = os.path.expanduser('cfg/groups')
        for name in os.listdir(expanded_path):
            pathname = os.path.join(expanded_path, name)
            if os.path.isfile(pathname) and (pathname.endswith('.group')):
                with open(pathname, "r") as groupfile:
                    basename = os.path.basename(pathname)
                    groupname = os.path.splitext(basename)[0].lower()
                    grouplist = []
                    for line in groupfile:
                        line = line.strip()
                        if not line.startswith("#") and '|' in line:
                            try:
                                mid, name, friendlyname = re.compile("\s*\|\s*").split(line, 3)
                                grouplist.append(GroupInfo(mid, name, friendlyname))
                            except Exception as ex:
                                print "Bad entry:" + line + ' ignored'
                    self.groups_registry[groupname] = grouplist

    def get_groupmids(self, groupname):
        return ','.join(self.get_groupmid_list(groupname))

    def get_groupmid_list(self, groupname):
        mids = []
        for groupinfo in self.groups_registry[groupname.lower()]:
            mids.append("'" + groupinfo.mid + "'")
        return mids

    def list_groups(self, sc, user, channel, cmdline):
        output = []
        if cmdline.modifier:
            group = cmdline.modifier
            output.append('Group ' + group + ' has ' + str(len(self.get_groupmid_list(group))) + ' mids')
        else:
            for group in self.groups_registry:
                output.append('Group ' + group + ' has ' + str(len(self.get_groupmid_list(group))) + ' mids')
        sc.send_output(channel, '\n'.join(output), '```', '```')

    def list_jobs(self, sc, user, channel, cmdline):
        output = StringIO()
        self.scheduler.print_jobs(out=output)
        sc.send_output(channel, output.getvalue(), '```', '```')

    def get_dropin(self, command, obj, modifier):
        # Retrieves a drop-in based on inputs.
        cmdtuple = command, obj, modifier
        if cmdtuple in self.dropinregistry or command is "help" or command is "user":
            dropin = self.dropinregistry.get(cmdtuple)
            return dropin

        return None

    def schedule_notifiers(self):
        if not self.scheduler.running:
            self.scheduler.start()
        self.scheduler.remove_all_jobs()
        for notifier in self.notifier_registry:
            if not notifier.channel:
                continue
            if not notifier.enabled:
                continue
            channel_id = slacker.get_group_id(notifier.channel.replace('#', ''))
            scheduled_notifier = copy.copy(notifier);
            if notifier.cron:
                trigger = CronTrigger(**(vars(notifier.cron)))
                # Pass a copy to the scheduler
                self.scheduler.add_job(func=lambda: self.notify_runner(channel_id, scheduled_notifier), trigger=trigger,
                                       replace_existing=True, next_run_time=datetime.now(), name=notifier.description)
            elif notifier.interval:
                trigger = IntervalTrigger(**(vars(notifier.interval)))
                self.scheduler.add_job(func=lambda: self.notify_runner(channel_id, scheduled_notifier), trigger=trigger,
                                       replace_existing=True, next_run_time=datetime.now(), name=notifier.description)



    def notify_runner(self, channel, notifier):
        if not notifier.quiet:
            slacker.send_output(channel, notifier.message)
        for cmd in notifier.commands:
            cmdline = CommandParser()
            cmdline.parse(slacker, channel, cmd.split(), notifier.user)
            dispatcher = CommandDispatcher()
            dispatcher.dispatch(slacker, channel, notifier.user, cmdline, quiet=notifier.quiet,
                                message=notifier.message)
