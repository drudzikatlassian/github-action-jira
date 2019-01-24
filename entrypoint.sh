#!/bin/sh
set -eu

sh -c "/jira-linux-amd64 $* --login='$JIRA_USER_EMAIL'"