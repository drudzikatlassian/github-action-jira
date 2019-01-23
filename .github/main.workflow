workflow "New workflow" {
  resolves = ["GitHub action for Jira"]
  on = "commit_comment"
}

action "GitHub action for Jira" {
  uses = "./"
  secrets = ["JIRA_API_TOKEN"]
  args = "--endpoint=https://rudzon.atlassian.net --verbose view INC-3"
}
