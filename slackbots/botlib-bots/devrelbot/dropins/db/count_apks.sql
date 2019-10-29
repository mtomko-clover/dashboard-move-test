-- Count the APK versions installed
select count, version,
  from installed - device table
 where uuid='{inputs}
group by version;
