workflow "Build - Test - Publish" {
  on = "push"
  resolves = [
    "Jira Login",
    "Jira Find",
    "Test 'Jira Create'",
  ]
}

action "Test 'Jira Create'" {
  uses = "./actions/create"
  runs = "/test.sh"
}

action "Jira Login" {
  uses = "./actions/login"
  needs = ["Test 'Jira Create'"]
  secrets = ["JIRA_API_TOKEN", "JIRA_BASE_URL", "JIRA_USER_EMAIL"]
}

action "Jira Create" {
  uses = "./actions/create"
  needs = ["Jira Login"]
  args = "--project=INC --issuetype=Incident --summary=\"Build completed for $GITHUB_REPOSITORY\" --description=\"This is description\" --fields.customfield_10021.id=10001"
}

action "Jira Comment" {
  uses = "./actions/comment"
  needs = ["Jira Create"]
  args = "\"Everything is awesome in $GITHUB_REPOSITORY in branch: {{ event.ref }}\""
}

action "Jira Transition" {
  uses = "./actions/transition"
  needs = ["Jira Comment"]
  args = "cancel"
}

action "Jira Find" {
  uses = "./actions/find"
  needs = ["Jira Transition"]
  args = "INC-4"
}
