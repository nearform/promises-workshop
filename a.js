// new Promise((resolve) => {
//   console.log('hello')
//   resolve()
// }).then(() => { console.log('then') })

async function foo () {
  console.log('hello')
  await 42
  console.log('then')
}

foo()

console.log('world')
