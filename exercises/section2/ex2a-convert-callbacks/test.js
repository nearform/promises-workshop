const { spawnSync } = require('child_process')
const { resolve } = require('path')
const t = require('tap')

const first = resolve(process.cwd(), 'before.js')
const second = resolve(process.cwd(), process.argv[2])

t.test('The output should be identical', async ({ same }) => {
  const before = spawnSync(process.execPath, [first])
  const after = spawnSync(process.execPath, [second])
  same(before.stdout, after.stdout)
})
