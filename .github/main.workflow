workflow "Build - Test - Publish" {
  on = "push"
  resolves = [
    "Add comment",
    "actions/action-builder/docker@master",
    "Save Issue key",
    "Select Jira Issue From",
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

action "Save Issue key" {
  uses = "./cli-config"
  needs = ["Jira Cloud Login"]
  args = "issue: INC-3"
}

action "Add comment" {
  uses = "./cli"
  needs = ["Save Issue key"]
  args = "comment --noedit --comment=\"test comment\""
}

action "View issue" {
  uses = "./cli"
  needs = ["Add comment"]
  args = "view INC-3"
}

action "if branch is master" {
  uses = "actions/bin/filter@master"
  needs = ["View issue"]
  args = "branch master"
}

action "Docker Login" {
  uses = "actions/docker/login@master"
  needs = ["if branch is master"]
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "actions/action-builder/docker@master" {
  uses = "actions/action-builder/docker@master"
  runs = "make"
  args = "publish"
  needs = ["Docker Login"]
}

action "Select Jira Issue From" {
  uses = "./select-issue"
  needs = ["Jira Cloud Login"]
  args = "commit message"
}
