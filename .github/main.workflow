workflow "End to End test" {
  on = "push"
  resolves = ["GitHub action for Jira Cloud"]
}

action "Jira Cloud Login" {
  uses = "drudzikatlassian/github-action-jira/login@master"
  secrets = ["JIRA_API_TOKEN", "JIRA_BASE_URL", "JIRA_USER_EMAIL"]
}

action "GitHub action for Jira Cloud" {
  uses = "drudzikatlassian/github-action-jira/cli@master"
  needs = ["Jira Cloud Login"]
  args = "comment --noedit --comment=\"$GITHUB_ACTOR pushed to $GITHUB_REPOSITORY\" INC-3"
}
