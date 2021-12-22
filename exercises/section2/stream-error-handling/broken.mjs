import fs from 'fs'
import { fileURLToPath } from 'url'

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
  const p = countStream(file)

  p.then((n) => console.log(`${file} has ${n} bytes`))
  p.catch((err) => console.log('caught error', err))
}

export default run

if (!process.argv.includes('test')) {
  const file = process.argv[2] || fileURLToPath(import.meta.url)
  run(file)
}
