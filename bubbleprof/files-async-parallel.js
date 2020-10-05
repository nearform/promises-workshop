const http = require('http')
const { readFile } = require('fs').promises

async function handle (req, res) {
  res.end(Buffer.concat(await Promise.all([
    readFile(__filename),
    readFile(__filename),
    readFile(__filename)
  ])))
}

http.createServer(function (req, res) {
  handle(req, res).catch((err) => {
    res.statusCode = 500
    res.end('kaboom')
  })
}).listen(3000)
