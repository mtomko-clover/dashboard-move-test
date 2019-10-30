-- show apps in approval

select 'all' as '',
       count(*) as 'Apps Awaiting Approval' 
  from developer_app 
 where approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION

select '', '-- artifacts --'

UNION

select 'with apk' as '',
       count(*) 
  from developer_app 
 where package_name is not null
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION

select 'with webapp' as '',
       count(*) 
  from developer_app 
 where site_url is not null
   and  site_url != ''
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION   

select 'with semi raid' as '',
       count(*) 
  from developer_app 
 where application_id is not null
   and  application_id != ''
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION

select '', '-- permissions --'

UNION      

select 'inventory read' as '',
       count(*) 
  from developer_app 
 where permission_inventory_read = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION      

select 'inventory write' as '',
       count(*) 
  from developer_app 
 where permission_inventory_write = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION      

select 'orders read' as '',
       count(*) 
  from developer_app 
 where permission_orders_read = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION      

select 'orders write' as '',
       count(*) 
  from developer_app 
 where permission_orders_write = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION      

select 'payments read' as '',
       count(*) 
  from developer_app 
 where permission_payments_read = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION      

select 'payments write' as '',
       count(*) 
  from developer_app 
 where permission_payments_write = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION

select '', '-- pii permissions --'

UNION      

select 'customers read' as '',
       count(*) 
  from developer_app 
 where permission_customers_read = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION      

select 'customers write' as '',
       count(*) 
  from developer_app 
 where permission_customers_write = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION      

select 'employees read' as '',
       count(*) 
  from developer_app 
 where permission_employees_read = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION      

select 'employees write' as '',
       count(*) 
  from developer_app 
 where permission_employees_write = 1
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION      

select '', '-- gdpr permissions --'

UNION

select 'ex customers read' as '',
       count(*) 
  from developer_app 
 where 
   (
           permission_customers_address_read      = 1
        OR permission_customers_email_read        = 1
        OR permission_customers_phone_read        = 1
        OR permission_customers_businessname_read = 1
        OR permission_customers_birthdate_read    = 1
        OR permission_customers_note_read         = 1
        OR permission_customers_card_read         = 1
        OR permission_customers_marketing_read    = 1
   )      
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

UNION

select 'ex customers write' as '',
       count(*) 
  from developer_app 
 where 
   (
           permission_customers_address_write      = 1
        OR permission_customers_email_write        = 1
        OR permission_customers_phone_write        = 1
        OR permission_customers_businessname_write = 1
        OR permission_customers_birthdate_write    = 1
        OR permission_customers_note_write         = 1
        OR permission_customers_card_write         = 1
        OR permission_customers_marketing_write    = 1
   )      
   and approval_status = 'PENDING' 
   and name not like '%disabled%'

   ;


