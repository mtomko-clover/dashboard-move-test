SELECT app.uuid, 
       app.NAME, 
       dev.NAME, 
       Date_format(app.created_time, "%b'%y") 
FROM   developer_app app 
       INNER JOIN developer dev 
               ON dev.id = app.developer_id 
WHERE  app.approval_status = 'APPROVED' 
ORDER  BY app.created_time DESC; 

SELECT Count(*) 
FROM   developer_app 
WHERE  approval_status = 'PUBLISHED' 
       AND hidden = 0 
       AND system_app = 0 
       AND deleted_time IS NULL 