'use strict'

const { createServer, get } = require('http')
const { opendir, createReadStream } = require('fs')
const { resolve } = require('path')
const { pipeline } = require('stream')
const { createHash } = require('crypto')

// Generate a sha-256 hash of the file contents by piping
// the file data into the Hash object. Once all of the
// data has been hashed, grab only the first 10 characters
// from the hex-encoded hash.
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

// Uses the opendir API to iterate over a directory structure
// recursively. The directory structure is written to out.
// When done, the callback is invoked.
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
    response.on('data', console.log)
    response.on('end', () => server.close())
  })
})
