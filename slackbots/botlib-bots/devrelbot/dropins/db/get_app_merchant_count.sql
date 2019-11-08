-- Get the number of merchants an app is installed to
SELECT Count(meta.merchant_app.merchant_id)
FROM   meta.merchant_app
       INNER JOIN meta.developer_app
               ON meta.merchant_app.app_id = meta.developer_app.id
WHERE  meta.developer_app.uuid = {inputs}
       AND meta.merchant_app.deleted_time IS NULL;