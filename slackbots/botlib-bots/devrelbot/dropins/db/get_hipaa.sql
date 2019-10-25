-- @enabled true
-- @help: get hipaa merchants who have apps needing uninstall
-- get hipaa merchants which need apps removed
USE meta;
SELECT DISTINCT(merchant_app.merchant_id), (SELECT NAME
    FROM   merchant
    WHERE  merchant.id = merchant_app.merchant_id) AS 'Name'
FROM   merchant_app
WHERE  deleted_time IS NULL
    AND merchant_id IN (SELECT id
        FROM   merchant
        WHERE  merchant_plan_id IN (SELECT id
            FROM   merchant_plan
            WHERE  app_bundle_id = (SELECT id
                FROM   app_bundle
                WHERE  uuid = '7V4586G1JRR60')))
    AND app_id NOT IN (SELECT developer_app_id
        FROM   app_app_bundle
        WHERE  app_bundle_id = (SELECT id
            FROM   app_bundle
            WHERE  uuid = '7V4586G1JRR60'));