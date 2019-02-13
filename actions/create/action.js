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
    this.preprocessArgs()

    const { argv } = this

    // map custom fields
    const { projects } = await this.Jira.getCreateMeta({
      expand: 'projects.issuetypes.fields',
      projectKeys: argv.project,
      issuetypeNames: argv.issuetype,
    })

    if (projects.length === 0) {
      console.error(`project ${argv.project} not found`)
      return
    }

    const [project] = projects
    const [issueType] = project.issuetypes

    console.log(`issueMeta: ${JSON.stringify(issueType.fields, null, 4)}`)

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

  preprocessArgs () {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const summaryTmpl = _.template(this.argv.summary)
    const descriptionTmpl = _.template(this.argv.description)
    this.argv.summary = summaryTmpl({ event: this.githubEvent })
    this.argv.description = descriptionTmpl({ event: this.githubEvent })
  }
}
