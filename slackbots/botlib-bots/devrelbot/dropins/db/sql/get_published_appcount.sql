SELECT Count(*) 
FROM   developer_app 
WHERE  approval_status = 'PUBLISHED' 
       AND hidden = 0 
       AND system_app = 0 
       AND deleted_time IS NULL 