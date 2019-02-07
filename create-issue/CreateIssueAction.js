module.exports = class CreateIssue {

  constructor ({ githubEvent, args, config }) {
    this.config = config
    this.args = args
    this.githubEvent = githubEvent
  }

  async execute() {
    console.log(`args:${JSON.stringify(this.args, null, 4)}`)

    return
  }
}