const fs = require('fs')
const YAML = require('yaml')

const cliConfigPath = `${process.env.HOME}/.jira.d/config.yml`
const configPath = `${process.env.HOME}/jira/config.yml`
const yargs = require('yargs')
const Action = require('./action')

async function exec () {
  const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

  yargs
    .option('project', {
      alias: 'p',
      describe: 'Provide project to create issue in',
      demandOption: !config.project,
      default: config.project,
      type: 'string',
    })
    .option('issuetype', {
      alias: 't',
      describe: 'Provide type of the issue to be created',
      demandOption: !config.issuetype,
      default: config.issuetype,
      type: 'string',
    })
    .option('summary', {
      alias: 's',
      describe: 'Provide summary for the issue',
      demandOption: !config.summary,
      default: config.summary,
      type: 'string',
    })
    .option('description', {
      alias: 'd',
      describe: 'Provide issue description',
      default: config.description,
      type: 'string',
    })

  yargs
    .parserConfiguration({
      'parse-numbers': false,
    })

  const { argv } = yargs

  const githubEvent = require(process.env.GITHUB_EVENT_PATH)

  const action = new Action({
    githubEvent,
    argv,
    config,
  })

  try {
    const result = await action.execute()

    if (result) {
      console.log(`Created issue: ${result.issue}`)
      console.log(`Saving ${result.issue} to ${cliConfigPath}`)
      console.log(`Saving ${result.issue} to ${configPath}`)
      const yamledResult = YAML.stringify(result)

      const extendedConfig = Object.assign({}, config, result)

      fs.writeFileSync(configPath, YAML.stringify(extendedConfig))

      return fs.appendFileSync(cliConfigPath, yamledResult)
    }

    console.log('Failed to create issue.')
    process.exit(78)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

exec()
