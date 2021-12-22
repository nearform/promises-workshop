/* eslint no-unused-vars: 0 */

import { createServer } from 'http'
import { promisify } from 'util'

const sleep = promisify(setTimeout)

async function handler () {
  let data = ''

  // Do not change this function
  async function fetch (i) {
    data += `CALL[${i}]\n`

    const val = Buffer.allocUnsafe(16 * 1024 * 1024)

    await sleep(20)

    data += `RES[${i}]\n`
  }

  const items = Array.from(Array(100))

  for (let i = 0; i < items.length; i++) {
    await fetch(i)
  }

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
