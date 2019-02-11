const fetch = require('node-fetch')
const Jira = require('./Jira')

export default class TransitionIssueAction {
  constructor ({ githubEvent, argv, config }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
    this.auth = `Basic ${Buffer.from(`${this.config.email}:${this.config.token}`).toString('base64')}`
  }

  async execute () {
    console.log(`argv:${JSON.stringify(this.argv, null, 4)}`)
    console.log(`process.argv:${JSON.stringify(process.argv, null, 4)}`)
    const { argv } = this

    const transitions = await this.Jira.getTransitions(argv.issue)

    console.log(`transitions: ${JSON.stringify(transitions, null, 4)}`)

    console.log('Possible transitions flags:')
    transitions.forEach((t) => {
      console.log(`-t ${t.id} : '${t.name}' transitions to '${t.to.name}'`)
    })

    const transitionResult = await this.Jira.transitionIssue(argv.issue, { transition: {
      id: argv.transition,
    } })

    console.log(`transitionResult:${JSON.stringify(transitionResult, null, 4)}`)
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
