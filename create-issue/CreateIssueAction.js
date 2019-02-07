const fetch = require('node-fetch')

module.exports = class CreateIssue {

  constructor ({ githubEvent, argv, config }) {
    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
  }

  async execute() {
    console.log(`argv:${JSON.stringify(this.argv, null, 4)}`)
    console.log('process.argv:' + JSON.stringify(process.argv, null, 4))
    const {
      fields,
      project,
      issueType
    } = this.argv

    const payload = {
      fields,
      project,
      issueType
    }

    const auth = 'Basic ' + Buffer.from(this.config.email + ':' + this.config.token).toString('base64');
    const url = `${this.config.baseUrl}/rest/api/3/issue`
    const result = await fetch(url, { 
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    console.log(`creating issue status: ${result.ok}`)

    const jsonRes = await result.json()
    console.log('jsonRes:' + JSON.stringify(jsonRes, null, 4))
    
    if (result.ok) {
      return {issue: jsonRes.id}
    }

    return
  }
}