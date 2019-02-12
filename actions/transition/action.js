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
      console.log(`name: ${t.name} id: ${t.id} transitions issue to '${t.to.name}' status.`)
      console.log(`Usage:`)
      console.log(`\t ${t.name}`)
      console.log(`\t -id ${t.id}`)
    })

    if (transitionId) {
      await this.Jira.transitionIssue(issueId, { transition: {
        id: transitionId,
      } })

      const transitionedIssue = await this.Jira.getIssue(issueId)

      console.log(`Transitioned Issue ${issueId} to : ${_.get(transitionedIssue, 'status.statusCategory.name')} state.`)
      console.log(`Link to issue: ${this.config.baseUrl}/browse/${issueId}`)

      return {}
    }
  }

  findTransitionByName (transitionName, transitions) {

  }
}
