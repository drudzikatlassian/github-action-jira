# Login
Used to store credentials for later use in CLI action

## Consumes
### Enviroment variables
- `JIRA_BASE_URL` - URL of Jira instance. Example: `https://<yourdomain>.atlassian.net`
- `JIRA_API_TOKEN` - **Access Token** for Authorization. Example: `HXe8DGg1iJd2AopzyxkFB7F2` ([How To](https://confluence.atlassian.com/cloud/api-tokens-938839638.html))
- `JIRA_USER_EMAIL` - email of the user for which **Access Token** was created for . Example: `human@example.com`

## Produces
### Files
- `$HOME/.jira.d/credentials` - Credentials file for CLI action
- `$HOME/.jira.d/config.yml` - Config file for CLI action
- `$HOME/jira/config.yml` - Config file for actions