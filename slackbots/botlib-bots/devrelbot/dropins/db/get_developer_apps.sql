-- List developer apps given a developer uuid
SELECT name, uuid
  FROM meta.developer_app
 INNER JOIN meta.developer on meta.developer_app.developer_id = developer.id[D
 WHERE developer.uuid in ({input})
 LIMIT 100
