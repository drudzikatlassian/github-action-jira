# Jira Comment
Add a comment to an issue

To add comment to an issue you need to specify an issue key and a comment in action args, like:

`"Hello from GitHub actions" --issue=INC-2`

### Environment variables
- None

### Arguments
- `--issue` - An issue key to add a comment for

### Reads fields from config file at $HOME/jira/config.yml
- `issue`

### Writes fields to config file at $HOME/jira/config.yml
- None