// The challenge: This code prints a message to the console. Without
// running the code, can you determine what it prints?
//
// The key here is reason about how Node.js and V8 use scheduling
// to detemine when JavaScript will execute.

const { promisify } = require('util');
const {
  Worker,
  isMainThread,
  workerData,
  parentPort
} = require('worker_threads');

const sleep = promisify(setTimeout);

async function bar(n, s, t) {
  setImmediate(() => process.stdout.write(s));
  await sleep(n);
  return t;
}

process.on('unhandledRejection', (err) => {
  process.stdout.write(err.message);
});

if (isMainThread) {
  const lock = new Int32Array(new SharedArrayBuffer(4));
  const worker = new Worker(__filename, { workerData: lock });
  worker.postMessage('S');
  worker.on('exit', async () => {
    try {
      const items = ['U', 'F']
      const p = Promise.reject(items);
      p.catch((items) => process.stdout.write(items[items.length-1]));
      p.then(() => process.stdout.write('P'))
       .catch((items) => process.stdout.write(items.shift()));
      throw new Error('D');
    } finally {
      process.stdout.write(' ');
      throw new Error('N');
    }
  });

  async function foo() {
    process.stdout.write('O');
    for (const m of await Promise.all([bar(20, 'R', 'M'), bar(10, 'O', 'I')]))
      process.stdout.write(m)
  }

  sleep(50).then(() => process.stdout.write('S'));

  new Promise((res) => {
    process.stdout.write('B');
    res('E');
  }).then((m) => process.stdout.write(m))
    .finally(() => process.stdout.write(' '));

  queueMicrotask(() => process.stdout.write('N'));

  process.nextTick(() => process.stdout.write('K'));

  setTimeout(() => {
    process.stdout.write('E');
    lock[0] = 1;
    Atomics.notify(lock, 0, 1);
  }, 100);

  setImmediate(() => process.stdout.write('P'));

  process.stdout.write('R');

  foo();
} else {
  parentPort.on('message', (value) => {
    Atomics.wait(workerData, 0, 0);
    process.stdout.write(value);
    parentPort.close();
  });
}
