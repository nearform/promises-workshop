// node index.js [maxQueue]
// example: node index.js
//   defaults to 100
// example: node index.js 100
// example: node index.js 500

import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import csv from 'csvtojson'
import Pool from 'piscina'
import { performance, PerformanceObserver } from 'perf_hooks'
import Progress from './progress.mjs'

const p = new PerformanceObserver((entries) => {
  console.log(entries.getEntries()[0].duration)
})
p.observe({ entryTypes: ['measure'] })

const maxQueue = Math.max(parseInt(process.argv[2] || 100), 50)

const pool = new Pool({
  filename: resolve(dirname(fileURLToPath(import.meta.url)), 'worker.js'),
  maxQueue
})

const stream = csv().fromFile('./data.csv')

pool.on('drain', () => {
  if (stream.isPaused()) {
    console.log('resuming...', pool.queueSize)
    stream.resume()
  }
})

const progress = new Progress()
progress.on('finished', () => {
  console.log(progress.message)
})

performance.mark('A')
stream
  .on('data', (data) => {
    const line = data.toString('utf8')
    progress.incSubmitted()
    pool.runTask(line)
      .then(() => {
        progress.incCompleted()
      })
      .catch((err) => {
        progress.incFailed()
        stream.destroy(err)
      })
    if (pool.queueSize === maxQueue) {
      console.log('pausing...', pool.queueSize, pool.utilization)
      stream.pause()
    }
  })
  .on('error', (err) => {
    console.log(err.message)
    console.log('run: `node generate.mjs` to generate the sample data')
  })
  .on('end', () => {
    // We are done submitting tasks
    progress.done()
    performance.mark('B')
    performance.measure('A to B', 'A', 'B')
  })

process.on('exit', () => {
  console.log('Mean Wait Time:', pool.waitTime.mean, 'ms')
  console.log('Mean Run Time:', pool.runTime.mean, 'ms')
})
