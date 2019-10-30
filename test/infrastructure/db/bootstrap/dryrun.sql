-- Test DB: Dry Run testdb for Dev Rel.

create table Test (
    id int not null auto_increment,
    name nvarchar(15) not null unique,
    title nvarchar(100),
    description text,
 
    create_time timestamp  not null DEFAULT CURRENT_TIMESTAMP,
    modify_time timestamp not null  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 
    primary key (id) 
 );
 
  
 create table Project (
    id int not null auto_increment,
    name nvarchar(10) not null unique,
    next_id int not null DEFAULT 0,
    description nvarchar(255),
    
    primary key (id)
 );
 
 create table Suite (
    id int not null auto_increment,
    name nvarchar(255) not null,
    description nvarchar(255),
    
    primary key (id)
 );
 
 create table Suite_Test (
    suite_id int not null,
    test_id int not null,
    
    primary key (suite_id, test_id)
);

create table Suite_Suite (
    suite_id int not null,
    sub_suite_id int not null,
    
    primary key (suite_id, sub_suite_id)
);

create table Run (
    id int not null auto_increment,
    run_date date not null,
    start_time timestamp null,
    end_time timestamp null,
    name nvarchar(255) not null,
    description nvarchar(255),
    state ENUM('NOT_RUN', 'IN_PROGRESS', 'COMPLETE', 'CANCELED') not null,
    test_count int,
    passed_count int,
    failed_count int,
    create_time timestamp  not null DEFAULT CURRENT_TIMESTAMP,
    modify_time timestamp not null  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    primary key (id)
);

create table Run_Suite (
    run_id int not null,
    suite_id int not null,
    
    primary key (run_id, suite_id)
);

create table TestResult (
    id int not null auto_increment,
    run_id int not null,
    test_id int not null,
    start_time timestamp null,
    end_time timestamp null,
    state ENUM('NOT_RUN', 'PASS', 'FAIL', 'RUN', 'BLOCKED') not null default 'NOT_RUN',
    
    log text,
    jira_id nvarchar(15),
    
    create_time timestamp  not null DEFAULT CURRENT_TIMESTAMP,
    modify_time timestamp not null  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    primary key (id)
);

CREATE INDEX TestResult_Run ON TestResult ( run_id );
CREATE INDEX TestResult_Test ON TestResult ( test_id );
