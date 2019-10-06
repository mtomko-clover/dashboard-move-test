import rbac.acl
from rbac.context import IdentityContext

acl = rbac.acl.Registry()
context = IdentityContext(acl)

# roles
acl.add_role('ro')
acl.add_role('default', ['ro'])
acl.add_role('rw', ['ro'])
acl.add_role('isv')
acl.add_role('pssa')
acl.add_role('devrel')
acl.add_role('rm')
acl.add_role('dra')

acl.add_role('admin', ['ro', 'isv', 'rw', 'default'])
acl.add_role('superuser', ['admin', 'ro', 'isv', 'rw', 'default'])

# Builtin resources
acl.add_resource('groups')
acl.add_resource('user')
acl.add_resource('jobs')
acl.add_resource('targets')


# default rules for internal command
# Remaining resources and rules will be defined by plugins
#           role      command   object
acl.allow('default', 'help', '')
acl.allow('default', 'reload', '')
acl.allow('default', 'about', '')
acl.allow('admin', 'runas', '')
acl.allow('admin', 'list', 'groups')
acl.allow('admin', 'list', 'jobs')
acl.allow('admin', 'list', 'targets')
acl.allow('superuser', 'add', 'user')
