import { strictEqual } from 'assert'
import { promisify } from 'util'

const sleep = promisify(setTimeout)

const cache = new Map()

function handleError (err) {
  console.log(err.message)
}

async function maybeSleep (n) {
  const r = Math.random(10) * 10 | 0
  if (r > 5) throw new Error('boom')
  await sleep(n)
}

function doRequest (key, n) {
  let p = cache.get(key)
  if (!p) {
    p = maybeSleep(n).finally(() => cache.delete(key))
    cache.set(key, p)
  }
  return p
}

doRequest('foo', 200)
  .then(() => console.log('A'))
  .catch(handleError)

doRequest('foo', 100)
  .then(() => console.log('B'))
  .catch(handleError)

doRequest('foo', 200)
  .then(() => {
    doRequest('foo', 50)
      .then(() => console.log('C'))
      .catch(handleError)
  })
  .catch(handleError)

process.on('exit', () => {
  strictEqual(cache.size, 0)
})
