workflow "Build - Test - Publish" {
  on = "push"
  resolves = [
    "Jira Cloud CLI",
    "Jira Cloud Create Issue",
    "Comment issue",
    "Jira Cloud Login",
  ]
}

action "Jira Cloud Login" {
  uses = "./actions/login"
  secrets = ["JIRA_API_TOKEN", "JIRA_BASE_URL", "JIRA_USER_EMAIL"]
}

action "Jira Cloud CLI" {
  uses = "./actions/cli"
  needs = ["Jira Cloud Login"]
  args = "createmeta --project=INC --issuetype=Incident"
}

action "Jira Cloud Create Issue" {
  uses = "./actions/create"
  needs = ["Jira Cloud CLI"]
  args = "--project=INC --issuetype=Incident --summary=\"Build completed for $GITHUB_REPOSITORY\" --description=\"This is description\" --fields.customfield_10021.id=10001"
}

action "Comment issue" {
  uses = "./actions/cli"
  needs = ["Jira Cloud Create Issue"]
  args = "comment --noedit --comment=\"Everything is awesome in $GITHUB_REPOSITORY\""
}
