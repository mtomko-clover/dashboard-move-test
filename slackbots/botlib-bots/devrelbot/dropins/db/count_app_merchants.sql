-- Given an app uuid, count the merchants with it installed
-- @header Merchants with App
select count(*) as ''
  from meta.merchant 
 inner join meta.merchant_app 
    on merchant.id = merchant_app.merchant_id
 inner join meta.developer_app
    on merchant_app.app_id = developer_app.id
 where developer_app.uuid={inputs}
   and merchant_app.deleted_time is null;

-- @header Approved APK versions
select count(*)
  from meta.android_version
 inner join meta.developer_app 
    on android_version.developer_app_id = developer_app.id
 where developer_app.uuid={inputs}
   and android_version.approval_status in ('APPROVED_PENDING_SIGNING','APPROVED','PUBLISHED');

-- @header Recent Merchants (limit 15)
select ROW_NUMBER(),
       merchant.uuid,
       merchant.name,
       DATE_FORMAT(merchant_app.created_time, '%Y-%m-%d') as 'installed',
       IF(ABS(merchant_app.created_time - merchant_app.modified_time) > 10, DATE_FORMAT(merchant_app.modified_time, '%Y-%m-%d'), '') as 'modified'
  from meta.merchant 
 inner join meta.merchant_app 
    on merchant.id = merchant_app.merchant_id
 inner join meta.developer_app
    on merchant_app.app_id = developer_app.id
 where developer_app.uuid={inputs}
   and merchant_app.deleted_time is null
 order by merchant_app.created_time desc
 limit 15;
