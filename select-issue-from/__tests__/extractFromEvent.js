const { getIssueKey } = require('../entrypoint')
const nock = require('nock')
const auth = { user: process.env['JIRA_USER_EMAIL'], pass: process.env['JIRA_API_TOKEN'] }

test('Extract from event by jsonpath', async () => {
  nock('https://example.com')
    .get('/rest/api/3/issue/NOTEXIST-1')
    .basicAuth(auth)
    .reply(404, {})
    .log(console.log)
  
  nock('https://example.com')
    .get('/rest/api/3/issue/ISSUEKEY-3')
    .basicAuth(auth)
    .reply(200, {})

  const issueKey = await getIssueKey({
    event: 'ref'
  },{
    ref: 'ref field NOTEXIST-1 ISSUEKEY-3 NOTEXIST-3 qweqwe'
  })


  expect(issueKey).toBe('ISSUEKEY-3')
})