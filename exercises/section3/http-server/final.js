import { createServer } from 'http'
import { pipeline as _pipeline } from 'stream'
import { promisify } from 'util'
import { createHash } from 'crypto'
import { createReadStream } from 'fs'

const pipeline = promisify(_pipeline)
const sleep = promisify(setTimeout)

const server = createServer((request, response) => {
  hash(request, response)
    .catch((err) => {
      console.error(err.message)
      response.statusCode = 500
      response.end(err.message)
    })
})

async function hash (request, response) {
  const file = createReadStream(__filename)
  const hash = createHash('sha256')
  await pipeline(file, hash)
  await sleep(1000)
  response.end(hash.digest().toString('hex').substr(0, 10))
}

server.listen(8000)
