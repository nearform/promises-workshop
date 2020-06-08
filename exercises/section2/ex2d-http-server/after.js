'use strict';

const { createServer } = require('http')
const { pipeline: _pipeline } = require('stream')
const { on } = require('events')
const { promisify } = require('util')
const { createHash } = require('crypto')
const { createReadStream } = require('fs')

const pipeline = promisify(_pipeline)

const sleep = promisify(setTimeout)

;(async () => {
  const server = createServer()
  server.listen(8000)

  for await (const [request, response] of on(server, 'request')) {
    const file = createReadStream(__filename)
    const hash = createHash('sha256')
    pipeline(file, hash)
      .then(() => sleep(1000))
      .then(() => response.end(hash.digest().toString('hex').substr(0,10)))
  }
})()
