select DATE_FORMAT(first_approval_time, '%b %Y') as 'month', count(*) as 'apps approved' from developer_app where approval_status in ('approved', 'published') and name not like '% disabled %' and first_approval_time >= DATE_ADD(NOW(), interval -2 year) group by  year(first_approval_time) desc, month(first_ap
proval_time) desc;
