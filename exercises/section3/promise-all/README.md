## promise-all

The server in `first.js` has a problem: the latency for its main route is too high.
You can execute a benchmark with `npx autocannon -c 100 -d 5 localhost:3000` after starting the server.
Your goal is to optimize this file without changing the `fetch` function.

## Hint

Try use `Promise.all` to parallelize the calls to `fetch()`. Why does it not generate the _promised_ results?

Check out the [`p-map`](https://www.npmjs.com/package/p-map) module and its concurrency option.
