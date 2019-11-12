-- Get more info on apps by searching their UUID "get app details <App UUID>"

SELECT da.uuid AS 'App UUID', da.name AS 'App Name', da.approval_status AS 'Approval Status', d.uuid AS 'Developer UUID', CONCAT(d.first_name, ' ', d.last_name) AS 'Developer Name', da.package_name AS 'APK Name', da.application_id AS 'RAID', da.description AS 'Description', da.privacy_policy AS 'Privacy Policy', da.eula AS 'EULA', da.approval_status AS 'Approval Status', da.support_email AS 'Email'
    FROM meta.developer_app da
    	JOIN meta.developer d
    		ON da.developer_id = d.id
    WHERE da.uuid = {inputs};