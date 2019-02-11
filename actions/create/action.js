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

    const payload = {
      fields: {
        project: {
          key: argv.project,
        },
        issuetype: {
          name: argv.issuetype,
        },
        summary: argv.summary,
        ...argv.fields,
      },
    }

    if (argv.description) {
      payload.fields.description = argv.description
    }

    const issue = await this.Jira.createIssue(payload)

    console.log(`created issue:${JSON.stringify(issue, null, 4)}`)

    return { issue: issue.key }
  }
}
