-- Get the DAV info for a developer, plus any app info
select addresses, names, emails for individual and corporate info in DAV. Mimic the txt file attached to DAV jiras. But redact EIN?

;
select app name, uuid, approval status, has_raid, has_apk, has_webapp for developer

where developer_uuid = '{input}'
