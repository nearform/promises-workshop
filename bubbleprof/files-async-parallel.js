const http = require('http')
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)

async function handle (req, res) {
  res.end(Buffer.concat(await Promise.all([
    readFile(__filename),
    readFile(__filename),
    readFile(__filename)
  ])))
}

http.createServer(function (req, res) {
  handle(req, res).catch(() => {
    res.statusCode = 500
    res.end('kaboom')
  })
}).listen(3000)
