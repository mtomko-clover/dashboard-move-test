-- Get all devices linked to a merchant, "get merchant devices <Merchant UUID>"
SELECT 	m.uuid AS 'Merchant UUID',
		m.name AS 'Merchant Name',
		d.serial AS 'Device S/N',
		d.cpu_id AS 'Chip/CPU ID'
	FROM meta.merchant_device md 
		LEFT JOIN meta.merchant m 
			ON md.merchant_id = m.id 
		RIGHT JOIN meta.device d 
			ON d.id = md.device_id 
	WHERE m.uuid = {inputs};