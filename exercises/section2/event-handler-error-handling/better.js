const EventEmitter = require('events')
const { promisify } = require('util')

const foo = new EventEmitter()
const sleep = promisify(setTimeout)

foo.on('something', async () => {
  await sleep(100)
  // You can catch and forward the error to the
  // event emitter yourself...
  try {
    functionThatDoesNotExist()
  } catch (err) {
    foo.emit('error', err)
  }
})

foo.on('error', (err) => {
  console.log(err.message)
})

foo.emit('something')
