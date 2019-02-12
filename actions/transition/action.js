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

    let transitionId = argv.id

    if (transitionName) {
      const transition = _.find(transitions, t => transitionName === t.name.toLowerCase())

      if (transition) {
        transitionId = transition.id
      }
    }

    console.log('Possible transitions:')
    transitions.forEach((t) => {
      console.log(`{ id: ${t.id}, name: ${t.name} } transitions issue to '${t.to.name}' status.`)
    })

    if (transitionId) {
      await this.Jira.transitionIssue(issueId, { transition: {
        id: transitionId,
      } })

      const transitionedIssue = await this.Jira.getIssue(issueId)

      console.log(`Transitioned issue ${issueId} to : ${_.get(transitionedIssue, 'status.name')} state.`)
      console.log(`Link to issue: ${this.config.baseUrl}/browse/${issueId}`)

      return {}
    }
  }

  findTransitionByName (transitionName, transitions) {

  }
}
