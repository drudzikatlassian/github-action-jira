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

  async execute() {
    console.log(`argv:${JSON.stringify(this.argv, null, 4)}`)
    console.log('process.argv:' + JSON.stringify(process.argv, null, 4))
    const argv = this.argv

    const payload = {
      fields: {
        project: {
          key: argv.project
        },
        issuetype: {
          name: argv.issuetype
        },
        summary: argv.summary,
        description: argv.description,
        ...argv.fields
      }
    }

    const result = await this.Jira.createIssue(payload)
    
    console.log(`creating issue status: ${result.ok}`)

    const jsonRes = await result.json()
    console.log('jsonRes:' + JSON.stringify(jsonRes, null, 4))
    
    if (result.ok) {
      return {issue: jsonRes.key}
    }

    return
  }
}