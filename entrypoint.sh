#!/bin/sh
set -eu

echo $GITHUB_ACTOR
echo $GITHUB_REPOSITORY

sh -c "/jira-linux-amd64 $*"