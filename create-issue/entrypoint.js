const fs = require('fs')
const YAML = require('yaml')
const cliConfigPath = process.env['HOME'] + '/.jira.d/config.yml'
const configPath = process.env['HOME'] + '/jira/config.yml'
const CreateIssueAction = require('./CreateIssueAction')
const argv = require('yargs').parserConfiguration({
  "parse-numbers": false,
}).argv

async function exec() {
  const githubEvent = require(process.env['GITHUB_EVENT_PATH'])
  console.log(`githubEvent: ${JSON.stringify(githubEvent, null, 4)}` )
  const action = new CreateIssueAction({
    githubEvent,
    argv,
    config: YAML.parse(fs.readFileSync(configPath, 'utf8'))
  })

  try {
    const result = await action.execute()

    if (result) {
      console.log(`Created issue: ${result.issue}`)
      console.log(`Saving ${result.issue} to ${cliConfigPath}`)
      return fs.appendFileSync(cliConfigPath, YAML.stringify(result))
    }

    console.log('Failed to create issue.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

exec()
