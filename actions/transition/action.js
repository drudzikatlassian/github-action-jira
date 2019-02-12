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
    const { transitions } = await this.Jira.getIssueTransitions(issueId)

    const transitionName = argv._.join(' ').toLowerCase()

    const transitionId = argv.id ||
      _.find(transitions, t => transitionName === t.name.toLowerCase())

    console.log('Possible transition options:')
    transitions.forEach((t) => {
      console.log(`-id ${t.id} : '${t.name}' transitions to '${t.to.name}'`)
    })

    if (transitionId) {
      await this.Jira.transitionIssue(issueId, { transition: {
        id: transitionId,
      } })

      const transitionedIssue = await this.Jira.getIssue(issueId)

      console.log(`Transitioned Issue ${issueId} to : ${_.get(transitionedIssue, 'status.statusCategory.name')}`)

      return
    }

    return {}
  }

  findTransitionByName (transitionName, transitions) {

  }
}
