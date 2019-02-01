workflow "Build and Publish" {
  on = "push"
  resolves = "Publish"
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

action "Docker Login" {
  needs = ["Publish Filter"]
  uses = "actions/docker/login@master"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Publish" {
  needs = ["Docker Login"]
  uses = "actions/action-builder/docker@master"
  runs = "make"
  args = "publish"
}

workflow "Test" {
  on = "push"
  resolves = ["GitHub action for Jira Cloud"]
}

action "Jira Cloud Login" {
  uses = "./login"
  secrets = ["JIRA_API_TOKEN", "JIRA_BASE_URL", "JIRA_USER_EMAIL"]
}

action "GitHub action for Jira Cloud" {
  uses = "./cli"
  needs = ["Jira Cloud Login"]
  args = "view INC-3"
}
