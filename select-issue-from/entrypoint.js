const _ = require('lodash')
const arg = process.argv[3]
console.log('args here:' + arg)
const githubEvent = require(process.env['GITHUB_EVENT_PATH'])
console.log(`Extracting string '${arg}' from event: ${_.get(githubEvent, arg)}`)