const _ = require('lodash')
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
    const { argv } = this

    const issueId = argv.issue
    const transitionId = argv.transition

    const { transitions } = await this.Jira.getIssueTransitions(issueId)

    console.log('Possible transition options:')
    transitions.forEach((t) => {
      console.log(`-t ${t.id} : '${t.name}' transitions to '${t.to.name}'`)
    })

    await this.Jira.transitionIssue(issueId, { transition: {
      id: transitionId,
    } })

    const transitionedIssue = await this.Jira.getIssue(issueId)

    console.log(`Transitioned Issue ${issueId} to : ${_.get(transitionedIssue, 'status.statusCategory.name')}`)

    return {}
  }
}
