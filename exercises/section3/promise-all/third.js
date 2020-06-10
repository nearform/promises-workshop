'use strict'

const { createServer } = require('http')
const { join } = require('path')
const { promisify } = require('util')
const pMap = require('p-map')
const sleep = promisify(setTimeout)

async function handler() {
  let data = ''

  async function fetch(i) {
    data += `CALL[${i}]\n`

    const val = Buffer.allocUnsafe(16 * 1024 * 1024)

    await sleep(20)

    data += `RES[${i}]\n`
  }

  const items = Array.from(Array(100))

  await pMap(items, (_, i) => fetch(i), { concurrency: 16 })

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

server.listen(3000)

printArrayBufferMemory()
setInterval(printArrayBufferMemory, 1000)

function printArrayBufferMemory () {
  const mem = process.memoryUsage().arrayBuffers
  console.log(`ArrayBuffers memory ${Math.round(mem / 1024 / 1024)} MB`)
}
