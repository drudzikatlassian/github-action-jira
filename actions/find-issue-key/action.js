const _ = require('lodash')
const Jira = require('./common/net/Jira')

const issueIdRegEx = /([a-zA-Z0-9]+-[0-9]+)/g

module.exports = class {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute () {
    const extractString = this.preprocessString(this.argv._.join(' '))

    const match = extractString.match(issueIdRegEx)

    if (!match) {
      console.log(`String "${extractString}" does not contain issueKeys`)

      return
    }

    for (const issueKey of match) {
      const issue = await this.Jira.getIssue(issueKey)

      if (issue) {
        return { issue: issue.key }
      }
    }
  }

  preprocessString (str) {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const tmpl = _.template(str)

    return tmpl({ event: this.githubEvent })
  }
}
