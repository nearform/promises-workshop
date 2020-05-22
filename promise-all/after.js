const got = require('got')
const { createServer } = require('http')
const { createReadStream } = require('fs')
const { join } = require('path')
const pMap = require('p-map')
const { format } = require('util')
let running = 0

setInterval(() => {
  console.log(format('RUNNING: %d', running))
}, 2000)

function handler(req, res, cb) {
  let data = ''

  async function fetch(i) {
    running++
    data += `CALL[${i}]\n`
    const res = await got(`http://localhost:3001`, { retry: 0 })

    data += `RES[${i}] ${res.body}\n`
    running--
  }

  pMap(Array.from(Array(100)), (_, i) => fetch(i), { concurrency: 5 })
    .then(() => {
      cb(null, data)
    })
    .catch(cb)
}

const apiServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.write('OK')
  res.end()
})

const server = createServer((req, res) => {
  handler(req, res, (err, body) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.write(err.message)
      res.end()
      return
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write(body)
    res.end()
  })
})

apiServer.listen(3001)
server.listen(3000)
