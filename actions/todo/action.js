const _ = require('lodash')
const fetch = require('node-fetch')
const Jira = require('./common/net/Jira')

module.exports = class {
  constructor ({ githubEvent, argv, config, githubToken }) {
    this.Jira = new Jira({
      baseUrl: config.baseUrl,
      token: config.token,
      email: config.email,
    })

    this.config = config
    this.argv = argv
    this.githubEvent = githubEvent
    this.githubToken = githubToken
  }

  async execute () {
    const { argv, githubEvent } = this
    const projectKey = argv.project
    const issuetypeName = argv.issuetype
    let tasks

    if (githubEvent.commits && githubEvent.commits.length > 0) {
      tasks = _.flatten(await this.findTodoInCommits(githubEvent.repository, githubEvent.commits))
    }

    if (tasks.length === 0) {
      console.log('no TODO found')

      return
    }

    // map custom fields
    const { projects } = await this.Jira.getCreateMeta({
      expand: 'projects.issuetypes.fields',
      projectKeys: projectKey,
      issuetypeNames: issuetypeName,
    })

    if (projects.length === 0) {
      console.error(`project '${projectKey}' not found`)

      return
    }

    const [project] = projects

    if (project.issuetypes.length === 0) {
      console.error(`issuetype '${issuetypeName}' not found`)

      return
    }

    const issues = tasks.map(async ({ summary, commitUrl }) => {
      let providedFields = [{
        key: 'project',
        value: {
          key: projectKey,
        },
      }, {
        key: 'issuetype',
        value: {
          name: issuetypeName,
        },
      }, {
        key: 'summary',
        value: summary,
      }]

      if (!argv.description) {
        argv.description = `Created with Github commit ${commitUrl}`
      }

      providedFields.push({
        key: 'description',
        value: argv.description,
      })

      if (argv.fields) {
        providedFields = [...providedFields, ...this.transformFields(argv.fields)]
      }

      const payload = providedFields.reduce((acc, field) => {
        acc.fields[field.key] = field.value

        return acc
      }, {
        fields: {},
      })

      return (await this.Jira.createIssue(payload)).key
    })

    return { issues: await Promise.all(issues) }
  }

  transformFields (fields) {
    return Object.keys(fields).map(fieldKey => ({
      key: fieldKey,
      value: fields[fieldKey],
    }))
  }

  preprocessArgs () {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    const descriptionTmpl = _.template(this.argv.description)

    this.argv.description = descriptionTmpl({ event: this.githubEvent })
  }

  async findTodoInCommits(repo, commits) {
    console.log(commits)
    return Promise.all(commits.map(async (c) => {
      const req = {
        headers: {
          Authorization: `token ${this.githubToken}`,
          Accept: 'application/vnd.github.v3.diff',
        }
      }
      const url = `https://api.github.com/repos/${repo.full_name}/commits/${c.id}`
      // TODO: cleanup here please
      console.log(url)
      const resp = await fetch(url, req);
      const res = await resp.text();
      // TODO: refactor this please
      const rx = /\+\s*\/\/ TODO: (.*)$/gm;
      const summaries = (res.match(rx) || []).map(m => m.split('// TODO: ')[1])
      return summaries.map((s) => {
        return {
          commitUrl: c.url,
          summary: s,
        }
      });
    }))
  }
}
