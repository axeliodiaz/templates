const { execFileSync } = require('node:child_process')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { mkdirSync } = require('node:fs')
mkdirSync('.artifacts', { recursive: true })
execFileSync('node_modules/.bin/esbuild', ['.vitepress/theme/agent-crew/crew.model.ts', '--bundle', '--platform=node', '--format=cjs', '--outfile=.artifacts/agent-crew-model.cjs'])
const m = require('../.artifacts/agent-crew-model.cjs')
function agent(id, overrides = {}) {
  return { id, name: id, model: null, hue: 'c1', status: 'idle', activity: '', context: { used: null, limit: null }, tools: [], ...overrides }
}
function fixture() {
  return agent('lead', { status: 'working', children: [agent('researcher', { children: [agent('search')] }), agent('coder', { status: 'needs_you', children: [agent('linter'), agent('tests')] })] })
}
test('preorder normalization and counts preserve source order without changing source', () => {
  const root = fixture(), before = JSON.stringify(root)
  assert.deepEqual(m.validate(root), [])
  assert.deepEqual(m.normalize(root).map(n => n.id), ['lead', 'researcher', 'search', 'coder', 'linter', 'tests'])
  assert.deepEqual(m.counts(root), { working: 1, needsYou: 1, agents: 6 })
  assert.equal(JSON.stringify(root), before)
})
test('unknown context differs from real zero', () => {
  assert.equal(m.formatContext({ used: null, limit: 200000 }), 'n/a')
  assert.equal(m.formatContext({ used: 0, limit: 200000 }), '0 / 200k')
  assert.equal(m.contextLevel({ used: 0, limit: 200000 }).ratio, 0)
  assert.equal(m.formatContext({ used: 136000, limit: 200000 }), '136k / 200k')
  assert.equal(m.formatTokens(null), 'n/a'); assert.equal(m.formatTokens(0), '0')
})
test('context clamps finite ratios and follows exact level thresholds', () => {
  for (const [used, ratio, level] of [[-1, 0, 'work'], [79, .79, 'work'], [80, .8, 'late'], [94, .94, 'late'], [95, .95, 'over'], [200, 1, 'over']]) {
    assert.deepEqual(m.contextLevel({ used, limit: 100 }), { ratio, level })
  }
})
test('context rejects nonfinite or invalid denominators', () => {
  for (const value of [NaN, Infinity, -Infinity, null]) {
    assert.deepEqual(m.contextLevel({ used: value, limit: 100 }), { ratio: null, level: null })
  }
  for (const value of [NaN, Infinity, -Infinity, null, 0, -1]) {
    assert.deepEqual(m.contextLevel({ used: 10, limit: value }), { ratio: null, level: null })
  }
})
test('cost distinguishes missing, zero, tiny amounts, and invalid costs', () => {
  assert.equal(m.formatCost(null), 'n/a'); assert.equal(m.formatCost(0), '$0.00')
  assert.equal(m.formatCost(.52), '$0.52'); assert.equal(m.formatCost(.0049), '<$0.01')
  assert.equal(m.formatCost(.005), '$0.01')
  for (const value of [NaN, Infinity, -Infinity, -1]) assert.equal(m.formatCost(value), null)
})
test('time formats future, seconds, minutes, hours and days', () => {
  const start = Date.parse('2026-11-17T12:00:00Z')
  for (const [seconds, expected] of [[-10, '0s'], [10, '10s'], [252, '4m 12s'], [11100, '3h 05m'], [259200, '3d 0h']]) {
    assert.equal(m.formatDuration({ status: 'working', startedAt: new Date(start).toISOString() }, start + seconds * 1000), expected)
  }
  assert.equal(m.formatDuration({ status: 'working', startedAt: 'bad' }, start), 'n/a')
  assert.equal(m.formatDuration({ status: 'working', startedAt: new Date(start).toISOString() }, NaN), 'n/a')
})
test('nonworking duration needs an observed end and stays fixed', () => {
  const value = { status: 'done', startedAt: '2026-11-17T12:00:00Z', endedAt: '2026-11-17T12:01:00Z' }
  assert.equal(m.formatDuration(value, 0), '1m 0s')
  assert.equal(m.formatDuration({ ...value, endedAt: null }, 0), 'n/a')
})
test('duplicate ids reject even when separate objects or shared references', () => {
  const root = agent('lead', { children: [agent('x'), agent('x')] })
  assert(m.validate(root).includes('Invalid crew data: duplicate id "x"'))
  assert.throws(() => m.normalize(root), /duplicate id/)
  const shared = agent('shared')
  assert(m.validate(agent('lead', { children: [shared, shared] })).some(e => e.includes('duplicate id')))
})
test('cycles terminate with an error, not recursion overflow', () => {
  const root = fixture(); root.children[0].children.push(root)
  assert(m.validate(root).includes('Invalid crew data: hierarchy cycle'))
  assert.throws(() => m.handoffPath(root, 'lead', 'coder'), /cycle/)
})
test('malformed trees return errors', () => {
  for (const root of [null, [], {}, agent('x', { children: {} }), agent('x', { status: 'bogus' }), agent('x', { context: null }), agent('x', { tools: [{}] })]) assert(m.validate(root).length > 0)
})
test('deep valid trees are iterative', () => {
  let root = agent('0'); const first = root
  for (let i = 1; i < 5000; i++) { const child = agent(String(i)); root.children = [child]; root = child }
  assert.equal(m.normalize(first).length, 5000)
})
test('handoff crosses the common ancestor and supports root/same/missing endpoints', () => {
  const root = fixture()
  assert.deepEqual(m.handoffPath(root, 'search', 'tests'), ['search', 'researcher', 'lead', 'coder', 'tests'])
  assert.deepEqual(m.handoffPath(root, 'lead', 'linter'), ['lead', 'coder', 'linter'])
  assert.deepEqual(m.handoffPath(root, 'tests', 'coder'), ['tests', 'coder'])
  assert.deepEqual(m.handoffPath(root, 'coder', 'coder'), ['coder'])
  assert.deepEqual(m.handoffPath(root, 'missing', 'coder'), [])
})

test('formatting never rounds up token capacity or shows a negative context', () => {
  assert.equal(m.formatTokens(999500), '999k')
  assert.equal(m.formatTokens(1999), '1k')
  assert.equal(m.formatContext({ used: -1, limit: 200000 }), '0 / 200k')
  assert.equal(m.formatContext({ used: 999500, limit: 1000000 }), '999k / 1000k')
})
