import autocannon from 'autocannon'
import { fetch } from 'undici'
import { resolve } from 'path'
import t from 'tap'

await import(resolve(process.cwd(), process.argv[2]))

t.teardown(() => {
  return fetch('http://localhost:3000', { method: 'DELETE' })
})

t.test('It should get 200 or 500 as response code, with no timeouts', async t => {
  t.plan(3)

  const result = await autocannon({
    url: 'http://localhost:3000',
    connections: 10,
    duration: 5,
    timeout: 1
  })

  t.ok(result['2xx'] > 0, 'Received 200 responses')
  t.ok(result['5xx'] > 0, 'Received 500 responses')
  t.ok(result.timeouts === 0, 'All requests completed with no timeouts')
})
