-- Get the DAV info for a developer, plus any app info
select addresses, names, emails for individual and corporate info in DAV. Mimic the txt file attached to DAV jiras. But redact EIN?

from meta.developer
where uuid = {inputs}

;

select app name, uuid, approval status, has_raid, has_apk, has_webapp 
from meta.developer_app
inner join meta.developer on developer_app.developer_id = developer.id

where developer_uuid = '{input}'
