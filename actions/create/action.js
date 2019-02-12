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

    const issueMeta = await this.Jira.getCreateMeta({
      projectKeys: argv.project,
    })

    console.log(`issueMeta: ${JSON.stringify(issueMeta, null, 4)}`)

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

    return { issue: issue.key }
  }
}
