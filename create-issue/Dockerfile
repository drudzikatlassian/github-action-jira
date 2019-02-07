FROM node:10-slim

LABEL "name"="Jira Cloud Create Issue"
LABEL "maintainer"="Dima Rudzik <githubactions+drudzik@atlassian.net>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="Jira Cloud Create Issue"
LABEL "com.github.actions.description"="Create Jira Issue"
LABEL "com.github.actions.icon"="check-square"
LABEL "com.github.actions.color"="blue"


COPY package*.json ./
RUN npm i
COPY . .

ENTRYPOINT ["node", "/entrypoint.js"]