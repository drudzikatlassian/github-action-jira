FROM node:10-alpine

LABEL "name"="Jira Login"
LABEL "maintainer"="Dima Rudzik <githubactions+drudzik@atlassian.net>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="Jira Login"
LABEL "com.github.actions.description"="Log in to Jira Cloud instance"
LABEL "com.github.actions.icon"="log-in"
LABEL "com.github.actions.color"="blue"

RUN apk update && apk add ca-certificates wget && rm -rf /var/cache/apk/*
RUN update-ca-certificates
RUN wget https://github.com/drudzikatlassian/github-action-jira/raw/add-gasv3/gagas -O /gagas

COPY package*.json ./
RUN npm i
COPY . .
RUN chmod +x /entrypoint.sh
RUN chmod +x /gagas

ENTRYPOINT ["/entrypoint.sh"]