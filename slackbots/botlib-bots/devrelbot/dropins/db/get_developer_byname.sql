-- Get developer info by first or last name, does not work well for full name "get developer <name>" 
SELECT uuid, name, approval_status, email, business_legal_name AS 'Business Name', address, city, state, postal_code AS 'Zip'
    FROM meta.developer
    WHERE name LIKE CONCAT('%',{inputs},'%') 
    OR first_name LIKE CONCAT('%',{inputs},'%')
    OR last_name LIKE CONCAT('%',{inputs},'%')
    limit 150;
