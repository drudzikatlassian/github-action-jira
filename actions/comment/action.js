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
    const issueId = this.argv.issue
    const { comment } = this.argv

    await this.Jira.addComment(issueId, { body: comment })

    return {}
  }
}
