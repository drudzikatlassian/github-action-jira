workflow "Build - Test - Publish" {
  on = "push"
  resolves = [
    "Jira CLI comment",
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
