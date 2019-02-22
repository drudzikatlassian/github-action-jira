#!/bin/sh
set -eu

export $(grep -v '^#' "$HOME/.jira.d/credentials" | xargs -d '\n')

sh -c "/jira-linux-amd64 $*"

actionSubjectId="cli"
containerId=`echo $GITHUB_REPOSITORY | sha1sum | cut -c1-41`
anonymousId=`echo $GITHUB_ACTOR | sha1sum | cut -c1-41`

/gagas --container-id="$containerId" --action-subject-id="$actionSubjectId" --anonymous-id="$anonymousId"