import { EventEmitter, once } from 'events'
import { promisify } from 'util'

const foo = new EventEmitter()
const sleep = promisify(setTimeout)

// foo.on('something', async () => {
//   await sleep(100)
//   // You can catch and forward the error to the
//   // event emitter yourself...
//   try {
//     functionThatDoesNotExist()
//   } catch (err) {
//     // Escape the Promise error handling trap!
//     process.nextTick(() => foo.emit('error', err))
//   }
// })
//
// foo.on('error', (err) => {
//   throw new Error('boom')
// })
//
// process.on('uncaughtException', (err) => {
//   console.log(err.message)
// })
//
// foo.emit('something')

async function run () {
  await once(foo, 'something')
  await sleep(100)
  functionThatDoesNotExist()
}

run().catch(console.log)

foo.emit('something')
