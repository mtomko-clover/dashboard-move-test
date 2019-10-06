import sys
import traceback

import botlib.core
from botlib.extensions.integrations.db.dbconfig import run_query
from botlib.security import model, context
from botlib.security.model import permission_control


class CommandDispatcher:

    def __init__(self):
        pass

    @context.check_permission("add", "user", message="can't add user")
    def adduser(self, sc, input_list, user, channel):
        new_user = input_list[3:12]
        with open('users.txt', 'a') as userfile:
            userfile.write(new_user + '\n')
        model.update_whitelist()
        sc.send_output(channel, 'User Added: ' + new_user)

    @staticmethod
    def dropinhelp(sc, channel, user, dropin, verbose=True):
        if permission_control(channel, user, dropin.command, dropin.obj):
            if dropin.help:
                help_output = ''
                help_output += '\n_*' + dropin.help + ' : ' + dropin.description + '*_' + '\n'
                if verbose:
                    optlist = []
                    for arg, optionobj in dropin.options.items():
                        if arg:
                            optlist.append('> _*-' + arg + '*_ : ' + optionobj.description)
                        else:
                            optlist.append('> _*(default)' + '*_ : ' + optionobj.description)
                    help_output +=  '\n'.join(optlist) + '\n'
                return help_output
        return ''

    def help(self, sc, channel, user, command=None, obj=None, modifier=None, inputs=None):
        help_output = ''
        if 'help' in command:
            help_output += '*' + "If'n you wanna query a diff environment add a '=dev1' to the end" + '*' + '\n'
            help_output += '*' + "Here are the commands I know about" + '*' + '\n'
            for cmd in botlib.core.registry.dropinregistry:
                dropin = botlib.core.registry.dropinregistry[cmd]
                help_output += self.dropinhelp(sc, channel, user, dropin, verbose=False)
            sc.send_output(channel, help_output)

        elif 'help' in obj:
            help_output += '*' + "Here are the " + command + " commands I know about" + '*' + '\n'
            dropins = botlib.core.registry.cmdregistry[command]
            for dropin in dropins:
                help_output += self.dropinhelp(sc, channel, user, dropin)
            sc.send_output(channel, help_output)

        elif 'help' in modifier:
            help_output += '*' + 'Here are the ' + command + ' ' + obj + ' commands I know about' + '\n'
            dropins = botlib.core.registry.objregistry[command, obj]
            for dropin in dropins:
                help_output += self.dropinhelp(sc, channel, user, dropin)
            sc.send_output(channel, help_output)
        elif 'help' in inputs:
            help_output += '*' + 'Here are the ' + command + ' ' + obj + ' ' + modifier + ' commands I know about' + '\n'
            dropin = botlib.core.registry.dropinregistry[command, obj, modifier]
            help_output += self.dropinhelp(sc, channel, user, dropin)
            sc.send_output(channel, help_output)


    @staticmethod
    def execute_command(sc, channel, cmdline, quiet=False, message=None):
        conf_registry = botlib.core.ConfigRegistry()
        configs = []
        if cmdline.targets:
            for target in cmdline.targets:
                configs.append(conf_registry.get_db(target))

        for config in configs:
            run_query(sc, channel, cmdline, quiet, message, config)

    def dispatch(self, sc, channel, user, cmdline, quiet=False, message=None):
        # Internal commands
        try:
            if 'user' in cmdline.command and 'add' in cmdline.object:
                new_user = cmdline.modifier
                sc.logactivity(user, channel, 'User Added: ' + new_user)
                with open('users.txt', 'a') as file:
                    file.write(new_user + '|' + 'default' + '|' + '\n')
                model.update_whitelist()
                sc.send_output(channel, 'User Added: ' + new_user)
                return

            if 'help' in cmdline.command:
                self.help(sc, channel, user, cmdline.command, cmdline.object, cmdline.modifier)
                return

            if 'about' in cmdline.command:
                self.about(sc, channel)
                return
            if 'reload' in cmdline.command:
                self.reload(sc, channel)
                return

            if 'list' in cmdline.command:
                if 'groups' in cmdline.object:
                    botlib.core.registry.list_groups(sc, user, channel, cmdline)
                    return
                elif 'jobs' in cmdline.object:
                    botlib.core.registry.list_jobs(sc, user, channel, cmdline)
                    return
                elif 'targets' in cmdline.object:
                    output = 'Targets: ' + ','.join(botlib.core.conf_registry.get_targets())
                    sc.send_output(channel, output, '```', '```')
                    return

            if cmdline.runas:
                user = cmdline.runas

            # Send it off to the plugins
            if model.permission_control(channel, user, cmdline.command, cmdline.object):
                if not quiet:
                    sc.sendwait(channel, user, cmdline.original)
                self.execute_command(sc, channel, cmdline, quiet=quiet, message=message)
        except Exception:
            exc_type, exc_value, exc_traceback = sys.exc_info()
            sc.send_output(channel, '*Failed executing command*' + '```' + ''.join(
                traceback.format_exception(exc_type, exc_value, exc_traceback)) + '```')

    def about(self, sc, channel):
        output = 'Version: ' +  botlib.__version__ + '\n'
        output += 'Dropins loaded ' + botlib.core.registry.load_time.strftime("%A %m/%d/%y %I:%M:%S %p") + '\n'
        sc.send_output(channel, output)


    def reload(self, sc, channel):
        sc.send_output(channel, 'Reloading...')
        botlib.core.registry.reload()


