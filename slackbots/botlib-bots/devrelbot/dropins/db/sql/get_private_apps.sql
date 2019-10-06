SELECT app.uuid, 
       app.NAME, 
       dev.NAME, 
       Date_format(app.created_time, "%b'%y") 
FROM   developer_app app 
       INNER JOIN developer dev 
               ON dev.id = app.developer_id 
WHERE  app.approval_status = 'APPROVED' 
ORDER  BY app.created_time DESC; 