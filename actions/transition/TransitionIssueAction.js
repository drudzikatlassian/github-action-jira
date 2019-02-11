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

    console.log('Possible transitions flags:')
    transitions.forEach(t => {
      console.log(`-t ${t.id} : '${t.name}' transitions to '${t.to.name}'`)
    })

    const result = await this.transitionTo(argv.issue, argv.transition)

    const jsonRes = await result.json()
    console.log('jsonRes:' + JSON.stringify(jsonRes, null, 4))
    if (result.ok) {
      return {}
    }
    console.log('Failed to transition:' + result)

    return
  }

  async transitionTo(issueKey, transitionId) {
    const url = `${this.config.baseUrl}/rest/api/3/issue/${issueKey}/transitions`
    const result = await fetch(url, { 
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transition: {
          id: transitionId
        }
      })
    })
    return result
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