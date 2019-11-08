-- Find an app given a partial name, uuid, email address, ...
-- @header Most Recent (not NEW)
select app.uuid, 
       app.name,
       if (app.application_id is not null, 'X', '') as 'raid',
       if (app.package_name is not null, 'X', '') as 'apk',
       if (app.site_url is not null, 'X', '') as 'web',
       app.approval_status,
       developer.name as 'dev',
       developer.uuid as 'dev uuid',
       developer.approval_status as 'dev status'
  from meta.developer_app app
 inner join meta.developer 
    on app.developer_id = developer.id
 where (app.uuid like '%{inputs}%'
    or app.name like '%{inputs}%'
    or app.package_name like '%{inputs}%'
    or app.site_url like '%{inputs}%'
    or developer.uuid like '%{inputs}%'
    or developer.name like '%{inputs}%'
    or developer.first_name like '%{inputs}%'
    or developer.last_name like '%{inputs}%'
    or developer.email like '%{inputs}%'
    or developer.phone like '%{inputs}%'
    or developer.business_legal_name like '%{inputs}%'
    or developer.pr_name like '%{inputs}%'
    or developer.pr_email like '%{inputs}%'
    or developer.pr_phone like '%{inputs}%'
    or developer.signor_name like '%{inputs}%'
    or developer.emergency_email like '%{inputs}%')
   and app.approval_status != 'NEW'
   and developer.approval_status != 'NEW'
 order by app.first_submitted_time desc, app.created_time desc
 limit 19;

-- @header # Matching Apps
select count(*) as ''
  from meta.developer_app app
 inner join meta.developer on app.developer_id = developer.id
 where (app.uuid like '%{inputs}%'
    or app.name like '%{inputs}%'
    or app.package_name like '%{inputs}%'
    or app.site_url like '%{inputs}%'
    or developer.uuid like '%{inputs}%'
    or developer.name like '%{inputs}%'
    or developer.first_name like '%{inputs}%'
    or developer.last_name like '%{inputs}%'
    or developer.email like '%{inputs}%'
    or developer.phone like '%{inputs}%'
    or developer.business_legal_name like '%{inputs}%'
    or developer.pr_name like '%{inputs}%'
    or developer.pr_email like '%{inputs}%'
    or developer.pr_phone like '%{inputs}%'
    or developer.signor_name like '%{inputs}%'
    or developer.emergency_email like '%{inputs}%')
   and app.approval_status != 'NEW'
   and developer.approval_status != 'NEW';
