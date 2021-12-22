// run with:
// clinic bubble --autocannon [ -a 1000 / ] -- node basic.js

import http from 'http'
import { promisify } from 'util'

const sleep = promisify(setTimeout)

async function something (req, res) {
  await sleep(20)
  res.end('hello world')
}

http.createServer(function handle (req, res) {
  something(req, res).catch((err) => {
    res.statusCode = 500
    res.end(JSON.stringify(err))
  })
}).listen(3000)
