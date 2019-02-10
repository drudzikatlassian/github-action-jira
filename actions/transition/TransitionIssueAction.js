const fetch = require('node-fetch')
const _ = require('lodash')

module.exports = class TransitionIssueAction {

  constructor ({ githubEvent, argv, config }) {
    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
    this.auth = 'Basic ' + Buffer.from(this.config.email + ':' + this.config.token).toString('base64')
  }

  async execute() {
    console.log(`argv:${JSON.stringify(this.argv, null, 4)}`)
    console.log('process.argv:' + JSON.stringify(process.argv, null, 4))
    const argv = this.argv

    const transitions = await this.getTransitions(argv.issue)
    console.log(`transitions: ${JSON.stringify(transitions, null, 4)}`)

    transitions.forEach(t => {
      console.log('Possible transitions flags:')
      console.log(`-f ${t.to.id} transitions to ${t.to.name}`)
    })

    return
  }

  async getTransitions(issueKey) {
    const url = `${this.config.baseUrl}/rest/api/2/issue/${issueKey}/transitions`
    const result = await fetch(url, { 
      method: 'GET',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      }
    })

    return (await result.json()).transitions
  }
  
}