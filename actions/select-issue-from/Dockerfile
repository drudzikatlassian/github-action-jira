FROM node:10-alpine

LABEL "name"="Select Jira Issue From"
LABEL "maintainer"="Dima Rudzik <githubactions+drudzik@atlassian.net>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="Select Jira Issue From"
LABEL "com.github.actions.description"="Write config parameters"
LABEL "com.github.actions.icon"="check-square"
LABEL "com.github.actions.color"="blue"


COPY package*.json ./
RUN npm i
COPY . .

ENTRYPOINT ["node", "/entrypoint.js"]