const fs = require('fs')
const YAML = require('yaml')
const cliConfigPath = process.env['HOME'] + '/.jira.d/config.yml'
const configPath = process.env['HOME'] + '/jira/config.yml'
const Action = require('./action')

async function exec() {
  const githubEvent = require(process.env['GITHUB_EVENT_PATH'])
  console.log(`githubEvent: ${JSON.stringify(githubEvent, null, 4)}` )
  const action = new Action({
    githubEvent,
    argv: require('yargs').argv,
    config: YAML.parse(fs.readFileSync(configPath, 'utf8'))
  })

  try {
    const result = await action.execute()

    if (result) {
      console.log(`Detected issueKey: ${result.issue}`)
      console.log(`Saving ${result.issue} to ${cliConfigPath}`)
      console.log(`Saving ${result.issue} to ${configPath}`)
      
      const extendedConfig = Object.assign({}, config, result)
      fs.writeFileSync(configPath, YAML.stringify(extendedConfig))

      return fs.appendFileSync(cliConfigPath, YAML.stringify(result))
    }

    console.log('No issueKeys found.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

exec()
