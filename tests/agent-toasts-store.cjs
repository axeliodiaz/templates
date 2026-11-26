const { execFileSync } = require('node:child_process')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { mkdirSync } = require('node:fs')
mkdirSync('.artifacts', { recursive: true })
execFileSync('node_modules/.bin/esbuild', [
  '.vitepress/theme/agent-toasts/toast.model.ts',
  '--bundle',
  '--platform=node',
  '--format=cjs',
  '--outfile=.artifacts/agent-toasts-model.cjs',
])
execFileSync('node_modules/.bin/esbuild', [
  '.vitepress/theme/agent-toasts/toast.store.ts',
  '--bundle',
  '--platform=node',
  '--format=cjs',
  '--outfile=.artifacts/agent-toasts-store.cjs',
])
const { createToastStore } = require('../.artifacts/agent-toasts-store.cjs')
const m = require('../.artifacts/agent-toasts-model.cjs')

const visual = { type: 'diff', added: 1, removed: 0 }

test('pause keeps remaining time and resume honors min 2s', () => {
  const store = createToastStore()
  store.push({ tone: 'success', title: 'a', visual })
  const t0 = Date.now()
  store.pause('hover')
  const wait = 1500
  const start = Date.now()
  while (Date.now() - start < wait) {}
  store.resume('hover')
  assert.ok(Date.now() - t0 >= wait)
  store.dispose()
})

test('composed pause: hover resume does not thaw while expanded', () => {
  const store = createToastStore()
  store.push({ tone: 'success', title: 'b', visual })
  store.pause('expanded')
  store.pause('hover')
  store.resume('hover')
  assert.ok(store.pauseReasons.has('expanded'))
  store.resume('expanded')
  store.dispose()
})

test('dedupe push does not require duplicate stack entry', () => {
  let s = { items: [], queue: [], max: 6 }
  const data = { tone: 'success', title: 'dup', visual }
  s = m.reduce(s, { type: 'push', data, now: 1000 })
  s = m.reduce(s, { type: 'push', data, now: 1500 })
  assert.equal(s.items.length, 1)
  assert.ok(s.items[0].dedupeAt === 1500)
})

test('FIFO queue drains on dismiss', () => {
  const store = createToastStore()
  const base = i => ({
    tone: 'success',
    title: `t${i}`,
    visual,
    action: { id: 'c', label: 'Compact' },
  })
  for (let i = 0; i < 7; i++) store.push(base(i))
  assert.equal(store.queueCount(), 1)
  const first = store.state.items[0]
  store.dismiss(first.data.id ?? first.key)
  assert.equal(store.queueCount(), 0)
  assert.equal(store.state.items.length, 6)
  store.dispose()
})