#!/bin/sh
set -eu

sh -c "node /index.js $*"

containerId=`echo $GITHUB_REPOSITORY | shasum -a 256 | cut -c1-65`
./gagas --containerId="$containerId" --actionSubjectId="find-issue-key"