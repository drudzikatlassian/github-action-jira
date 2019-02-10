const fs = require('fs')
const YAML = require('yaml')
const cliConfigPath = process.env['HOME'] + '/.jira.d/config.yml'
const configPath = process.env['HOME'] + '/jira/config.yml'
const TransitionIssueAction = require('./TransitionIssueAction')


async function exec() {
  const yargs = require('yargs')
  const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

  yargs
    .option('issue', {
      alias: 'i',
      describe: 'Provide an issue key to perform a transition on',
      demandOption: config.issue ? false : true,
      default: config.issue,
      type: 'string'
    })
    .option('transition', {
      alias: 't',
      describe: 'Provide a state to transition issue to',
      demandOption: config.transition ? false : true,
      default: config.transtion,
      type: 'string'
    })
  
  yargs
    .parserConfiguration({
      "parse-numbers": false,
    })

  const argv = yargs.argv

  console.log('argv:', JSON.stringify(argv, null,4))
  const githubEvent = require(process.env['GITHUB_EVENT_PATH'])
  console.log(`githubEvent: ${JSON.stringify(githubEvent, null, 4)}` )
  const action = new TransitionIssueAction({
    githubEvent,
    argv,
    config
  })

  try {
    const result = await action.execute()

    if (result) {
      return
    }

    console.log('Failed to create issue.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

exec()
