-- Count the APK versions installed for <App UUID>
-- @header App
select app.name,
       app.uuid,
       app.package_name,
       app.approval_status,
       dev.name as 'dev',
       dev.uuid as 'dev id',
       dev.approval_status as 'dev approval'
  from meta.developer_app app
 inner join meta.developer dev
    on app.developer_id = dev.id
 where app.uuid={inputs};

-- @header Installs
select app_version_code, 
       count(*) as 'Installs' 
  from meta.device_app 
 inner join meta.developer_app 
    on device_app.app_package_name = developer_app.package_name 
 where uuid={inputs} 
 group by app_version_code desc;
