-- Get an app's APK info given a uuid
select # apks, # approved apks, # apks pending approval, current published/default version#, install count, ???
  from android_versions & developer_app
 where developer_app.uuid = '{input}'
;
select date, version, version#, approval_state, virus_scan_state, isDefault, ???
  from android_version
  where developer_app.uuid = '{input}'
 limit 15[H
 order by date desc
;
select app_is_approved, developer_is_approved
 for uuid
