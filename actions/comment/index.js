const fs = require('fs')
const YAML = require('yaml')
const yargs = require('yargs')
const _ = require('lodash')

const cliConfigPath = `${process.env.HOME}/.jira.d/config.yml`
const configPath = `${process.env.HOME}/jira/config.yml`
const Action = require('./action')

// eslint-disable-next-line import/no-dynamic-require
const githubEvent = require(process.env.GITHUB_EVENT_PATH)
const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

async function exec () {
  try {
    const result = await new Action({
      githubEvent,
      argv: parseArgs(),
      config,
    }).execute()

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

function parseArgs () {
  yargs
    .middleware((argv) => {
      _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
      const compiled = _.template(argv.comment)
      const interpolatedComment = compiled({ event: githubEvent })

      console.log(`interpolatedComment:${interpolatedComment}`)
      argv.comment = interpolatedComment
    })
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

  return yargs.argv
}

exec()
