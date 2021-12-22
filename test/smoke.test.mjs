import t from 'tap'
import { resolve } from 'path'

async function runScript (path) {
  await import(resolve(process.cwd(), path))
}

t.test('exercises/section1/order/first.js', t => runScript(t.name))
t.test('exercises/section1/order/second.js', t => runScript(t.name))

t.test('exercises/section2/caching-promises/fixed.mjs', t => runScript(t.name))

t.test('exercises/section2/event-handler-error-handling/better.mjs', t => runScript(t.name))
t.test('exercises/section2/event-handler-error-handling/fixed-once.mjs', t => runScript(t.name))

t.test('exercises/section3/bluebird/example.mjs', t => runScript(t.name))

t.test('exercises/section3/piscina-stream-in/index.mjs', t => runScript(t.name))

t.test('exercises/section3/process-race/before.mjs', t => runScript(t.name))
