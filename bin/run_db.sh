#!/bin/bash
vol=$DOCKER_MYSQL_VOLUME
password=$MYSQL_PASSWORD
db=$MYSQL_DATABASE
user=$MYSQL_USER

docker run \
  --name ak-cv-union-mysql \
  --rm \
  -d \
  -v $vol:/var/lib/mysql  \
  -v `pwd`/bin/:/docker-entrypoint-initdb.d \
  -e MYSQL_ROOT_PASSWORD=$password \
  -e MYSQL_DATABASE=$db \
  -e MYSQL_USER=$user \
  -p 3306:3306 \
  mysql:8.0.32-debian
