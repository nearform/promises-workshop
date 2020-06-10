'use strict';

const { createServer } = require('http');
const { on } = require('events');

(async () => {
  const server = createServer()
  server.listen(8000)

  for await (const [request, response] of on(server, 'request')) {
    response.end('hello world')
  }
})()
