'use strict'

const { AbortController } = require('abort-controller')

function getData(abortController) {
  // We have to switch to using the Promise constructor here because
  // the promisified version of setTimeout does not yet expose a way
  // of canceling the timeout.
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => resolve('this is the data'), 5000)

    abortController.signal.onabort = () => {
      clearTimeout(timeout)
      reject(new Error('Task canceled'))
    }
  })
}

;(async () => {
  try {
    const ac = new AbortController()
    setTimeout(() => ac.abort(), 2000)
    await getData(ac)
  } catch (err) {
    console.error(err.message)
  }
})()
