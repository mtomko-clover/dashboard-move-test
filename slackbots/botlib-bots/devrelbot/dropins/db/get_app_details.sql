-- @enabled true
-- @help: get app details <App UUID>
-- get more info on apps by searching their UUID
USE meta;
SELECT uuid, name, approval_status, package_name AS 'APK Name', application_id AS 'RAID'
    FROM developer_app
    WHERE uuid = {inputs};