-- Get developer info by name "get developer <name>"
SELECT uuid, name, approval_status, email, business_legal_name AS 'Business Name', address, city, state, postal_code AS 'Zip'
    FROM meta.developer
    WHERE NAME LIKE CONCAT('%',{inputs},'%') limit 25;