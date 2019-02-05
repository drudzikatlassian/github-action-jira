const _ = require('lodash')
console.log('args here:' + process.argv[0])
const githubEvent = require(process.env['GITHUB_EVENT_PATH'])
console.log(`Extracting string '${process.argv[0]}' from event: ${_.get(githubEvent, process.argv[0])}`)