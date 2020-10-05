
const p = Promise.resolve()
  .then(() => console.log('then 1'))
  .finally(() => console.log('finally 1'))

p.then(() => console.log('then 2'))
 .finally(() => console.log('finally 2'))

p.then(() => console.log('then 3'))
 .finally(() => console.log('finally 3'))

p.finally(() => console.log('finally 4'))

;(async () => {
  console.log('async 1')
  await p
  console.log('async 2')
})()


