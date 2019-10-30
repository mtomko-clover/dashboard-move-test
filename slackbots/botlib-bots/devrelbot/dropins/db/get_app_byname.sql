-- @help: get app byname <app name>
-- get more info on apps by searching their name
SELECT uuid, name, approval_status, application_id as 'RAID', distribution AS 'Public or Private', package_name AS 'APK Name' 
    FROM meta.developer_app
    WHERE NAME LIKE CONCAT('%',{inputs},'%') limit 25;