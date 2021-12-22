import Bluebird from 'bluebird'

Bluebird.resolve('hello from bluebird').then(console.log)
Promise.resolve('native promise').then(console.log)
process.nextTick(console.log, 'hello from nextTick')
