'use strict'

// run with:
// clinic bubble --autocannon [ -a 1000 / ] -- node basic.js

const http = require('http')
const { promisify } = require('util')
const sleep = promisify(setTimeout)

http.createServer(function handle (req, res) {
  // A new logical continuation context is created
  // for each request. It comes in the form of closure data.

  sleep(20).then(() => {     // this is part of the same continuation
    res.end('hello world')
  }, (err) => {              // so is this
    res.statusCode = 500
    res.end(JSON.stringify(err))
  })
}).listen(3000)
