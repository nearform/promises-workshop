'use strict';

// node index [maxQueue]
// example: node index
//   defaults to 100
// example: node index 100
// example: node index 500

const { resolve } = require('path');
const csv = require('csvtojson');
const { performance, PerformanceObserver } = require('perf_hooks');
const Progress = require('./progress');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

const p = new PerformanceObserver((entries) => {
  console.log(entries.getEntries()[0].duration);
});
p.observe({ entryTypes: ['measure'] });

const maxQueue = Math.max(parseInt(process.argv[2] || 100), 50);

const stream = csv().fromFile('./data.csv');

let tasks = new Set()

function maybeDrained() {
  if (tasks.size > 0)
    return;
  if (stream.isPaused()) {
    console.log('resuming...');
    stream.resume();
  }
};

const progress = new Progress();
progress.on('finished', () => {
  console.log(progress.message);
});

async function runTask(line) {
  // Simulate an expensive async processing task
  await sleep(100);
  return line;
}

performance.mark('A');
stream
  .on('data', (data) => {
    const line = data.toString('utf8');
    progress.incSubmitted();
    const p =
      runTask(line)
        .then(() => {
          progress.incCompleted();
        })
        .catch((err) => {
          progress.incFailed();
          stream.destroy(err);
        })
        .finally(() => {
          tasks.delete(p);
          maybeDrained();
        });
    tasks.add(p);
    if (tasks.size === maxQueue) {
      console.log('pausing...');
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
