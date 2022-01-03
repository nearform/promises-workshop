import { spawnSync } from 'child_process'
import { resolve } from 'path'
import t from 'tap'

const first = resolve(process.cwd(), 'before.js')
const second = resolve(process.cwd(), process.argv[2])

t.test('The output should be identical', async ({ same }) => {
  const before = spawnSync(process.execPath, [first])
  const after = spawnSync(process.execPath, [second])
  same(before.stdout, after.stdout)
})
