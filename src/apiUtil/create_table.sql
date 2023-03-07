create table if not exists arknights (id integer primary key autoincrement, chara text unique, chara_read text default null, cv_name text, cv_name_read text);
create table if not exists bluearchive (id integer primary key autoincrement, chara text unique, chara_read text default null, cv_name text, cv_name_read text);
create table if not exists imas_cinderella (id integer primary key autoincrement, chara text unique, chara_read text default null, cv_name text, cv_name_read text);
create index if not exists arknights_cv_index on arknights(cv_name);
create index if not exists bluearchive_cv_index on bluearchive(cv_name);
create index if not exists imas_cinderella_cv_index on imas_cinderella(cv_name);
