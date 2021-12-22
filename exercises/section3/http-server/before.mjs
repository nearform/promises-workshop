import { createServer } from 'http'
import { pipeline as _pipeline } from 'stream'
import { on } from 'events'
import { promisify } from 'util'
import { createHash } from 'crypto'
import { createReadStream } from 'fs'
import { fileURLToPath } from 'url'

const pipeline = promisify(_pipeline)
const sleep = promisify(setTimeout)

;(async () => {
  const server = createServer()
  server.listen(8000)

  for await (const [, response] of on(server, 'request')) {
    const file = createReadStream(fileURLToPath(import.meta.url))
    const hash = createHash('sha256')
    await pipeline(file, hash)
    await sleep(1000)
    response.end(hash.digest().toString('hex').substr(0, 10))
  }
})()
