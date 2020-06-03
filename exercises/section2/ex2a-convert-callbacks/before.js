'use strict';

const { createServer, get } = require('http')
const { opendir, createReadStream } = require('fs')
const { resolve } = require('path')
const { pipeline } = require('stream')
const { createHash } = require('crypto')

function hashFile(path, cb) {
  const hash = createHash('sha256')
  pipeline(
    createReadStream(path),
    hash,
    (err) => {
      if (err) {
        cb(err)
        return
      }
      cb(null, hash.digest().toString('hex').substr(0, 10))
    })
}

function scanDir(path, out, depth, callback) {
  opendir(path, (err, dir) => {
    if (err) {
      callback(err)
      return
    }

    function next() { dir.read(handleEntity) }

    const handleEntity = (err, ent) => {
      if (err) {
        callback(err)
        return
      }
      if (ent == null) {
        dir.close()
        callback()
        return
      }
      if (ent.name.startsWith('.'))
        return next()
      const icon = ent.isDirectory() ? '+' : '-'
      const entityPath = resolve(dir.path, ent.name)

      if (ent.isFile()) {
        hashFile(entityPath, (err, hash) => {
          if (err) throw err
          out.write(`${' '.repeat(depth)}${icon} ${ent.name} (${hash})`)
          next()
        })
      } else {
        out.write(`${' '.repeat(depth)}${icon} ${ent.name}`)
        if (ent.isDirectory()) {
          return scanDir(entityPath, out, depth + 2, next)
        }
        next()
      }
    }

    next()
  })
}

const server = createServer((request, response) => {
  scanDir(resolve('../..'), response, 0, (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
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
