SELECT dev.uuid, 
       dev.NAME, 
       Count(*) AS 'apps' 
FROM   developer_app app 
       INNER JOIN developer dev 
               ON dev.id = app.developer_id 
WHERE  app.approval_status = 'APPROVED' 
GROUP  BY dev.uuid, 
          dev.NAME 
ORDER  BY dev.NAME; 