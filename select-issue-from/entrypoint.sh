#!/bin/sh
set -eu

echo "$*"
cat "$GITHUB_EVENT_PATH"