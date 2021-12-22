import http from 'http'
import { readFile } from 'fs/promises'

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
