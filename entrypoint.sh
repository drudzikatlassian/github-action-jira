#!/bin/sh
set -eu

mkdir .jira.d
echo "user: '$JIRA_USER_EMAIL'" > .jira.d/config.yml

sh -c "/jira-linux-amd64 $*"