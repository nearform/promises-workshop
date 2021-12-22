import { createServer } from 'http'
import { on } from 'events'

const server = createServer()
server.listen(8000)

async function main () {
  for await (const [, response] of on(server, 'request')) {
    response.end('hello world')
  }
}

main()
