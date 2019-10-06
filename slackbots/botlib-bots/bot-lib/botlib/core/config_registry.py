import logging
import os
import ruamel.yaml
import sops
import sys

from singleton_decorator import singleton

logger = logging.getLogger(__name__)


@singleton
class ConfigRegistry:

    def __init__(self):
        self.db = {}
        self.targets = {}
        self.bot_name = None
        self.bot_token = None
        self.def_prompts = ['Working on it {}']

        expanded_path = os.path.expanduser('cfg/bot.yaml')
        filetype = sops.detect_filetype(expanded_path)
        tree = sops.load_file_into_tree(expanded_path, filetype)
        if tree.has_key('sops'):
            sops_key, tree = sops.get_key(tree)
            cfg = sops.walk_and_decrypt(tree, sops_key)
        else:
            with open(expanded_path, 'r') as f:
                cfg = ruamel.yaml.load(f)
        try:
            self.bot_token = cfg.get('bot_token', '')
            self.bot_name = cfg['bot_name']
        except KeyError:
            print 'Invalid Config file, bot_token and bot_name are required'
            sys.exit(1)

        self.prompts = cfg.get('prompts', self.def_prompts)

        configs = cfg.get('targets')  # List of dicts

        for env in configs:
            self.targets[env] = configs[env]

    def get_bot_token(self):
        return self.bot_token

    def get_bot_name(self):
        return self.bot_name

    def get_db(self, target):
        db = []
        cfg = self.targets.get(target)
        if cfg:
            for key in cfg.keys():
                if key.startswith("db"):
                    db.append(Db(cfg.get(key)))
            return db

        return None

    def get_rest_token(self, target):
        cfg = self.targets.get(target)
        if cfg:
            cfg.get('rest_token')
        return None

    def get_prompts(self):
        return self.prompts

    def get_targets(self):
        return self.targets.keys()




class Db:
    def __init__(self, dbcfg):
        self.name = dbcfg.get('name')
        self.default = dbcfg.get('default',False)
        self.tunnel = dbcfg.get('tunnel', True)
        self.ssh_host = dbcfg.get('ssh_host')
        self.ssh_port = dbcfg.get('ssh_port', 22)
        self.ssh_username = dbcfg.get('ssh_username')
        self.ssh_password = dbcfg.get('ssh_password')
        self.db_user = dbcfg.get('db_user')
        self.db_password = dbcfg.get('db_password')
        self.db_port = dbcfg.get('db_port', 3306)
        self.ssl = dbcfg.get('ssl')
