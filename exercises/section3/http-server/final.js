'use strict';

const { createServer } = require('http')
const { pipeline: _pipeline } = require('stream')
const { promisify } = require('util')
const { createHash } = require('crypto')
const { createReadStream } = require('fs')

const pipeline = promisify(_pipeline)

const sleep = promisify(setTimeout)

const server = createServer()

server.on('request', (request, response) => {
  hash(request, response)
    .catch((err) => {
      console.error(err.message)
      ressponse.statusCode = 500
      response.end(err.message)
    })
});

async function hash (request, response) {
  const file = createReadStream(__filename)
  const hash = createHash('sha256')
  await pipeline(file, hash)
  await sleep(1000)
  response.end(hash.digest().toString('hex').substr(0,10))
}

server.listen(8000);
