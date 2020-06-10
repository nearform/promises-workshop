const got = require('got')
const { createServer } = require('http')
const { createReadStream } = require('fs')
const { join } = require('path')
const { format } = require('util')

function handler(req, res, cb) {
  let data = ''

  async function fetch(i) {
    data += `CALL[${i}]\n`
    const res = await got(`http://localhost:3001`, { retry: 0 })

    data += `RES[${i}] ${res.body}\n`
  }

  Promise.all(Array.from(Array(100), (_, i) => fetch(i)))
    .then(() => {
      cb(null, data)
    })
}

const apiServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.write('OK')
  res.end()
})

const server = createServer((req, res) => {
  handler(req, res, (err, body) => {
    if(req.method === 'DELETE') {
      res.writeHead(202, { 'Content-Type': 'text/plain' })
      res.end()
      server.close()
      apiServer.close()
      return
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write(body)
    res.end()
  })
})

apiServer.listen(3001)
server.listen(3000)
