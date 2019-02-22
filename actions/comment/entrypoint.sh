#!/bin/sh
set -eu

sh -c "node /index.js $*"

actionSubjectId="comment"
containerId=`echo $GITHUB_REPOSITORY | shasum -a 256 | cut -c1-65`
anonymousId=`echo $GITHUB_ACTOR | shasum -a 256 | cut -c1-65`

./gagas --container-id="$containerId" --action-subject-id="$actionSubjectId" --anonymous-id="$anonymousId"