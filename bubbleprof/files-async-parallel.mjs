import http from 'http'
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'

async function handle (req, res) {
  res.end(Buffer.concat(await Promise.all([
    readFile(fileURLToPath(import.meta.url)),
    readFile(fileURLToPath(import.meta.url)),
    readFile(fileURLToPath(import.meta.url))
  ])))
}

http.createServer(function (req, res) {
  handle(req, res).catch(() => {
    res.statusCode = 500
    res.end('kaboom')
  })
}).listen(3000)
