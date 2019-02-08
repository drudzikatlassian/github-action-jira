const _ = require('lodash')
const fetch = require('node-fetch')
const fs = require('fs')

const issueIdRegEx = /([a-zA-Z0-9]+-[0-9]+)/g

module.exports = class SelectIssueFrom {

  constructor ({ githubEvent, args, config }) {
    this.config = config
    this.args = args
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
      const issueExists = await this.checkIssueExistance(issueKey)
      
      if (issueExists) {
        return { issue: issueKey }
      }
    }

    return
  }

  getExtractString() {
    if (this.args.event) {
      console.log(`Extracting from github event file, path:'${this.args.event}'`)
      return _.get(this.githubEvent, this.args.event)
    }
    return ''
  }

  async checkIssueExistance(issueId) {
    const auth = 'Basic ' + Buffer.from(this.config.email + ':' + this.config.token).toString('base64');
    const url = `${this.config.baseUrl}/rest/api/3/issue/${issueId}`
    const result = await fetch(url, { 
      method: 'GET',
      headers: {
        Authorization: auth
      }
    })
    
    console.log(`checkIssueExistance: ${issueId} at ${this.config.baseUrl} status: ${result.ok}`)

    return result.ok
  }
}