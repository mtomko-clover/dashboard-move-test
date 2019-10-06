import argparse
import logging
from datetime import datetime, timedelta

import botlib.core
import dateparser
from botlib.core.command_dispatcher import CommandDispatcher

logger = logging.getLogger(__name__)


class CommandParser:
    def __init__(self):
        self.command = None
        self.original = None
        self.object = ''
        self.modifier = ''
        self.modifier_args = None
        self.targets = ['prod']
        self.formatters = None
        self.description = 'No Description'
        self.runas = None
        self.options = {}
        self.inputs = {}
        self.sqldebug = False
        self.dryrun = False
        self.end_time = datetime.now()
        self.start_time = self.end_time - timedelta(hours=24)
        self.commandDispatcher = CommandDispatcher()

    def __str__(self):
        return self.original

    def parse(self, sc, channel, cmdline, user):
        self.original = ' '.join(cmdline)
        parser = argparse.ArgumentParser(add_help=False)
        parser.add_argument('command')
        parser.add_argument('object', nargs='?', default='')
        parser.add_argument('modifier', nargs='?', default='')
        parser.add_argument('unparsed_args', nargs=argparse.REMAINDER)

        try:
            args = parser.parse_args(cmdline)
        except SystemExit:
            # Handle arg parse errors
            sc.send_output(channel, 'Invalid command line: ' + self.original)
            return
        self.command = args.command.lower()
        self.object = args.object.lower()
        self.modifier = args.modifier.lower()
        unparsed_args = args.unparsed_args

        if (self.command == 'help') or \
                (self.command == 'about') or \
                (self.command == 'reload') or \
                ('list' in self.command and 'groups' in self.object) or \
                ('list' in self.command and 'targets' in self.object) or \
                ('list' in self.command and 'jobs' in self.object):
            # Handled by a builtin
            return

        if 'help' in self.object or 'help' in self.modifier or 'help' in unparsed_args:
            # # Call the context help builder
            # Need to do more hardening.
            self.commandDispatcher.help(sc, channel, user, self.command, self.object, self.modifier, unparsed_args)
            self.command = None
            return

        if 'runas' in self.command:
            # Need to shift the commands and run as the given user
            self.runas = self.object
            self.command = self.modifier
            self.object, self.modifier = unparsed_args[:2]
            del unparsed_args[:2]

        # Lets see if we have a dropin loaded to support this command
        dropin = botlib.core.registry.get_dropin(self.command, self.object, self.modifier)
        if not dropin:
            sc.send_output(channel, 'Invalid command line: ' + self.original)
            self.command = None
            return

        # Revisit the left over args, looking for target envs
        for arg in unparsed_args:
            if arg.startswith('='):
                environments = arg[len('='):].replace(' ', '')
                self.targets = environments.split(',')
                unparsed_args.remove(arg)
            elif arg.startswith('|'):
                formatters = arg[len('|'):].replace(' ', '')
                self.formatters = formatters.split(',')
                unparsed_args.remove(arg)
            elif arg.startswith('^'):
                start_spec = arg[len('^'):].replace(' ', '')
                self.start_time = dateparser.parse(start_spec)
                unparsed_args.remove(arg)
            elif arg.startswith('$'):
                end_spec = arg[len('$'):].replace(' ', '')
                self.end_time = dateparser.parse(end_spec)
                unparsed_args.remove(arg)
            elif arg.startswith('-XX:'):
                # internal flags, for now just sql debug
                (prefix, option) = arg.split(':')
                if option == 'DUMPSQL':
                    self.sqldebug = True
                elif option == 'DRYRUN':
                    self.sqldebug = True
                    self.dryrun = True
                # else:
                # # Do the default
                unparsed_args.remove(arg)

        # Now try to get the dropin defined options
        if dropin:
            parser = argparse.ArgumentParser(add_help=False)
            for option in dropin.options:
                # May have defaults without specific command line options
                if option:
                    parser.add_argument('-' + option, action='store_true')
            parser.add_argument('help', nargs='?')
            parser.add_argument('unparsed_args', nargs=argparse.REMAINDER)
            try:
                args = parser.parse_args(unparsed_args)
            except SystemExit as ex:
                # Handle arg parse errors
                sc.send_output(channel, 'Invalid command line: ' + self.original + '(' + ex.message + ')')
                return

            options = []
            has_args = False
            nsdict = vars(args)
            for option in dropin.options:
                if nsdict.get(option) is True:
                    options.append(option)
                    unparsed_args.remove('-' + option)
                    has_args = True

            if has_args is True:
                self.options = options

            else:
                self.options = dropin.defaultoptions

            # See if we have an aggregation to replace
            aggregation = ''
            if self.options:
                for option in self.options:
                    aggregation = dropin.options.get(option).aggregation
                    if aggregation:
                        self.options.remove(option)

                if aggregation:
                    self.options.extend(list(aggregation))

                self.modifier_args = options

            inputs = []

            for arg in unparsed_args:
                    inputs.append("'" + arg + "'")

            if not inputs:
                if self.options:
                    for option in self.options:
                        defaultinputs = dropin.options.get(option).defaultinputs
                        if defaultinputs:
                            inputs = defaultinputs
                else:
                    for option in dropin.defoptionlist:
                        defaultinputs = option.defaultinputs
                        if defaultinputs:
                            inputs = defaultinputs
                            break
                # Whatever is left is passed unchanged
            self.inputs = inputs
