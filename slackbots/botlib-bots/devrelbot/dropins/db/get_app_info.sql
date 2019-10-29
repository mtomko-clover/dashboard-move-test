-- Show App Info for an app uuid
select uuid, name, developer_name, developer_uuid, approval status, dates, has_raid, has_apk, has_webapp, developer_approval, apk count, latest apk date
       , apks published/approved, app public/private, app public/private derived from status vs column
where uuid = '{inputs}'
--show vertically?
;
-- summarize permissions
select concat( if(write_customer, ', write_customer', ''), ....)
  where uuid = '{inputs}';
;
select active subscriptions
;
select us/canada based on subscription
; 
