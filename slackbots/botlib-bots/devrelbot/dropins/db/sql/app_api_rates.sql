--@enabled true
--@help: get app's api rate limits
SELECT request_limit, concurrent_request_limit, merchant_request_limit, concurrent_merchant_request_limit
FROM meta.developer_app
WHERE uuid
IN ({inputs})
