workflow "End to End test" {
  on = "push"
  resolves = ["Lint", "Publish"]
}

action "Lint" {
  uses = "actions/action-builder/shell@master"
  runs = "make"
  args = "lint"
}

action "Test" {
  uses = "actions/action-builder/shell@master"
  runs = "make"
  args = "test"
}

action "Build" {
  uses = "actions/action-builder/shell@master"
  needs = ["Test", "Lint"]
  runs = "make"
  args = "build"
}

action "Publish Filter" {
  uses = "actions/bin/filter@master"
  needs = ["Build"]
  args = "branch master"
}

action "Docker Login" {
  uses = "actions/docker/login@master"
  needs = ["Publish Filter"]
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Publish" {
  uses = "actions/action-builder/docker@master"
  needs = ["Docker Login"]
  runs = "make"
  args = "publish"
}
