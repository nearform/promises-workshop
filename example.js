new Promise(async function (resolve, reject) {
  throw new Error('kaboom')
}).catch(console.log)
