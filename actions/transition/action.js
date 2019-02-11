const Jira = require('./common/net/Jira')

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
    console.log(`argv:${JSON.stringify(this.argv, null, 4)}`)
    console.log(`process.argv:${JSON.stringify(process.argv, null, 4)}`)
    const { argv } = this

    const issueId = argv.issue
    const transitionId = argv.transition

    const { transitions } = await this.Jira.getIssueTransitions(issueId)

    console.log(`transitions: ${JSON.stringify(transitions, null, 4)}`)

    console.log('Possible transitions flags:')
    transitions.forEach((t) => {
      console.log(`-t ${t.id} : '${t.name}' transitions to '${t.to.name}'`)
    })

    await this.Jira.transitionIssue(issueId, { transition: {
      id: transitionId,
    } })

    const transitionedIssue = await this.Jira.getIssue(issueId)

    console.log(`Transitioned Issue ${issueId}: ${JSON.stringify(transitionedIssue, null, 4)}`)

    return {}
  }

  async transitionTo (issueKey, transitionId) {
    const url = `${this.config.baseUrl}/rest/api/3/issue/${issueKey}/transitions`
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transition: {
          id: transitionId,
        },
      }),
    })

    return result
  }

  async getTransitions (issueKey) {
    const url = `${this.config.baseUrl}/rest/api/2/issue/${issueKey}/transitions`
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.auth,
        'Content-Type': 'application/json',
      },
    })

    return (await result.json()).transitions
  }
}
