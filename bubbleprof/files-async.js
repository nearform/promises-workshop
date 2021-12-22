import http from 'http'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

async function handle (req, res) {
  const a = await readFile(__filename)
  const b = await readFile(__filename)
  const c = await readFile(__filename)

  res.end(Buffer.concat([a, b, c]))
}

http.createServer(function (req, res) {
  handle(req, res).catch(() => {
    res.statusCode = 500
    res.end('kaboom')
  })
}).listen(3000)
