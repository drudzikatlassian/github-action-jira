const fs = require('fs')
const YAML = require('yaml')
const cliConfigPath = process.env['HOME'] + '/.jira.d/config.yml'
const configPath = process.env['HOME'] + '/jira/config.yml'
const CreateIssueAction = require('./CreateIssueAction')
const _ = require('lodash')


async function exec() {
  const yargs = require('yargs')
  const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

  yargs
    .option('project', {
      alias: 'p',
      describe: 'Provide project to create issue in',
      demandOption: config.project ? false : true,
      default: config.project,
      type: 'string'
    })
    .option('issuetype', {
      alias: 't',
      describe: 'Provide type of the issue to be created',
      demandOption: config.issuetype ? false : true,
      default: config.issuetype,
      type: 'string'
    })
    .option('summary', {
      alias: 's',
      describe: 'Provide summary for the issue',
      demandOption: config.summary ? false : true,
      default: config.summary,
      type: 'string'
    })
    .option('description', {
      alias: 'd',
      describe: 'Provide issue description',
      demandOption: config.description ? false : true,
      default: config.description,
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
  const action = new CreateIssueAction({
    githubEvent,
    argv,
    config
  })

  try {
    const result = await action.execute()

    if (result) {
      console.log(`Created issue: ${result.issue}`)
      console.log(`Saving ${result.issue} to ${cliConfigPath}`)
      console.log(`Saving ${result.issue} to ${configPath}`)
      const yamledResult = YAML.stringify(result)

      const extendedConfig = {
        ...config,
        ...result
      }

      fs.appendFileSync(configPath, YAML.stringify(extendedConfig))
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
