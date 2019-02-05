const _ = require('lodash')
const argv = require('minimist')(process.argv.slice(2))
const githubEvent = require(process.env['GITHUB_EVENT_PATH'])

let extractString = ''
console.log(`GithubEvent: ${JSON.stringify(githubEvent, null, 4)}`)

if (argv.event) {
  extractString = _.get(githubEvent, argv.event)
}

console.log(`Extracting from string '${extractString}'`)