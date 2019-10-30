-- Get more info on apps by searching their UUID "get app details <App UUID>"
SELECT uuid, name, approval_status, package_name AS 'APK Name', application_id AS 'RAID'
    FROM meta.developer_app
    WHERE uuid = {inputs};