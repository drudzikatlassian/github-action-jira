#!/bin/sh
set -eu

mkdir "$HOME/.jira.d"
touch "$HOME/.jira.d/config.yml"

mkdir "$HOME/jira"
touch "$HOME/jira/config.yml"

if [ -z "$JIRA_USER_EMAIL" ]; then
    echo "ERROR: Please set JIRA_USER_EMAIL env"; exit 1
else
    echo "login: $JIRA_USER_EMAIL" >> "$HOME/.jira.d/config.yml"
    echo "email: $JIRA_USER_EMAIL" >> "$HOME/jira/config.yml"
fi

if [ -z "$JIRA_BASE_URL" ]; then
    echo "ERROR: Please set JIRA_BASE_URL env"; exit 1
else
    echo "endpoint: $JIRA_BASE_URL" >> "$HOME/.jira.d/config.yml"
    echo "baseUrl: $JIRA_BASE_URL" >> "$HOME/jira/config.yml"
fi

if [ -z "$JIRA_API_TOKEN" ]; then
    echo "ERROR: Please set JIRA_API_TOKEN env"; exit 1
else
    touch "$HOME/.jira.d/credentials"
    echo "JIRA_API_TOKEN=$JIRA_API_TOKEN" >> "$HOME/.jira.d/credentials"
    echo "token: $JIRA_API_TOKEN" >> "$HOME/jira/config.yml"
fi