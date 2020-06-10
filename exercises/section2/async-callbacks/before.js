const { createServer } = require('http')
const { open, close, read } = require('fs')

let openFiles = 0
let unhandledRejections = 0

process.on('unhandledRejection', () => unhandledRejections++)

setInterval(() => {
  console.log(`Open Files: ${openFiles}, ` +
              `Unhandled Rejections: ${unhandledRejections}`)
}, 1000).unref()

function maybeThrow() {
  if (Math.floor(Math.random() * 100) % 2)
    throw new Error('boom')
}

function handler(callback) {
  open(__filename, 'r', async (err, fd) => {
    if (err) {
      return callback(err)
    }

    openFiles++

    const buf = Buffer.alloc(10000)
    read(fd, buf, 0, buf.length, 0, async (err, len, buffer) => {
      if (err) {
        return callback(err)
      }

      // Simulate an intermittent failure by randomly throwing
      // roughly 50% of the time it is called. What will happen
      // in this case?
      maybeThrow()

      close(fd, async (err) => {
        if (err) {
          return callback(err)
        }
        openFiles--
        callback(null, buffer.toString('utf8', 0, len))
      })
    })
  })
}

const server = createServer((request, response) => {
  // Special case for tearing down the server
  if (request.method === 'DELETE') {
    response.writeHead(202)
    response.end()
    server.close()
    return
  }

  handler((err, body) => {
    if (err) {
      response.writeHead(500, { 'Content-Type': 'text/plain' })
      response.end(err.message)
      return
    }
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(body)
  })
})

server.listen(3000)
