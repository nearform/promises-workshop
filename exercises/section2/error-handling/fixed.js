'use strict'

const fs = require('fs')

function countStream (file) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file)
    let n = 0

    stream.on('data', (buf) => { n += buf.length })

    stream.on('end', function () {
      resolve(n)
    })

    stream.on('error', reject)
  })
}

function run (file) {
  countStream(file)
    .then((n) => console.log(`${file} has ${n} bytes`))
    .catch((err) => console.log('caught error', err))
}

module.exports = run

if (require.main === module) {
  const file = process.argv[2] || __filename
  run(file)
}
