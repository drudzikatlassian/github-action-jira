# GitHub Actions for Jira
The GitHub Actions for [Jira](https://www.atlassian.com/software/jira) wrapping [go-jira CLI](https://github.com/Netflix-Skunkworks/go-jira) to create and edit Jira issues

## Secrets
- `JIRA_BASE_URL` - URL of Jira instance. Example: `https://<yourdomain>.atlassian.net`
- `JIRA_API_TOKEN` - **Access Token** for Authorization. Example: `HXe8DGg1iJd2AopzyxkFB7F2` ([How To](https://confluence.atlassian.com/cloud/api-tokens-938839638.html))
- `JIRA_USER_EMAIL` - email of the user for which **Access Token** was created for . Example: `human@example.com`