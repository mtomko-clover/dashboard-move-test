create table Text (
    id int not null auto_increment,
    text_id int not null,
    language_id int not null,
    text nvarchar(10240) not null,
    short_text nvarchar(25),
    flags int not null default 0,
    
    create_time timestamp  not null DEFAULT CURRENT_TIMESTAMP,
    modify_time timestamp not null  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    primary key (id)
);

CREATE INDEX Text_Base_Id ON Text (text_id);
CREATE INDEX Text_Language ON Text (language_id);

create table Language (
    id int not null auto_increment,
    language nvarchar(10),
    fallback_id int not null default 1,
    title nvarchar(50),
    
    primary key (id)
);

-- 1 based, so first index will have id of 1. Insert en-US as root/fallback language
insert into Language (language, fallback_id, title) values ('en-US', 1, 'English (US)');
-- select * from Language;

create table Tool (
    id int not null auto_increment,
    tag nvarchar(25) unique not null,
    name nvarchar(50),
    description nvarchar(1024),
    
    primary key (id)
);

create table Tool_Text (
    tool_id int not null,
    text_id int not null,
    primary key (tool_id, text_id)
);
