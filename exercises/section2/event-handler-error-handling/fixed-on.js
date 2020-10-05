const { EventEmitter, on } = require('events')
const { promisify } = require('util')

const foo = new EventEmitter()
const sleep = promisify(setTimeout)


async function run () {
  for await (let ev of on(foo, 'something')) {
    await sleep(100)
    functionThatDoesNotExist()
  }
}

run().catch(console.log)

foo.emit('something')
