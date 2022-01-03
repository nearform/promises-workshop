import http from 'http'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'

async function handle (req, res) {
  const a = await readFile(fileURLToPath(import.meta.url))
  const b = await readFile(fileURLToPath(import.meta.url))
  const c = await readFile(fileURLToPath(import.meta.url))

  res.end(Buffer.concat([a, b, c]))
}

http.createServer(function (req, res) {
  handle(req, res).catch(() => {
    res.statusCode = 500
    res.end('kaboom')
  })
}).listen(3000)
