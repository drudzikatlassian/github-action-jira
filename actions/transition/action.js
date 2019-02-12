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

    const transitionName = argv._.join(' ')

    const transitionToApply = _.find(transitions, (t) => {
      if (t.id === argv.id) return true
      if (transitionName.toLowerCase() === t.name.toLowerCase()) return true
    })

    if (!transitionToApply) {
      return console.log('Please specify transition name or transition id.')
    }

    console.log('Possible transitions:')
    transitions.forEach((t) => {
      console.log(`{ id: ${t.id}, name: ${t.name} } transitions issue to '${t.to.name}' status.`)
    })

    await this.Jira.transitionIssue(issueId, { transition: {
      id: transitionToApply.id,
    } })

    const transitionedIssue = await this.Jira.getIssue(issueId)

    console.log(`transitionedIssue:${JSON.stringify(transitionedIssue, null, 4)}`)
    console.log(`Transitioned issue ${issueId} to : ${_.get(transitionedIssue, 'status.name')} state.`)
    console.log(`Link to issue: ${this.config.baseUrl}/browse/${issueId}`)

    return {}
  }
}
