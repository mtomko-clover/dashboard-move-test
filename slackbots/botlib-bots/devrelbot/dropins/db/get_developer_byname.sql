-- @enabled = true
-- @help: get developer byname 
-- get developer info by name
  USE meta;
  SELECT id, uuid, name, approval_status, email, business_legal_name AS 'Business Name', address, city, state, postal_code AS 'Zip'
    FROM developer
    WHERE NAME LIKE CONCAT('%',{inputs},'%') limit 25;