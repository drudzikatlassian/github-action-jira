# Jira Transition
Transition Jira issue

## Environment variables
- None

## Arguments
- `<transition name>` - A name of transition to apply. Example: `Cancel` or `Accept`
- `--issue=<KEY-NUMBER>` - issue key to perform a transition on
- `--id=<transition id>` - transition id to apply to an issue

## Reads fields from config file at $HOME/jira/config.yml
- `issue`
- `transition`

## Writes fields to config file at $HOME/jira/config.yml
- None