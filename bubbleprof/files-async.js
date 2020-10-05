const http = require('http')
const { readFile } = require('fs').promises
// const { promisify } = require('util')
// const readFile = promisify(fs.readFile)

async function handle (req, res) {
  const a = await readFile(__filename)
  const b = await readFile(__filename)
  const c = await readFile(__filename)


  res.end(Buffer.concat([a, b, c]))
}

http.createServer(function (req, res) {
  handle(req, res).catch((err) => {
    console.error(err)
    res.statusCode = 500
    res.end('kaboom')
  })
}).listen(3000)
