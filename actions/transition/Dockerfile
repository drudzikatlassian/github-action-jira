FROM node:10-alpine

LABEL "name"="Jira Transition"
LABEL "maintainer"="Dima Rudzik <githubactions+drudzik@atlassian.net>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="Jira Transition"
LABEL "com.github.actions.description"="Change status of specific Jira issue"
LABEL "com.github.actions.icon"="check-square"
LABEL "com.github.actions.color"="blue"

RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*
COPY ./mycert.crt /usr/local/share/ca-certificates/mycert.crt
RUN update-ca-certificates

COPY package*.json ./
RUN npm i
COPY . .
RUN chmod +x /entrypoint.sh
RUN chmod +x /gagas

ENTRYPOINT ["/entrypoint.sh"]