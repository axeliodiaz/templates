#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const themeDir = path.join(root, '.vitepress/theme')

const MARGIN_17 =
  "  margin: ['#f5f5f7', '#fff', '#22252b', '#676e7b', '#e0e3e9', '#6389ea', '#0f1528', '#198754', '#dc3545', '#eceef5', 'system-ui,-apple-system,sans-serif', '12px', '#6389ea', '#b77900', '#8aa8f0', '#c4c9d4', '#9aa3b0'],"
const MARGIN_13 =
  "  margin: ['#f5f5f7', '#fff', '#22252b', '#676e7b', '#e0e3e9', '#6389ea', '#0f1528', '#198754', '#dc3545', '#b77900', 'system-ui,-apple-system,sans-serif', '12px', '#eceef5'],"
const MARGIN_GAUGE =
  "  margin: ['#f5f5f7', '#fff', '#22252b', '#676e7b', '#e0e3e9', '#6389ea', '#198754', '#b77900', '#dc3545', 'system-ui,-apple-system,sans-serif', '12px', '#0f1528'],"

const DASH_17 = [
  'WasteDashboard.vue',
  'WorkflowOps.vue',
  'SalesDash.vue',
  'ShadcnBlocks.vue',
  'OrderView.vue',
  'ProjectDash.vue',
  'QanunLog.vue',
  'ForecastDash.vue',
  'ClearbillDash.vue',
]
const DASH_13 = ['OpsDashboard.vue']

function insertAfterPulsefit(file, marginLine) {
  let text = fs.readFileSync(file, 'utf8')
  if (text.includes('margin: [')) {
    console.log('skip (has margin)', path.basename(file))
    return
  }
  const re = /(\n\s+pulsefit: \[[^\]]+\],)/
  if (!re.test(text)) {
    console.warn('no pulsefit', path.basename(file))
    return
  }
  text = text.replace(re, `$1\n${marginLine}`)
  fs.writeFileSync(file, text)
  console.log('patched', path.basename(file))
}

for (const f of DASH_17) insertAfterPulsefit(path.join(themeDir, f), MARGIN_17)
for (const f of DASH_13) insertAfterPulsefit(path.join(themeDir, f), MARGIN_13)
insertAfterPulsefit(path.join(themeDir, 'GaugeLab.vue'), MARGIN_GAUGE)

const wp = path.join(themeDir, 'WorkflowProgress.vue')
let wpt = fs.readFileSync(wp, 'utf8')
if (!wpt.includes('margin:')) {
  wpt = wpt.replace(
    /(\n\s+pulsefit:\s+\{[^}]+\},)/,
    `$1\n  margin:     { bg: '#f5f5f7', surf: '#fff', ink: '#22252b', mut: '#676e7b', line: '#e0e3e9', acc: '#6389ea', onAcc: '#0f1528', warn: '#b77900', font: 'system-ui,-apple-system,sans-serif', r: '12px' },`,
  )
  fs.writeFileSync(wp, wpt)
  console.log('patched WorkflowProgress.vue')
}