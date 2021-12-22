// This example illustrates a common, but problematic
// use of Promise.race(). Can you spot the problem?

import { promisify } from 'util'

const sleep = promisify(setTimeout)

async function getData () {
  await sleep(5000)
  return 'this is the data'
}

async function timeout (n) {
  await sleep(n)
  throw new Error('Timed out!')
}

(async () => {
  try {
    await Promise.race([getData(), timeout(2000)])
  } catch (err) {
    console.error(err.message)
  }
})()
