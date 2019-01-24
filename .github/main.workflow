workflow "New workflow" {
  resolves = ["GitHub action for Jira"]
  on = "push"
}

action "GitHub action for Jira" {
  uses = "./"
  secrets = [
    "JIRA_API_TOKEN",
    "JIRA_USER_EMAIL",
  ]
  args = "--endpoint=https://rudzon.atlassian.net view INC-3"
}
