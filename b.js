
const p1 = Promise.reject(new Error('kaboom'))

const p2 = p1.then(() => {})
const p3 = p1.then(() => {})

// console.log(p1 === p2)
// console.log(p1 === p3)
// console.log(p2 === p3)
 
