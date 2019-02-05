#!/bin/sh
set -eu

sh -c "echo $* >> $HOME/.jira.d/config.yml"