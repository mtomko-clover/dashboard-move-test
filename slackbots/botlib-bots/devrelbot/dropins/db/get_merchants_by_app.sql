-- get the first 15 developers alphabetically that have an app installed
SELECT meta.developer_app.uuid AS "App ID",
                meta.developer_app.name AS "App Name",
                meta.merchant.uuid      AS "Merchant ID",
                meta.merchant.name      AS "Merchant Name"
FROM   meta.merchant_app
       INNER JOIN meta.merchant
               ON meta.merchant_app.merchant_id = meta.merchant.id
       INNER JOIN meta.developer_app
               ON meta.merchant_app.app_id = meta.developer_app.id
WHERE  meta.developer_app.uuid = {inputs}
AND    meta.merchant_app.deleted_time IS NULL
ORDER BY meta.merchant.name
LIMIT  10;