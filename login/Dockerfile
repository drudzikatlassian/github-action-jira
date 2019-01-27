FROM alpine

LABEL "name"="Jira Login Action"
LABEL "maintainer"="Dima Rudzik <githubactions+drudzik@atlassian.net>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="Jira Cloud Login"
LABEL "com.github.actions.description"="This is an Action to log into Jira."
LABEL "com.github.actions.icon"="log-in"
LABEL "com.github.actions.color"="blue"

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]