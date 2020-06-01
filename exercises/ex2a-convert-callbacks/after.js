'use strict';

const { createServer, get } = require('http')
const { opendir } = require('fs').promises
const { resolve } = require('path')

async function scanDir(path, out, depth) {
  const dir = await opendir(path)
  for await (const ent of dir) {
    if (ent.name.startsWith('.'))
      continue
    const icon = ent.isDirectory() ? '+' : '-'
    out.write(`${' '.repeat(depth)}${icon} ${ent.name}`)
    if (ent.isDirectory())
      await scanDir(resolve(dir.path, ent.name), out, depth + 2)
  }
}

const server = createServer((request, response) => {
  scanDir(resolve('../..'), response, 0)
    .then(() => response.end())
    .catch((err) => {
      response.writeHead(500, { 'Content-Type': 'text/plain' })
      response.write(err.message)
      response.end()
    })
})

server.listen(3001, () => {
  const port = server.address().port

  get(`http://localhost:${port}`, (response) => {
    response.setEncoding('utf8')
    //response.resume()
    response.on('data', console.log)
    response.on('end', () => server.close())
  })
})
