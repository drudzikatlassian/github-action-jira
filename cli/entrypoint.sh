#!/bin/sh
set -eu

export $(grep -v '^#' "$HOME/.jira.d/credentials" | xargs -d '\n')

cat "$HOME/.jira.d/config.yml"

sh -c "/jira-linux-amd64 $*"