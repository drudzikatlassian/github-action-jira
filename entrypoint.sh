#!/bin/sh
set -eu

mkdir .jira.d
echo "login: '$JIRA_USER_EMAIL'" > .jira.d/config.yml

sh -c "/jira-linux-amd64 $*"