'use strict'

const fs = require('fs')

async function countStream (file) {
  let n = 0
  for await (const buf of fs.createReadStream(file)) {
    n += buf.length
  }
  return n
}

async function run (file) {
  try {
    const n = await countStream(file)
    console.log(`${file} has ${n} bytes`)
  } catch (err) {
    console.log('caught error', err)
  }
}

module.exports = run

if (require.main === module) {
  const file = process.argv[2] || __filename
  run(file)
}
