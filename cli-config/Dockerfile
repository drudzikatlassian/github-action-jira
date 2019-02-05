FROM ubuntu

LABEL "name"="Jira CLI Config action"
LABEL "maintainer"="Dima Rudzik <githubactions+drudzik@atlassian.net>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="Jira Cloud CLI Config"
LABEL "com.github.actions.description"="Write config parameters"
LABEL "com.github.actions.icon"="log-in"
LABEL "com.github.actions.color"="blue"

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]