const fs = require('fs')
const YAML = require('yaml')

const cliConfigPath = `${process.env.HOME}/.jira.d/config.yml`
const configPath = `${process.env.HOME}/jira/config.yml`
const yargs = require('yargs')
const Action = require('./action')

async function exec () {
  const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

  yargs
    .option('issue', {
      alias: 'i',
      describe: 'Provide an issue key to add a comment for',
      demandOption: !config.issue,
      default: config.issue,
      type: 'string',
    })
    .option('comment', {
      alias: 'c',
      describe: 'Provide a comment to add to issue',
      demandOption: !config.comment,
      default: config.comment,
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

  const action = new Action({
    githubEvent,
    argv,
    config,
  })

  try {
    const result = await action.execute()

    if (result) {
      const yamledResult = YAML.stringify(result)
      const extendedConfig = Object.assign({}, config, result)

      fs.writeFileSync(configPath, YAML.stringify(extendedConfig))

      return fs.appendFileSync(cliConfigPath, yamledResult)
    }

    console.log('Failed to comment an issue.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

exec()
