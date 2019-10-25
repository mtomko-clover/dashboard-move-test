-- @enabled = true
-- @help: get apps bydeveloper 
-- get all apps created by a particular developer, input developer UUID
USE meta; 
SELECT da.uuid AS 'UUID', da.name AS 'Name', da.approval_status AS 'Approval Status', da.application_id as 'RAID', da.privacy_policy AS 'Privacy Policy', da.eula AS 'EULA', da.package_name AS 'APK Name' 
    FROM developer_app da 
        JOIN developer d 
        ON da.developer_id = d.id 
    WHERE d.uuid = {inputs};