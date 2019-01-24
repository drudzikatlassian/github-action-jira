workflow "New workflow" {
  on = "push"
  resolves = ["View issue INC-4"]
}

action "View issue INC-3" {
  uses = "./"
  secrets = [
    "JIRA_API_TOKEN",
    "JIRA_USER_EMAIL",
    "JIRA_BASE_URL",
  ]
  args = "view INC-3"
}

action "View issue INC-4" {
  uses = "./"
  needs = ["View issue INC-3"]
  args = "view INC-4"
  secrets = ["JIRA_API_TOKEN", "JIRA_BASE_URL", "JIRA_USER_EMAIL"]
}
