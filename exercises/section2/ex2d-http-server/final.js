'use strict';

const { createServer } = require('http')
const { pipeline: _pipeline } = require('stream')
const { promisify } = require('util')
const { createHash } = require('crypto')
const { createReadStream } = require('fs')

const pipeline = promisify(_pipeline)

const sleep = promisify(setTimeout)

const server = createServer((request, response) => {
  const file = createReadStream(__filename)
  const hash = createHash('sha256')
  pipeline(file, hash)
    .then(() => sleep(1000))
    .then(() => response.end(hash.digest().toString('hex').substr(0,10)))
    .catch((err) => {
      response.destroy(err)
      console.log(err.message)
    })
});

server.listen(8000);
