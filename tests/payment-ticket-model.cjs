const { execFileSync } = require('node:child_process')
const assert = require('node:assert/strict')
const { test } = require('node:test')
const { mkdirSync } = require('node:fs')
mkdirSync('.artifacts', { recursive: true })
execFileSync('node_modules/.bin/esbuild', ['.vitepress/theme/payment-ticket/ticket.model.ts', '--bundle', '--platform=node', '--format=cjs', '--outfile=.artifacts/payment-ticket-model.cjs'])
const m = require('../.artifacts/payment-ticket-model.cjs')

const base = {
  id: 'x',
  status: 'paid',
  reference: 'TK-1',
  amount: { minor: 4820, currency: 'USD' },
  paidAt: '2026-03-14T18:40:00Z',
  method: null,
}

test('null minor differs from zero', () => {
  assert.equal(m.formatMoney(null, 'USD'), 'n/a')
  assert.equal(m.formatMoney(0, 'USD'), '$0.00')
})

test('CLP and JPY fraction digits', () => {
  assert.equal(m.formatMoney(10000, 'CLP'), 'CLP\xa010,000')
  assert.equal(m.formatMoney(1000, 'JPY'), '¥1,000')
})

test('reject invalid minors', () => {
  for (const minor of [NaN, -1, 1.5]) {
    assert(m.validate({ ...base, amount: { minor, currency: 'USD' } }).length)
  }
})

test('invalid date and timezone fallback', () => {
  assert.equal(m.formatPaidAt('2026-03-14'), 'n/a')
  assert.equal(m.formatPaidAt(null), 'n/a')
  assert.match(m.formatPaidAt('2026-03-14T18:40:00Z', 'UTC'), /Mar 2026/)
  assert.match(m.formatPaidAt('2026-03-14T18:40:00Z', 'Not/AZone'), /Mar 2026/)
})

test('barcode deterministic', () => {
  const a = m.barcodeBars('TK-7316-2048-55')
  const b = m.barcodeBars('TK-7316-2048-55')
  assert.deepEqual(a, b)
  assert.ok(a.bars.length > 5)
})

test('barcode digits', () => {
  assert.deepEqual(m.barcodeDigits('TK-7316-2048-55'), ['7', '316204', '855'])
  assert.deepEqual(m.barcodeDigits('abc'), ['0', '', ''])
})

test('validate errors', () => {
  assert.deepEqual(m.validate({ ...base, reference: '' }), ['missing reference'])
  assert(m.validate({ ...base, status: 'bogus' }).length)
})