#!/bin/sh
set -eu

echo $GITHUB_ACTOR
echo $GITHUB_REPOSITORY
echo $JIRA_API_TOKEN

sh -c "/jira-linux-amd64 $*"