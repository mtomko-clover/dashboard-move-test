-- Get the number of merchants an app is installed to
SELECT Count(merchant_app.merchant_id)
FROM   merchant_app
       INNER JOIN developer_app
               ON merchant_app.app_id = developer_app.id
WHERE  developer_app.uuid = {inputs}
       AND merchant_app.deleted_time IS NULL;