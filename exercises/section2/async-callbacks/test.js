const autocannon = require('autocannon')
const got = require('got')
const {resolve} = require('path')
const {test, teardown} = require('node:test')

require(resolve(process.cwd(), process.argv[2]))

teardown(() => {
  return got('http://localhost:3000', {method: 'DELETE', retry: 0})
})

test('It should get 200 or 500 as response code, with no timeouts', async t => {
  t.plan(3)

  const result = await autocannon({
    url: 'http://localhost:3000',
    connections: 10,
    duration: 5,
    timeout: 1,
  })

  t.assert.ok(result['2xx'] > 0, 'Received 200 responses')
  t.assert.ok(result['5xx'] > 0, 'Received 500 responses')
  t.assert.ok(result.timeouts === 0, 'All requests completed with no timeouts')
})
