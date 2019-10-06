# ISVBOT Dropins

The current list of dropins for the ISVBot are:
### Merchant Groups

##### get mg byname <Name to query> : Find merchant groups by name
Parameter is enclosed in a ``LIKE %<param>%`` to allow wildcard searching. Use an additional % within the parameter as needed to escape blanks.

Example:
**get mg byname 1072**
```
id            : 2376
uuid          : CENCPFK5BG2NY
name          : Bypass-Tethering group  - 1.55 1.46 Mini ROMs + 1072 Station ROM + 19 Jun Apps
modified_time : 2017-08-08 06:16:26
id            : 2593
uuid          : 0MCQGRBZNJ90C
name          : Bypass Single Ethernet Tethering - 14 Aug Apps + (1.55 Min/1.51 Mob) MB 1.48 SB ROMs + Station ROM 1072
modified_time : 2018-01-08 20:41:41
```
 
##### get mg merchants <MG UUID> : Find all merchants in the given merchant group UUID
 
* -i : Find all merchants in the given merchant group IDs
* (default): Find all merchants in the given merchant group UUID

Example: **get mg merchants 0MCQGRBZNJ90C** or **get mg merchants -i 2593**
```
uuid                 name          
WJM3D6619CJ0Y  ALLEN EVENT CENTER      
5Y5RX3RQ0ANX8  COURSES AT WATTERS CREEK
GS3JT1RJMXZZP  BYPASS MOBILE SALES     
C1ETE9KX6TKHW  2WSHGTN NTNLS           
7SEMFTW8KCA6P  1WSHGTN NTNLS           
M1PMNJSAE7VP8  EVERBANK FIELD-CON      
RTSDKWPS1W4Z6  EVERBANK FIELD-SUITES/CA
GTS262H1FQHNM  EVERBANK FIELD-CLUBS    
DKCCS5Y07RYKT  EVERBANK FIELD-PREMIUM  
CX3BE1AXK341A  Nationals Park          
T771VPPMQMPGW  AMK CITI FIELD CONCES   
66VF2TDDCJ8H0  Elior North America     
F44GYPQSD0D26  SPORTSERVICE AT METLIFE 
5Z96XJVPQW164  AMK CITI FIELD CATERING 
V4CDNST67ENT6  AMK CITI FLD CATER 6158 
BQGNF0ZMZCA3W  AMK CITI FLD USSE 6784  
85CH9776XN1NT  AMK CITI FLD CONCES 6103
SMVG5VAV7B34E  AMK CITI FLD STE 6162   
9FJGEVEBWPT00  AMK CITI FLD RSTRNT 6154
Z3XMTC41XJ0RY  AMK CITI FLD STER 6175  
D21BEN9FFYVXA  AMK CITI FLD RETAIL 6171
```

### Merchant
 
##### audit merchant transactions <MERCHANT_UUID|GROUP> : audit merchant transactions audit report 
* (default) : Get a transaction audit report for the given merchant or group

##### get merchant settings [-cgetms] : Retrieve the settings for one or more merchants
* -a : All merchant related configurations.  Equivalent to options --cgetms
* -e : Extended settings for the merchant(s)
* -g : Gateway settings for the merchant(s)
* -m : Merchant Group Membership for the merchant(s)
* -s : Merchant Group Software configuration for the merchant(s)
* -t : Payment Terminal Config settings for the merchant(s)
* (default) : Core settings for the merchant(s)

##### get merchant bydevice <device serial> : get merchant info by device
* (default) : get merchant info by by a device

##### get merchant byname <Name to query> : get merchant info by name
* -g : get merchant info by group
* (default): get merchant info by name - use % for LIKE syntax

**get merchant byname AMK%CITI%FIELD%CATERING**
```
UUID                Name                MID         Modified Time   
5Z96XJVPQW164  AMK CITI FIELD CATERING  335065510885 2018-01-31 05:07:26
```
### Device Management
##### get activation code <SERIAL_NUMBER> : Get activation code details for a device
* (default) : Get activation code details for a device

##### get app versions <Merchant Group UUID> : get app versions
* (default) : get app versions
* -x : get app versions

##### get device info <SERIAL_NUMBER> : get device information
* -s : get device software versions
* -g : get device information by merchant or group
* (default) : get device information

##### get merchant transactions <MERCHANT_UUID|GROUP> : Get transaction information for a merchant
* -c : Get transaction information for a merchant
* (default) : Get transaction information for a merchant

### P801 Lag
##### get lag p801 : Display how far the replication is lagging to p801
* (default) : Display how far the replication is lagging to p801


#### Builtin Commands

##### list groups [group]: get a list of known groups

##### about - retrieve version and dropin reload time

##### reload - reload the dropin and groups

##### add user <USER> [role] - requires superuser role

Add a given user to the whitelist with the given role.
Role is default if not specified