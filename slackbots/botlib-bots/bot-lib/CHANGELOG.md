Changelog
=========

1.3.5 (2018-01-27)
------------
- Add enable/disable capability for db dropins Added about and reload
  commands Support injecting target environment in headers - {target}
  Added LEFT JOIN for MB Roms for devices which don't support it (Flex)
  [Mike Brooking]
- Add space for notify to work correctly. [Mike Brooking]
- Manage multiple tunnels, push group parsing down to dbconfig. [Mike Brooking]
- Correct ssh tunnel connections. [Mike Brooking]
- Add audit for merchant devices ROMs. [Mike Brooking]
- Merge branch 'master' of https://github.com/kristalinc/isv-tools.  [Mike Brooking]
- Add daxco group. [Mike Brooking]
- Correct isvbot dropin format parameters. [Mike Brooking]
- Restructuring config, multi targets support. [Mike Brooking]

1.3.3 (2018-01-22)
------------------
- Preparing release 1.3.3. [Mike Brooking]
- Remove bot tokens. [Mike Brooking]
- Deal with non-unique columns for pdf generation. [Mike Brooking]
- Use friendly name in jobs. [Mike Brooking]
- Merge branch 'datetime_work' [Mike Brooking]
- Datetime command line options list jobs implementation. [Mike Brooking]
  Fixes #7
  Fixes #18
- Merge branch 'sop_support' [Mike Brooking]
- Encrypted bot.yaml support using SOPS. [Mike Brooking]
  Fixes #21
- Fix double header output. [Mike Brooking]
- Cleanup dependencies, add @channel to notify, pdf and markdown output support. [Mike Brooking]
- CSV Output Support. [Mike Brooking]
- Fix help, deal with NaT timestamps, historical merchant group info,
  activation time in device info requests. [Mike Brooking]
- Incorrect quiet default. [Mike Brooking]
- Restore File. [Mike Brooking]
- Put unresolved errors back. [Mike Brooking]
- Add full command level help. [Mike Brooking]
- Get merchany byname using gateway MID. [Mike Brooking]
- Push messages all the way through on notify. [Mike Brooking]
- Allow for quiet mode in notifier. [Mike Brooking]
- Fix Merchant Group query. [Mike Brooking]
- Tweaked merchant settings output to make it more readable. [Mike Brooking]
- Batch up help Insure we replace background jobs on reloads. [Mike Brooking]
  Fixes #19
- Correct channel for bbbot. [Mike Brooking]
- Enabled/Disabled flag for notifiers to dynamically manage. [Mike Brooking]
- Guess I should read my own docs, should be hours, not hour. [Mike Brooking]
- Dropin restructuring. [Mike Brooking]
- Woo Hoo! async notifier work. [Mike Brooking]
  Fixes #3
- Merge branch 'master' of https://github.com/kristalinc/isv-tools.
- Cleanup. [Mike Brooking]
- Common config, yaml based config. [Mike Brooking]
  Fixes #17
- Fix help on default options. [Mike Brooking]
- Cleanup markdown for more string rendering in github. [Mike Brooking]
- Doc updates. [Mike Brooking]
- Doc Updates Fixes #9. [Mike Brooking]
- Remove default behavior command line options. [Mike Brooking]
- Eliminate the need to associate a command line option to the default behavior Fixes #15. [Mike Brooking]
- Get app versions dropin, handle default published apps. [Mike Brooking]
- Add SQL Debug option Add loop capability for SQL dropins 
- Additional roles for dra,rm and pssa 
- Fix device info for devices which don't have SB Rom Fixes #16. [Mike Brooking]
- Correct pagination buffer handling. [Mike Brooking]
- Correct option in mg merchants. [Mike Brooking]
- Add newlne between vertical elements, correct mg byname dropin. [Mike Brooking]
- Merchant group commands. [Mike Brooking]
- Preparing for new integrations, support vertical format in dropin options. [Mike Brooking]
- Add SB ROM. [Mike Brooking]
- Add vertical formatting ability. [Mike Brooking]
- Add chip_uid and imei to get device info. [Mike Brooking]
- Add high value merchant group. [Mike Brooking]
  Fixes #14
- Bump lib version, dependencies. Handle slack errors better. [Mike Brooking]
- Cleanup requirements, ignore SIGHUP for Windows. [Mike Brooking]
- Correct software device info dropins. [Mike Brooking]
- Support default inputs. Allow optional hours to be specified for get unknown errors. [Mike Brooking]
- Remove header line. [Mike Brooking]
- Add shopkeep group. [Mike Brooking]
  Fixes #11
- Formatting for get device info. [Mike Brooking]
- Cleanup get device info, fix list groups. [Mike Brooking]
- Extend device info with additional info. [Mike Brooking]
- Fix list groups, add lvcc. [Mike Brooking]
- Starting REST dropins, fix list groups. [Mike Brooking]
- Update Bypass groups. [Mike Brooking]
- Rename dropin to reflect the DB aspects. New variations coming. [Mike Brooking]
- Provide error details on command execution. [Mike Brooking]
- Propogate missing config errors. [Mike Brooking]
- Make app a module. [Mike Brooking]
- Provide example config files. [Mike Brooking]
- Mods for library changes Example dropins for Billing and Boarding.
- Add for moves. [Mike Brooking]
- Add new scripts locations. [Mike Brooking]

1.3.2 (2018-01-21)
- Preparing release 1.3.2. [Mike Brooking]
- Working on Automating Release. [Mike Brooking]
- Use friendly name is jobs. [Mike Brooking]
- Datetime command line options list jobs implementation. [Mike
  Brooking]
- Cleanup dependencies, add @channel to notify, pdf and markdown output
  support. [Mike Brooking]
- Tweaked merchant settings output to make it more readable. [Mike
- Batch up help Insure we replace background jobs on reloads. [Mike
- Enabled/Disabled flag for notifiers to dynamically manage. [Mike
- Guess I should read my own docs, should be hours, not hour. [Mike
- Eliminate the need to associate a command line option to the default
  behavior Fixes #15. [Mike Brooking]
- Get app versions dropin, handle default published apps. [Mike
- Add SQL Debug option Add loop capability for SQL dropins Additional
  roles for dra,rm and pssa Fix device info for devices which don't have
  SB Rom Fixes #16. [Mike Brooking]
- Add newlne between vertical elements, correct mg byname dropin. [Mike
- Preparing for new integrations, support vertical format in dropin
  options. [Mike Brooking]
- Bump lib version, dependencies. Handle slack errors better. [Mike
- Support default inputs. Allow optional hours to be specified for get
  unknown errors. [Mike Brooking]
- Get app versions dropin. [Mike Brooking]
- Rename dropin to reflect the DB aspects. New variations coming. [Mike
- Restructure to simplify new bot creation. [Mike Brooking]
  Fixes #8
- New Device Info for a given merchant or group. [Mike Brooking]
- Add new users Extend column widths for get transactions. [Mike
- Provide full command in wait message. [Mike Brooking]
- Add new group builtin Finally cleanup transactions rollup query Insure
  we aren't caching results. [Mike Brooking]
- No more arbitrary message output limit Tweaking some dropins. [Mike
- Update groups. [Mike Brooking]
- Ignore dbcfg files. [Mike Brooking]
- Remove credentials from prod.dbcfg. [Mike Brooking]
- Improved rollup in transactions (still issue with name in total) New
  groups. [Mike Brooking]
- Initial groups implementation Do validation on state of connection in
  cache. [Mike Brooking]
  Fixes #6
- Merge remote-tracking branch 'origin/master' [Mike Brooking]
- Fix other imports. [Mike Brooking]
- Correct imports, project root is chatbots. [Mike Brooking]
- Restructure dropin registry, logging. [Mike Brooking]
- Restructure imports. [Mike Brooking]
- Detect and recover from websocket closing in slack instance Begin work
  on scheduled notifier plugins. [Mike Brooking]
- More refactoring. [Mike Brooking]
- Adding new merchant and device info dropins. [Mike Brooking]
- New dropins. [Mike Brooking]
- Implemented runas Fixes #1. [Mike Brooking]
- Security ACL added. [Mike Brooking]
- Insure we only respond to direct mentions. [Mike Brooking]
- Extended help Better message filtering. [Mike Brooking]
- Checkpoint initial work on dynamic help. [Mike Brooking]
- Dynamic loading of plugins. [Mike Brooking]
- Add example dbcfg. [Mike Brooking]
- Preparing for other dropin types Handle defaultoptions and
  aggregations fix to lag dropin DB Connection caching. [Mike Brooking]
- More refactoring, generalizing parsing using argparse. [Mike Brooking]
- Code inspection cleanup. [Mike Brooking]
- Restore help until wired in from dropins move slack related methods to
  slackutils migrate path initialization relative to isvbot. [Mike
- Handle single options. [Mike Brooking]
- Improvements to monitor script. [Mike Brooking]
- Cleanup, disambiguate shadowed objects. [Mike Brooking]
- Correct incorrect version info for sshtunnel. [Mike Brooking]
- Merge cleanup. [Mike Brooking]
- DB retrieval push to ISVBot. [Bret]
- Full RBAC, extended Whitelist. [Mike Brooking]
- Check script updates. [Mike Brooking]
- Changes for updated package versions. [Mike Brooking]
- Updated README. [Mike Brooking]
- Update to newer modules. [Mike Brooking]
- Add Numpy, updating local install. [Mike Brooking]
- Update config, getting devices settings working. [Mike Brooking]
- Initial skeleton. [Mike Brooking]
