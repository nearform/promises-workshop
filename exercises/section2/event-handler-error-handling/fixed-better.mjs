import EventEmitter from 'events'
import { promisify } from 'util'

const foo = new EventEmitter({ captureRejections: true })
const sleep = promisify(setTimeout)

foo.on('something', async () => {
  await sleep(100)
  functionThatDoesNotExist()
})

foo.on('error', () => {
  throw new Error('boom')
})

process.on('uncaughtException', (err) => {
  console.log(err.message)
})

foo.emit('something')
