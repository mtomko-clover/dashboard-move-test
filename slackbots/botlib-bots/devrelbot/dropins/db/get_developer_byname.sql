-- List developers and their Clover ids by partial name
-- @help get developer byname - find a developer name and uuid
SELECT name, uuid 
  FROM meta.developer
 WHERE name like '%{input}%'
 LIMIT 100
