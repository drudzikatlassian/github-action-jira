# Jira Comment
Add a comment to an issue

To add comment to an issue you need to specify an issue key and a comment in action args, like:

`--issue=INC-2 --comment="Hello from GitHub actions"`

### Environment variables
- None

### Arguments
- `--issue` - An issue key to add a comment for
- `--comment` - A comment body

### Reads fields from config file at $HOME/jira/config.yml
- `issue`
- `comment`

### Writes fields to config file at $HOME/jira/config.yml
- None