const _ = require('lodash')
const arg = process.argv[2]
console.log('args here:' + arg)
const githubEvent = require(process.env['GITHUB_EVENT_PATH'])
console.log(`GithubEvent: ${JSON.stringify(githubEvent, null, 4)}`)
console.log(`Extracting string '${arg}' from event: ${_.get(githubEvent, arg)}`)