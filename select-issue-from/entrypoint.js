const _ = require('lodash')
const fetch = require('node-fetch')
const fs = require('fs')

const configPath = process.env['HOME'] + '/.jira.d/config.yml'
const issueIdRegEx = /([a-zA-Z0-9]+-[0-9]+)/g
const jiraBaseUrl = process.env['JIRA_BASE_URL']
const jiraApiToken = process.env['JIRA_API_TOKEN']
const jiraUserEmail = process.env['JIRA_USER_EMAIL']

async function getIssueKey (args, githubEvent) {
  function getExtractString() {
    if (args.event) {
      return _.get(githubEvent, args.event)
    }
    return ''
  }

  const extractString = getExtractString()
  const match = extractString.match(issueIdRegEx)

  for (issueKey of match) {
    console.log(`Checking existance of ${issueKey} at ${jiraBaseUrl}`)
    const issueExists = await checkIssueExistance(issueKey, jiraBaseUrl, jiraApiToken, jiraUserEmail)
    if (issueExists) {
      console.log(`Detected issueKey: ${issueKey} in string ${extractString}`)
      return issueKey
    }
  }
}

async function checkIssueExistance(issueId, baseUrl, token, email) {
  const auth = 'Basic ' + Buffer.from(email + ':' + token).toString('base64');
  const url = `${baseUrl}/rest/api/3/issue/${issueId}`
  const result = await fetch(url, { 
    method: 'GET',
    headers: {
      Authorization: auth
    }
  })
  return result.ok
}

async function exec() {
  const issueKey = await getIssueKey(
    require('minimist')(process.argv.slice(2)), 
    require(process.env['GITHUB_EVENT_PATH'])
  )
  if (issueKey) {
    console.log(`Saving ${issueKey} to ${configPath}`)
    return fs.appendFileSync(configPath, `issue: ${issueKey}`)
  }
}

if (!module.parent) {
  exec()
}



module.exports = {
  getIssueKey
}

