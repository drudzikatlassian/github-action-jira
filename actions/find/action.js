const _ = require('lodash')
const Jira = require('./common/net/Jira')

const issueIdRegEx = /([a-zA-Z0-9]+-[0-9]+)/g

module.exports = class {

  constructor ({ githubEvent, args, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute() {
    const extractString = this.getExtractString()

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

    return
  }

  getExtractString() {
    if (this.args.event) {
      console.log(`Extracting from github event file, path:'${this.args.event}'`)
      return _.get(this.githubEvent, this.args.event)
    }

    if (this.args.string) {
      return this.args.string
    }
  
    return ''
  }
}