FROM ubuntu

LABEL "name"="Select Jira Issue From"
LABEL "maintainer"="Dima Rudzik <githubactions+drudzik@atlassian.net>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="Select Jira Issue From"
LABEL "com.github.actions.description"="Write config parameters"
LABEL "com.github.actions.icon"="log-in"
LABEL "com.github.actions.color"="blue"

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]