/* eslint no-unused-vars: 0 */

'use strict'

const { createServer } = require('http')
const { promisify } = require('util')
const sleep = promisify(setTimeout)

async function handler() {
  let data = ''

  async function fetch(i) {
    data += `CALL[${i}]\n`

    const val = Buffer.allocUnsafe(i * 1024 * 1024)

    await sleep(10)

    data += `RES[${i}]\n`
  }

  const items = Array.from(Array(100))

  await Promise.all(items.map((_, i) => fetch(i)))

  return data
}

const server = createServer((req, res) => {
  handler().then((body) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(body)
  }).catch((err) => {
    console.error(err)
    res.statusCode = 500
    res.end(err.message)
  })
})

printArrayBufferMemory()
setInterval(printArrayBufferMemory, 1000)

function printArrayBufferMemory () {
  const mem = process.memoryUsage().arrayBuffers
  console.log(`ArrayBuffers memory ${Math.round(mem / 1024 / 1024)} MB`)
}

server.listen(3000)
