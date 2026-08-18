'use strict';

// node index [maxQueue]
// example: node index
//   defaults to 100
// example: node index 100
// example: node index 500

const { resolve } = require('path');
const csv = require('csvtojson');
const Pool = require('piscina');
const { performance, PerformanceObserver } = require('perf_hooks');
const Progress = require('./progress');

const p = new PerformanceObserver((entries) => {
  console.log(entries.getEntries()[0].duration);
});
p.observe({ entryTypes: ['measure'] });

const maxQueue = Math.max(parseInt(process.argv[2] || 100), 50);

const pool = new Pool({
  filename: resolve(__dirname, 'worker.js'),
  maxQueue
});

const stream = csv().fromFile('./data.csv');

// piscina 5 redefined 'drain': it is now emitted when the pool drops below
// maxCapacity (maxThreads * concurrentTasksPerWorker) and only after a preceding
// 'needsDrain', not when the task queue empties as it did in piscina 4. Relying on
// it here deadlocked the stream — it paused once and was never resumed — so the
// queue-empty condition this exercise actually wants is checked directly.
function resumeIfDrained() {
  if (stream.isPaused() && pool.queueSize === 0) {
    console.log('resuming...', pool.queueSize);
    stream.resume();
  }
}

const progress = new Progress();
progress.on('finished', () => {
  console.log(progress.message);
});

performance.mark('A');
stream
  .on('data', (data) => {
    const line = data.toString('utf8');
    progress.incSubmitted();
    pool.run(line)
      .then(() => {
        progress.incCompleted();
        resumeIfDrained();
      })
      .catch((err) => {
        progress.incFailed();
        stream.destroy(err);
      });
    // `>=`, not `===`: the queue can jump past maxQueue inside a single
    // synchronous burst of 'data' events and the exact value would be missed.
    if (pool.queueSize >= maxQueue) {
      console.log('pausing...', pool.queueSize, pool.utilization);
      stream.pause();
    }
  })
  .on('error', (err) => {
    console.log(err.message);
    console.log('run: `node generate` to generate the sample data');
  })
  .on('end', () => {
    // We are done submitting tasks
    progress.done();
    performance.mark('B');
    performance.measure('A to B', 'A', 'B');
  });

process.on('exit', () => {
  console.log('Mean Wait Time:', pool.histogram.waitTime.mean, 'ms');
  console.log('Mean Run Time:', pool.histogram.runTime.mean, 'ms');
});
