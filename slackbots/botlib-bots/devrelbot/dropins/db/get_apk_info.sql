-- Get an app's APK info given a uuid
select # apks, # approved apks, # apks pending approval, current published/default version#, install count, ???
  from meta.android_versions & meta.developer_app
 where developer_app.uuid = '{input}'
;
select date, version, version#, approval_state, virus_scan_state, isDefault, ???
  from meta.android_version
  where developer_app.uuid = '{input}'
 limit 15
 order by date desc
;
select app_is_approved, developer_is_approved
  from meta.developer_app + meta.developer
 for uuid
