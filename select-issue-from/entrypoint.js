const _ = require('lodash')
const argv = require('minimist')(process.argv.slice(2))
const githubEvent = require(process.env['GITHUB_EVENT_PATH'])
const issueIdRegEx = /([a-zA-Z0-9]+-[0-9]+)/
function getExtractString(args) {
  if (args.event) {
    return _.get(githubEvent, args.event)
  }

  return ''
}

console.log(`GithubEvent: ${JSON.stringify(githubEvent, null, 4)}`)

const extractString = getExtractString(argv)
console.log(`Extracting from string '${extractString}'`)
const match = extractString.match(issueIdRegEx)
console.log('match:', match)