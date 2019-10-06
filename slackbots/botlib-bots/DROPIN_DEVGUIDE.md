# Dropin Developers Guide

## Dropin Definition
A Dropin is a json definition defined in the dropins direcrory, with the file name ending in .dropin.

## Notifier Dropins
A notifier dropin allows you to schedule an existing command at intervals or specific times using cron syntax, and post
the results to a provided channel.

### Dropin Definition
```
{
  "channel": "#bb-8",
  "interval": {"hours": 1 },
  "cron": "",
  "user": "U6G49BTEW",
  "message": "Notifier: Unknown errors in last hour",
  "commands": [
                "get unknown errors 1"
              ]
  "quiet" : true,
  "enabled" : true,
  "description": "Get the unknown errors every hour"
}
```

| Field | Description|Default|
|---|---|---|
|channel|Channel to post results to, with our without leading #|None|
|interval|Trigger definition for interval based firing. See [Details here](#Interval Triggers). Interval takes precedence over cron if both are defined.|None|
|cron|Trigger definition for cron based firing. [Details here](#Cron Triggers)|None|
|user|The user command is run as|None|
|message|Optional message to output when command is run|None|
|commands|List of commands to run|None|
|quiet|Don't output anything to channel unless the command return result|False|
|enabled|Whether this dropin is enabled|True|
|description|Internal docstring describing the dropdown|None|


#### Interval Triggers

Triggers on specified intervals, starting on ``start_date`` if specified, ``datetime.now()`` interval otherwise.


|Type|Name|Description|
|---|---|---|
|int|weeks|number of weeks to wait|
|int|days|number of days to wait|
|int|hours|number of hours to wait|
|int|minutes|number of minutes to wait|
|int|seconds|number of seconds to wait|
|datetime\str|start_date|starting point for the interval calculation|
|datetime\str|end_date|latest possible date/time to trigger on|
|datetime.tzinfo\|str|timezone|time zone to use for the date/time calculations|
|int\|None|jitter|advance or delay the job execution by ``jitter`` seconds at most|
    
Examples

*Schedule job_function to be called every two hours*

> ```
> "interval": {
>                "hours": 2
>             }

*The same as before, but starts on 2018-06-10 at 9:30 and stops on 2018-06-15 at 11:00*
> ```
> "interval": {
>               "hours": 2,
>               "start_date": "2018-06-10 09:30:00",
>               "end_date":"2018-06-15 11:00:00"
>             }

[See full apscheduler docs](http://apscheduler.readthedocs.io/en/latest/modules/triggers/interval.html)

#### Cron Triggers
Triggers when current time matches all specified time constraints,
similarly to how the UNIX cron scheduler works.

|Type|Name|Description|
|---|---|---|
|int or string|year: 4-digit year|
|int or string|month|month (1-12)|
|int or string|day|day of the (1-31)|
|int or string|week|ISO week (1-53)|
|int or string|day_of_week|number or name of weekday (0-6 or mon,tue,wed,thu,fri,sat,sun)|
|int or string|hour|hour (0-23)|
|int or string|minute|minute (0-59)|
|int or string|second|second (0-59)|
|datetime or string|start_date|earliest possible date/time to trigger on (inclusive)|
|datetime or string|end_date|latest possible date/time to trigger on (inclusive)|
|datetime.tzinfo or string|timezone|time zone to use for the date/time calculations(defaults to scheduler timezone)|
|int or None|jitter|advance or delay the job execution by ``jitter`` seconds at most.

##### Expression Types

|Express|Field|Description|
|---|---|---|
|*|any|Fire on every value|
|*/a|any|Fire every a values, starting from the minimum|
|a-b|any|Fire on any value within the a-b range (a must be smaller than b)|
|a-b/c|any|Fire every c values within the a-b range|
|xth y|day|Fire on the x -th occurrence of weekday y within the month|
|last x|day|Fire on the last occurrence of weekday x within the month|
|last|day|Fire on the last day within the month|
|x,y,z|any|Fire on any matching expression; can combine any number of any of the above expressions|

note: The first weekday is always **Monday**.

Examples:

*Schedules notifier to be run on the third Friday of June, July, August, November and December at 00:00, 01:00, 02:00 and 03:00*

> ```
> "cron": { 
>         "month": "6-8,11-12", 
>         "day": "3rd fri", 
>         "hour": "0-3"
>         }
> ```
 
*Schedules notifier every hour with an extra-delay picked randomly in a [-120,+120] seconds window.*
> ```
> "cron": {
>          "hour": "*"
>          "jitter": "120"
>         }
> ```
 
See [full apscheduler docs](http://apscheduler.readthedocs.io/en/latest/modules/triggers/cron.html)

## DB Dropins

| Field | Description|Default|
|---|---|---|


### Command Line Parsing
A command line consists of the following parts:


>**cmd** **object** **modifier** [modifier_args] [inputs] [=targets] [^start] [$end] [|formatter]

The cmd, object and modifier are required components, which define the dropin which will be run to satisfy the request.

Optional components are

* **modifier_args** are a series of arguments preceded with a '-' which is used to specify the specific option within the dropin definition to run.
* **inputs** are bareword arguments to be processed. These are provided to the dropin processor for SQL format argument replacement
* **targets** define the environments to be run again. Default is the prod environment, which runs the command against p801
* **start** is a timestamp argument for use in queries or commands that want to override the default timestamp of 24 hours ago.
* **end** is a timestamp argument for use in queries or commands that want to override the default timestamp the current time
* **formatter** allow for alternative output formats, i.e. csv to produce the output as a csv attachment, rather than direct output

Special handling allows for the inputs to specify a group, which is a list of merchant UUIDs associated with a simple name, which is provided as a list of UUIDs.

	Note: There is a special argument pattern, ***-XX:OPTION***, which is used to 
	enable certain internal features across all commands. Currently supported options are
	
	* **DUMPSQL** - output the generate SQL prior to execution 

### SQL parameter substitution
The list of inputs are provided to inject as parameters to the SQL constituting the dropin
Looper

### Target Environments
Target environments are defined using a '=', i.e.

 ``command =prod,dev1``

Current supported target environments are

* **prod** - run against the p801 prod replica (default if none specified)

#### Output Formats
Output formats are specified on the command line using the '|' character, i.e.

	command |csv,pdf

Current supported formats are

* **csv** - output the format as a comma separated file attached to the response message.
* **tsv** - output the format as a tab separated file, with tab attached to the response message.
* **md** - output the format as a markdown file attached to the response message.
* **pdf** - output the format as a pdf file attached to the response message.


#### Datetime modifiers
A dropin can specify that it requires a starting timestamp and optionally an ending timestamp. These will be autogenerated if not provided on the command line with the default start of NOW()-24 hours, and end of NOW().
 
To specify an alternate starting datetime, use the command line option '^'. To specify an alternate ending datetime, use the command line option '$'

```
requires_start_time
requires_end_time
```

bot-lib uses the [dateparser](https://github.com/scrapinghub/dateparser) library which allows some very flexible options when specifying these options. Note, you should quote the arguments if there are embedded spaces so that they are parsed correctly, i.e.


	command ^'3 days ago at noon' $'now - 24 hours'
