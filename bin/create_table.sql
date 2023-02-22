create table if not exists arknights (
  id int(32) unsigned auto_increment primary key,
  chara varchar(64) not null unique,
  chara_read varchar(64) default null,
  cv_name varchar(64) not null,
  cv_name_read varchar(64) not null
) character set utf8mb4 collate utf8mb4_unicode_ci;

create table if not exists bluearchive (
  id int(32) unsigned auto_increment primary key,
  chara varchar(64) not null unique,
  chara_read varchar(64) default null,
  cv_name varchar(64) not null,
  cv_name_read varchar(64) not null
) character set utf8mb4 collate utf8mb4_unicode_ci;

create table if not exists imas_cinderella (
  id int(32) unsigned auto_increment primary key,
  chara varchar(64) not null unique,
  chara_read varchar(64) default null,
  cv_name varchar(64) not null,
  cv_name_read varchar(64) not null
) character set utf8mb4 collate utf8mb4_unicode_ci;

create index if not exists arknights_cv_index on arknights(cv_name);
create index if not exists bluearchive_cv_index on bluearchive(cv_name);
create index if not exists imas_cinderella_cv_index on imas_cinderella(cv_name);
