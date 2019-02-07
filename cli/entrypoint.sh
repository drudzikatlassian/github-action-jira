#!/bin/sh
set -eu

export $(grep -v '^#' "$HOME/.jira.d/credentials" | xargs -d '\n')

ls -la "$GITHUB_WORKSPACE"

sh -c "/jira-linux-amd64 $*"