-- Find an app given a partial name, uuid, email address, ...
select app uuid, name
from developer_app + developer
where app uuid = uuid, app name like '%{input}%', developer emails like '%{input}%
';
