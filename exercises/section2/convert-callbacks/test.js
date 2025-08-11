const { spawnSync } = require('child_process')
const { resolve } = require('path')
const {test} = require('node:test')

const first = resolve(process.cwd(), 'before.js')
const second = resolve(process.cwd(), process.argv[2])

test('The output should be identical', async t => {
  const before = spawnSync(process.execPath, [first])
  const after = spawnSync(process.execPath, [second])
  t.assert.deepStrictEqual(before.stdout, after.stdout)
})
