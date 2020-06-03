const got = require('got')
const {resolve} = require('path')
const t = require('tap')

require(resolve(process.cwd(), process.argv[2]))
let body

t.beforeEach(async () => {
  body = (await got('http://localhost:3000', {retry: 0})).body
})

t.tearDown(() => {
  return got('http://localhost:3000', {method: 'DELETE', retry: 0})
})

t.test('It should get response for each call', t => {
  t.plan(200)

  for(let i = 0; i < 100; i++) {
    t.includes(body, `CALL[${i}]`, `Call ${i} has been made.`)
    t.includes(body, `RES[${i}] OK`, `Call ${i} has received response.`)
  }
})

t.test('Results should be processed before all promises are launched', t => {
  t.plan(1)

  t.match(body, /(CALL\[\d+\]\nRES\[\d+\] OK\n){3,}/)
})