workflow "Build - Test - Publish" {
  on = "push"
  resolves = [
    "Jira Login",
    "Jira Find",
  ]
}

action "Jira Login" {
  uses = "./actions/login"
  secrets = ["JIRA_API_TOKEN", "JIRA_BASE_URL", "JIRA_USER_EMAIL"]
}

action "Jira Create" {
  uses = "./actions/create"
  needs = ["Jira Login"]
  args = "--project=INC --issuetype=Incident --summary=\"Build completed for $GITHUB_REPOSITORY\" --description=\"This is description\" --fields.customfield_10021.id=10001"
}

action "Jira CLI comment" {
  uses = "./actions/cli"
  needs = ["Jira Create"]
  args = "comment --noedit --comment=\"Everything is awesome in $GITHUB_REPOSITORY\""
}

action "Jira Transition" {
  uses = "./actions/transition"
  needs = ["Jira CLI comment"]
  args = "-t 21"
}

action "Jira Find" {
  uses = "./actions/find"
  needs = ["Jira Transition"]
  args = "--string=\"INC-3\""
}
