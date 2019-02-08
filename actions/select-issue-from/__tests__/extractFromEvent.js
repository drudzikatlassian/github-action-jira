const SelectIssueFromAction = require('../SelectIssueFromAction')
const nock = require('nock')
const auth = { user: 'user@email.com', pass: 'jirapitoken' }

test('Extract from event by jsonpath', async () => {
  nock('https://example.com')
    .get('/rest/api/3/issue/NOTEXIST-1')
    .basicAuth(auth)
    .reply(404, {})
  
  nock('https://example.com')
    .get('/rest/api/3/issue/ISSUEKEY-3')
    .basicAuth(auth)
    .reply(200, {})

  const action = new SelectIssueFromAction({
    githubEvent: {
      ref: 'ref field NOTEXIST-1 ISSUEKEY-3 NOTEXIST-3 qweqwe'
    },
    config: {
      baseUrl: 'https://example.com',
      email: auth.user,
      token: auth.pass
    },
    args: {
      event: 'ref'
    }
  })

  const { issue: issueKey } = await action.execute()


  expect(issueKey).toBe('ISSUEKEY-3')
})