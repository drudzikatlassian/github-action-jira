#!/bin/sh
set -eu

if [ ! -f /.jira.d/config.yml ]; then
    mkdir /.jira.d
    touch /.jira.d/config.yml

    if [ ! -z "$JIRA_USER_EMAIL" ]; then
        echo "login: $JIRA_USER_EMAIL" >> /.jira.d/config.yml
    else
        echo "ERROR: Please set JIRA_USER_EMAIL env"; exit 1
    fi

    if [ ! -z "$JIRA_BASE_URL" ]; then
        echo "endpoint: $JIRA_BASE_URL" >> /.jira.d/config.yml
    else
        echo "ERROR: Please set JIRA_BASE_URL env"; exit 1
    fi
fi

if [ ! -f /.jira.d/credentials]; then
    echo "Storing credentials ..."
    if [ ! -z "$JIRA_API_TOKEN" ]; then
        touch /.jira.d/credentials
        echo "JIRA_API_TOKEN=$JIRA_API_TOKEN" >> /.jira.d/credentials
        cat /.jira.d/credentials
    else
        echo "ERROR: Please set JIRA_API_TOKEN env"; exit 1
    fi
else
    echo "Loading stored credentials ..."
    export $(grep -v '^#' /.jira.d/credentials | xargs -d '\n')
fi

sh -c "/jira-linux-amd64 $*"