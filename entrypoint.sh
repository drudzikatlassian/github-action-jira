#!/bin/sh
set -eu

mkdir ~/.jira.d
echo "login: '$JIRA_USER_EMAIL' \nauthentication-method: api-token" > ~/.jira.d/config.yml

cat ~/.jira.d/config.yml

sh -c "/jira-linux-amd64 $*"