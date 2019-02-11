const fs = require('fs')
const YAML = require('yaml')
const yargs = require('yargs')

const cliConfigPath = `${process.env.HOME}/.jira.d/config.yml`
const configPath = `${process.env.HOME}/jira/config.yml`
const Action = require('./action')

async function exec () {
  const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

  console.log(`config:${JSON.stringify(config, null, 4)}`)

  yargs
    .option('issue', {
      alias: 'i',
      describe: 'Provide an issue key to perform a transition on',
      demandOption: !config.issue,
      default: config.issue,
      type: 'string',
    })
    .option('transition', {
      alias: 't',
      describe: 'Provide a state to transition issue to',
      demandOption: !config.transition,
      default: config.transtion,
      type: 'string',
    })

  yargs
    .parserConfiguration({
      'parse-numbers': false,
    })

  const { argv } = yargs

  console.log('argv:', JSON.stringify(argv, null, 4))
  const githubEvent = require(process.env.GITHUB_EVENT_PATH)

  console.log(`githubEvent: ${JSON.stringify(githubEvent, null, 4)}`)

  try {
    const result = await new Action({
      githubEvent,
      argv,
      config,
    }).execute()

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
