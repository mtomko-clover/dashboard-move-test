create table Job (
    id int not null auto_increment,
    uuid varchar(32) not null unique,
    title nvarchar(255) not null unique,
    text_key int,
    description nvarchar(1024),
    version int not null default 1,
    
    engine int not null,
    server nvarchar(1024),
    path nvarchar(1024),
    name nvarchar(1024),
    action nvarchar(1024),
    modifier nvarchar(1024),

    engine_config nvarchar(1024),    
    
    owner nvarchar(100),
    team nvarchar(100),
    
    active bool not null default 1,
    atomic bool not null default 0,
    
    create_time timestamp not null default CURRENT_TIMESTAMP,
    modify_time timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    
    primary key (id)
);


create table Engine (
    id int not null auto_increment,
    name nvarchar(25),
    description nvarchar(255),
    tag varchar(25) unique,
    
    server_text_key int,
    path_text_key int,
    name_text_key int,
    action_text_key int,
    modifier_text_key int,

    config_template nvarchar(1024),
    static_config nvarchar(1024),
    
    create_time timestamp not null default CURRENT_TIMESTAMP,
    modify_time timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    
    primary key (id)
);


create table JobParameter (
    id int not null auto_increment,
    name nvarchar(25),
    text_key int,
    
    param_name nvarchar(50),
    
    datatype int not null,
    datatype_options nvarchar(1024),
    
    default_value nvarchar(1024),
    
    required bool not null default 1,
    validation_rule nvarchar(1024),
    validation_rule_param nvarchar(1024),
    
    create_time timestamp not null default CURRENT_TIMESTAMP,
    modify_time timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    
    primary key (id)
);

create table JobQueue (
    id int not null auto_increment,
    uuid varchar(13) not null unique,
    job_uuid varchar(13) not null,
    job_schedule_uuid varchar(13),
    user nvarchar(50),
  
    priority int not null default 100,
    queue_affinity int,
    
    status ENUM('QUEUED', 'DISPATCHING', 'STARTED', 'COMPLETE') not null default 'QUEUED',
    result ENUM('NOT_RUN', 'RUN', 'SUCCCESS', 'FAIL', 'CANCELED') not null default 'NOT_RUN',
    message nvarchar(10240),
  
    create_time timestamp not null default CURRENT_TIMESTAMP,
    dispatch_time timestamp null,
    start_time timestamp null,
    complete_time timestamp null,
    modify_time timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    
    primary key (id)
);

create table JobQueueParameters (
    id int not null auto_increment,
    job_id int not null,
    job_parameter_id int not null,
    value nvarchar(10240),
    
    primary key (id)
);
create index JobQueueParameters_JobId on JobQueueParameters (job_id);

create table JobDbChangeAuditTable (
    id int not null auto_increment,
    table_name varchar(50) not null,
    column_name varchar(50) null,
    row_id int null,
    action varchar(50) not null,
    message nvarchar(1024),
    create_time timestamp not null default CURRENT_TIMESTAMP,
    
    primary key (id)
);

create table JobErrorTable (
    id int not null auto_increment,
    job_id int not null,
    job_queue_id int not null,
    
    error_level ENUM ('CRITICAL', 'ERROR', 'WARN', 'INFO', 'DETAIL'),
    source nvarchar(100),
    message text,
    
    flagged ENUM('NONE', 'MANUAL', 'AUTO', 'RESOLVED'),
    notes text,
    user nvarchar(50),
    jira nvarchar(15),
    
    create_time timestamp not null default CURRENT_TIMESTAMP,
    modify_time timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,

    primary key (id)
);
create index JobErrorTable_JobId on JobErrorTable (job_id);
create index JobErrorTable_Flagged on JobErrorTable (flagged);

create table Schedule (
    id int not null auto_increment,
    uuid varchar(13) not null,
    
    name nvarchar(50) not null,
    text_key int,
    
    schedule varchar(1024) not null,
    
    create_time timestamp not null default CURRENT_TIMESTAMP,
    modify_time timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    
    primary key (id)
);

create table JobSchedule (
    id int not null auto_increment,
    uuid varchar(13) not null,
    
    name nvarchar(50) not null,
    text_key int,
    
    job_id int not null,
    schedule_id int not null,
 
    owner nvarchar(100),
    team nvarchar(100),
    
    active bool not null default 1,
    atomic bool not null default 0,
    
    priority int not null default 100,
    queue_affinity int not null default 0,
    
    create_time timestamp not null default CURRENT_TIMESTAMP,
    modify_time timestamp not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
    
    primary key (id)
);
create index JobSchedule_JobId on JobSchedule (job_id);

create table JobScheduleParameters (
    id int not null auto_increment,
    job_schedule_id int not null,
    job_id int not null,
    job_parameter_id int not null,
    value nvarchar(10240),
    
    primary key (id)
);
create index JobScheduleParameters_JobId on JobScheduleParameters (job_id);