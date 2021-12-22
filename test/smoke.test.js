const t = require('tap')
const { resolve } = require('path')

function runScript (path) {
  require(resolve(process.cwd(), path))
}

t.test('exercises/section1/order/first.js', async t => runScript(t.name))
t.test('exercises/section1/order/second.js', async t => runScript(t.name))

t.test('exercises/section2/caching-promises/fixed.js', async t => runScript(t.name))

t.test('exercises/section2/event-handler-error-handling/better.js', async t => runScript(t.name))
t.test('exercises/section2/event-handler-error-handling/fixed-once.js', async t => runScript(t.name))

t.test('exercises/section3/bluebird/example.js', async t => runScript(t.name))

t.test('exercises/section3/piscina-stream-in/index.js', async t => runScript(t.name))

t.test('exercises/section3/process-race/before.js', async t => runScript(t.name))
