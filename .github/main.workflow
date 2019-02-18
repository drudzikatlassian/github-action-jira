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
  secrets = ["JIRA_API_TOKEN", "JIRA_USER_EMAIL", "JIRA_BASE_URL"]
}

action "Jira Create" {
  uses = "./actions/create"
  needs = ["Jira Login"]
  args = "--project=GA --issuetype=Task --summary=\"Build completed for $GITHUB_REPOSITORY\" --description=\"This is description\" "
}

action "Jira Comment" {
  uses = "./actions/comment"
  needs = ["Jira Create"]
  args = "\"Acceptance test for actions in $GITHUB_REPOSITORY in branch: {{ event.ref }}\""
}

action "Jira Transition" {
  uses = "./actions/transition"
  needs = ["Jira Comment"]
  args = "done"
}

action "Jira Find" {
  uses = "./actions/find"
  needs = ["Jira Transition"]
  args = "GA-1"
}
