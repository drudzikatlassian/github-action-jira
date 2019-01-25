workflow "New workflow" {
  on = "push"
  resolves = ["View issue INC-3"]
}

action "Comment issue INC-3" {
  uses = "./"
  secrets = [
    "JIRA_API_TOKEN",
    "JIRA_USER_EMAIL",
    "JIRA_BASE_URL",
  ]
  args = "comment --noedit --comment=\"$GITHUB_ACTOR pushed to $GITHUB_REPOSITORY\" INC-3"
}

action "View issue INC-3" {
  uses = "./"
  args = "view INC-3"
  needs = ["Comment issue INC-3"]
}
