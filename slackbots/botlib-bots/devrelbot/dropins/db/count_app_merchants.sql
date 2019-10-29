-- Given an app uuid, count the merchants with it installed
select count, merchant
 where uuid='{inputs}';
select count, versions
 where uuid='{inputs}'
  from android_versions + developer_app;
select merchant uuid, name
  from merchant + merchant_app + app
 where ='{inputs}';
