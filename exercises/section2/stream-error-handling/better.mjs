import fs from 'fs'
import { fileURLToPath } from 'url'

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

export default run

if (!process.argv.includes('test')) {
  const file = process.argv[2] || fileURLToPath(import.meta.url)
  run(file)
}
