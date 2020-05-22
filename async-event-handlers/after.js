const got = require('got')
const { createServer } = require('http')
const { createReadStream } = require('fs')
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
  const stream = createReadStream(join(__dirname, '../package.json'))
  openedFds++
  let data = ''
  let error

  stream.on('data', chunk => {
    stream.pause()

    got(`http://localhost:3001?key=${chunk}`, { retry: 0 })
      .then(res => {
        data += res.body
      })
      .catch(err => (error = err))
      .finally(() => {
        stream.resume()
      })
  })

  stream.on('end', () => {
    openedFds--

    if (error) {
      return cb(error)
    }
    cb(null, data)
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
