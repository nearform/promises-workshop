const { createServer } = require('http')
const { open } = require('fs').promises

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

async function handler() {
  const file = await open(__filename, 'r')
  openFiles++
  try {
    const {
      bytesRead,
      buffer
    } = await file.read(Buffer.alloc(10000), 0, 10000, 0)
    maybeThrow()
    return buffer.toString('utf8', 0, bytesRead)
  } finally {
    // Question to consider: What happens if we do not
    // close the FileHandle object here?
    if (file !== undefined) {
      await file.close()
      openFiles--
    }
  }
}

const server = createServer((request, response) => {
  // Special case for tearing down the server
  if (request.method === 'DELETE') {
    response.writeHead(202)
    response.end()
    server.close()
    return
  }

  handler()
    .then((body) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.end(body)
    })
    .catch((err) => {
      response.writeHead(500, { 'Content-Type': 'text/plain' })
      response.end(err.message)
    })
})

server.listen(3000)
