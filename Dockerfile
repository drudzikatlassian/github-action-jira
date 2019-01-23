FROM ubuntu

LABEL "com.github.actions.name"="GitHub action for Jira"
LABEL "com.github.actions.description"="Wraps the Jira CLI to enable Jira commands."
LABEL "com.github.actions.icon"="check-square"
LABEL "com.github.actions.color"="blue"

LABEL "repository"="https://github.com/drudzikatlassian/github-action-jira"
LABEL "homepage"="http://github.com/actions"
LABEL "maintainer"="Dima Rudzik <drudzik@atlassian.net>"

RUN apt-get update && apt-get install -yq wget
RUN wget -q https://github.com/Netflix-Skunkworks/go-jira/releases/download/v1.0.20/jira-linux-amd64 \
    && chmod +x jira-linux-amd64

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]