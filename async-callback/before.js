const got = require('got')
const { createServer } = require('http')
const { open, close, read } = require('fs')
const { join } = require('path')
const { format } = require('util')

let unhandledRejections = 0
let openedFds = 0

setInterval(() => {
  console.log(
    format('MEMORY: %d, UNHANDLED REJECTIONS: %d, FD: %d', process.memoryUsage().rss, unhandledRejections, openedFds)
  )
}, 2000)

process.on('unhandledRejection', () => unhandledRejections++)

function handler(req, res, cb) {
  open(join(__dirname, '../package.json'), (err, fd) => {
    if (err) {
      return cb(err)
    }

    read(fd, Buffer.alloc(100), 0, 100, 0, async (err, len, buffer) => {
      if (err) {
        return cb(err)
      }

      openedFds++

      const key = JSON.parse(buffer.slice(0, len).toString('utf-8')).key
      const res = await got(`http://localhost:3001?key=${key}`, { retry: 0 })

      close(fd, err => {
        if (err) {
          return cb(err)
        }

        openedFds--
        cb(null, res.body)
      })
    })
  })
}

const apiServer = createServer((req, res) => {
  if (Math.random() < 0.1) {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.write('REJECTED')
    res.end()
    return
  }

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
