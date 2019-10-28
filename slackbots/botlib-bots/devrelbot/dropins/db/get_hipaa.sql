--@enabled true
SELECT DISTINCT(merchant_app.merchant_id), (SELECT NAME
    FROM   meta.merchant
    WHERE  merchant.id = merchant_app.merchant_id) AS 'Name'
FROM   meta.merchant_app
WHERE  deleted_time IS NULL
    AND merchant_id IN (SELECT id
        FROM   meta.merchant
        WHERE  merchant_plan_id IN (SELECT id
            FROM   meta.merchant_plan
            WHERE  app_bundle_id = (SELECT id
                FROM   meta.app_bundle
                WHERE  uuid = '7V4586G1JRR60')))
    AND app_id NOT IN (SELECT developer_app_id
                        FROM   meta.app_app_bundle
                        WHERE  app_bundle_id = (SELECT id
                                                FROM   meta.app_bundle
                                                WHERE  uuid = '7V4586G1JRR60'));
