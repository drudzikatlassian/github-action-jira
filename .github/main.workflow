workflow "Build - Test - Publish" {
  on = "push"
  resolves = ["Jira Cloud Create Issue"]
}

action "Lint" {
  uses = "actions/action-builder/shell@master"
  runs = "make"
  args = "lint"
}

action "Build" {
  needs = ["Lint"]
  uses = "actions/action-builder/docker@master"
  runs = "make"
  args = "build"
}

action "Publish Filter" {
  needs = ["Build"]
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Jira Cloud Login" {
  uses = "./login"
  needs = ["Build"]
  secrets = ["JIRA_API_TOKEN", "JIRA_BASE_URL", "JIRA_USER_EMAIL"]
}

action "Jira Cloud CLI" {
  uses = "./cli"
  needs = ["Jira Cloud Login"]
  args = "createmeta --project=INC --issuetype=Incident"
}

action "Jira Cloud Create Issue" {
  uses = "./create-issue"
  needs = ["Jira Cloud CLI"]
  args = "--project=INC --issueType=Incident --summary=\"Build completed for $GITHUB_REPOSITORY\" --customfield_10021=10001"
}
