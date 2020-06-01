'use strict';

const { createServer, get } = require('http')
const { opendir } = require('fs')
const { resolve } = require('path')

function scanDir(path, out, depth, callback) {
  opendir(path, (err, dir) => {
    if (err) throw err

    function next() { dir.read(handleEntity) }

    const handleEntity = (err, ent) => {
      if (err) throw err
      if (ent == null) {
        dir.close()
        callback()
        return
      }
      if (ent.name.startsWith('.'))
        return next()
      const icon = ent.isDirectory() ? '+' : '-'
      out.write(`${' '.repeat(depth)}${icon} ${ent.name}`)
      if (ent.isDirectory()) {
        return scanDir(resolve(dir.path, ent.name),
                       out,
                       depth + 2,
                       next)
      }
      next()
    }

    next()
  })
}

const server = createServer((request, response) => {
  scanDir(resolve('../..'), response, 0, () => response.end())
})

server.listen(3001, () => {
  const port = server.address().port

  get(`http://localhost:${port}`, (response) => {
    response.setEncoding('utf8')
    response.resume()
    response.on('end', () => server.close())
  })
})
