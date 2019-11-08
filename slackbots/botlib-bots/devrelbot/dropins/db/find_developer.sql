-- Find an developer given a partial name, uuid, email address, ...
-- @header Most Recent (not NEW)
select name,
       uuid,
       approval_status,
       email,
       pr_email,
       emergency_email,
       phone,
       website
  from meta.developer 
 where (developer.uuid like '%{inputs}%'
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
   and developer.approval_status != 'NEW'
 order by first_submitted_time desc, created_time desc
 limit 19;

-- @header # Matching Devs
select count(*) as ''
  from meta.developer 
 where (developer.uuid like '%{inputs}%'
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
   and developer.approval_status != 'NEW';