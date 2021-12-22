import EventEmitter from 'events'
import { promisify } from 'util'

const foo = new EventEmitter()
const sleep = promisify(setTimeout)

// But what happens when something fails?
// How can you handle the error?

foo.on('something', async () => {
  await sleep(100)
  functionThatDoesNotExist()
})

foo.emit('something')
