const fetch = require('node-fetch')
const _ = require('lodash')

module.exports = class TransitionIssueAction {

  constructor ({ githubEvent, argv, config }) {
    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute() {
    console.log(`argv:${JSON.stringify(this.argv, null, 4)}`)
    console.log('process.argv:' + JSON.stringify(process.argv, null, 4))
    const argv = this.argv

    return
  }
}