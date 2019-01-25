#!/bin/sh
set -eu
CONFIG_FOLDER_PATH = $HOME/.jira.d
CONFIG_PATH = $CONFIG_FOLDER_PATH/config.yml
CREDENTIALS_PATH = $CONFIG_FOLDER_PATH/credentials

if [ ! -f $CONFIG_PATH ]; then
    mkdir $CONFIG_FOLDER_PATH
    touch $CONFIG_PATH

    if [ -z $JIRA_USER_EMAIL ]; then
        echo "ERROR: Please set JIRA_USER_EMAIL env"; exit 1
    else
        echo "login: $JIRA_USER_EMAIL" >> $CONFIG_PATH
    fi

    if [ -z $JIRA_BASE_URL ]; then
        echo "ERROR: Please set JIRA_BASE_URL env"; exit 1
    else
       echo "endpoint: $JIRA_BASE_URL" >> $CONFIG_PATH
    fi
fi

if [ -f $CREDENTIALS_PATH ]; then
    export $(grep -v '^#' $CREDENTIALS_PATH | xargs -d '\n')
else
    if [ -z $JIRA_API_TOKEN ]; then
        echo "ERROR: Please set JIRA_API_TOKEN env"; exit 1
    else
        touch $CREDENTIALS_PATH
        echo "JIRA_API_TOKEN=$JIRA_API_TOKEN" >> $CREDENTIALS_PATH
    fi
fi

sh -c "/jira-linux-amd64 $*"