workflow "New workflow" {
  resolves = ["GitHub action for Jira"]
  on = "push"
}

action "GitHub action for Jira" {
  uses = "./"
  secrets = [
    "JIRA_API_TOKEN",
    "JIRA_USER_EMAIL",
    "JIRA_BASE_URL",
  ]
  args = "view INC-3"
}
