# Jira Find
Extract issue key from string

## Usage

TBD

----
## Action Spec:

### Environment variables
- None

### Arguments
- `--event=<jsonpath>` - Specify a `jsonpath` of the GitHub event to get a string to extract an issue key from
- `--string=<text>` - Use specified string to extract issue key from

### Reads fields from config file at $HOME/jira/config.yml
- `event`
- `string`

### Writes fields to config file at $HOME/jira/config.yml
- `issue` - a key of a found issue

### Writes fields to CLI config file at $HOME/.jira.d/config.yml
- `issue` - a key of a found issue
