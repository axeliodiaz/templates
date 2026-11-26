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
const m = require('../.artifacts/agent-toasts-model.cjs')

test('durationFor cases', () => {
  assert.equal(m.durationFor({ tone: 'success', title: 'x', visual: { type: 'diff', added: 1, removed: 0 } }), 6000)
  assert.equal(m.durationFor({ tone: 'danger', title: 'x', visual: { type: 'diff', added: 1, removed: 0 } }), 10000)
  assert.equal(
    m.durationFor({ tone: 'danger', title: 'x', visual: { type: 'diff', added: 1, removed: 0 }, action: { id: 'r', label: 'Retry' } }),
    null,
  )
  assert.equal(m.durationFor({ tone: 'info', title: 'x', visual: { type: 'diff', added: 1, removed: 0 }, busy: true }), null)
})

test('dedupeKey and sanitize', () => {
  assert.equal(m.dedupeKey({ tone: 'success', title: 'A', visual: { type: 'diff', added: 0, removed: 0 } }), 'success|A|')
  assert.equal(m.sanitize({ tone: 'success', title: '', visual: { type: 'diff', added: 1, removed: 0 } }), null)
})

test('reduce stack', () => {
  let s = { items: [], queue: [], max: 6 }
  const base = i => ({
    tone: 'success',
    title: `t${i}`,
    visual: { type: 'diff', added: i, removed: 0 },
    action: { id: 'c', label: 'Compact' },
  })
  for (let i = 0; i < 6; i++) s = m.reduce(s, { type: 'push', data: base(i), now: 1000 + i })
  s = m.reduce(s, {
    type: 'push',
    data: { tone: 'warning', title: 'w', visual: { type: 'context', used: 1, total: 10 }, action: { id: 'c', label: 'Compact' } },
    now: 3000,
  })
  assert.equal(s.queue.length, 1)
  const dropId = s.items[0].key
  s = m.reduce(s, { type: 'dismiss', id: dropId, reason: 'close' })
  assert.equal(s.queue.length, 0)
  assert.equal(s.items.length, 6)
  assert.equal(s.items[s.items.length - 1].data.title, 'w')
})

test('update in place keeps order', () => {
  let s = { items: [], queue: [], max: 6 }
  s = m.reduce(s, { type: 'push', data: { id: 'd', tone: 'danger', title: 'fail', visual: { type: 'pipeline', steps: ['failed', 'pending', 'pending'] }, action: { id: 'r', label: 'Retry' } }, now: 1 })
  s = m.reduce(s, { type: 'push', data: { tone: 'success', title: 'ok', visual: { type: 'diff', added: 1, removed: 0 } }, now: 2 })
  const firstKey = s.items[0].key
  s = m.reduce(s, { type: 'update', id: 'd', data: { id: 'd', tone: 'info', title: 'busy', visual: { type: 'pipeline', steps: ['active', 'pending', 'pending'] }, busy: true } })
  assert.equal(s.items[0].key, firstKey)
})

test('altText and cells deterministic', () => {
  const v = { type: 'diff', added: 96, removed: 24 }
  const a = m.cells(v)
  const b = m.cells(v)
  assert.deepEqual(a, b)
  assert.match(m.altText(v), /96/)
})

test('announceText politeness', () => {
  const polite = m.announceText({ tone: 'success', title: 'Tests passed', visual: { type: 'tests', total: 48, passed: 48 } })
  assert.equal(polite.politeness, 'polite')
  const assertive = m.announceText({
    tone: 'danger',
    title: 'Deploy failed',
    visual: { type: 'pipeline', steps: ['done', 'failed', 'pending'] },
    action: { id: 'r', label: 'Retry' },
  })
  assert.equal(assertive.politeness, 'assertive')
})