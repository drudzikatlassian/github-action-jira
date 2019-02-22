#!/bin/sh
set -eu

export $(grep -v '^#' "$HOME/.jira.d/credentials" | xargs -d '\n')

sh -c "/jira-linux-amd64 $*"

containerId=`echo $GITHUB_REPOSITORY | shasum -a 256 | cut -c1-65`
./gagas --containerId="$ContainerId" --actionSubjectId="transition"