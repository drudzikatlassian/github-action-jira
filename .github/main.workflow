workflow "Build - Test - Publish" {
  on = "push"
  resolves = [
    "Add comment",
    "Select Jira Issue From",
    "View issue",
    "GitHub action for Jira Cloud",
  ]
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

action "Select Jira Issue From" {
  uses = "./select-issue-from"
  needs = ["Jira Cloud Login"]
  args = "--event=ref"
}

action "Add comment" {
  uses = "./cli"
  needs = ["Select Jira Issue From"]
  args = "comment --noedit --comment=\"test comment\""
}

action "View issue" {
  uses = "./cli"
  needs = ["Add comment"]
  args = "view INC-3"
}

action "GitHub action for Jira Cloud" {
  uses = "./cli"
  needs = ["Jira Cloud Login"]
  args = "create"
}
