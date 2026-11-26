#!/usr/bin/env node
/**
 * Builds margin-bs6-copy.ts from generic demos, forms/content maps, and catalog l-demo excerpts.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MARGIN_BS6_IA, COMPONENT_CATALOG_ALIASES } from './margin-bs6-ia.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = path.join(root, '.vitepress/theme/MarginBs6Catalog.vue')
const catalog = fs.readFileSync(catalogPath, 'utf8')
const genericPath = path.join(root, '.vitepress/theme/margin-bs6-generic-demos.ts')
const genericSrc = fs.readFileSync(genericPath, 'utf8')

const FORM_COPY = {
  overview: `<label class="form-label" for="mg-overview-name">Workspace</label>
<input id="mg-overview-name" class="form-control" placeholder="Northstar demo" />`,
  'form-control': `<label class="form-label" for="mg-fc">Job reference</label>
<input id="mg-fc" class="form-control" type="text" autocomplete="off" />
<textarea id="mg-fc-ta" class="form-control" rows="2" placeholder="Notes"></textarea>`,
  field: `<div class="field">
  <label class="form-label" for="mg-field">Cost center</label>
  <input id="mg-field" class="form-control" value="OPS-441" />
</div>`,
  'form-adorn': `<div class="input-group">
  <input class="form-control" type="number" value="32" aria-describedby="mg-adorn-suffix" />
  <span id="mg-adorn-suffix" class="input-group-text">%</span>
</div>`,
  combobox: `<input class="form-control" list="mg-vendors" placeholder="Type to filter…" />
<datalist id="mg-vendors"><option value="Northwind supplies" /></datalist>`,
  switch: `<div class="form-switch">
  <input id="mg-sw" class="form-check-input" type="checkbox" role="switch" checked />
  <label class="form-check-label" for="mg-sw">Include tax in margin</label>
</div>`,
  checkbox: `<div class="form-check">
  <input class="form-check-input" type="checkbox" id="mg-chk" checked />
  <label class="form-check-label" for="mg-chk">Email weekly summary</label>
</div>`,
  radio: `<div class="form-check">
  <input class="form-check-input" type="radio" name="mg-density" id="mg-r1" checked />
  <label class="form-check-label" for="mg-r1">Comfortable</label>
</div>`,
  range: `<label class="form-label" for="mg-range">Threshold</label>
<input id="mg-range" class="form-range" type="range" min="0" max="100" value="64" />`,
  'input-group': `<div class="input-group">
  <span class="input-group-text">$</span>
  <input class="form-control" type="number" value="1200" />
  <button type="button" class="btn btn-outline theme-secondary">Apply</button>
</div>`,
  'floating-labels': `<div class="form-floating">
  <input id="mg-float" class="form-control" placeholder="Branch" value="Austin hub" />
  <label for="mg-float">Branch</label>
</div>`,
  layout: `<div class="row g-2">
  <div class="col-md-6"><input class="form-control" type="date" aria-label="From" /></div>
  <div class="col-md-6"><input class="form-control" type="date" aria-label="To" /></div>
</div>`,
  validation: `<input class="form-control is-invalid" aria-invalid="true" aria-describedby="mg-val-hint" />
<div id="mg-val-hint" class="invalid-feedback">Enter a project name.</div>`,
  datepicker: `<label class="form-label" for="mg-dp">Close date</label>
<input id="mg-dp" class="form-control" type="date" value="2026-11-26" />`,
  'otp-input': `<div class="d-flex gap-2" role="group" aria-label="Verification code">
  <input class="form-control text-center" inputmode="numeric" maxlength="1" aria-label="Digit 1" />
  <input class="form-control text-center" inputmode="numeric" maxlength="1" aria-label="Digit 2" />
  <input class="form-control text-center" inputmode="numeric" maxlength="1" aria-label="Digit 3" />
</div>`,
  'password-strength': `<input class="form-control" type="password" value="Margin-demo" />
<div class="progress mt-2" role="progressbar" aria-valuenow="60"><div class="progress-bar" style="width:60%">Medium</div></div>`,
}

const CONTENT_COPY = {
  reboot: `<h1>Profit review</h1>
<p>Margin uses Bootstrap Reboot inside <code>.lab</code>.</p>`,
  typography: `<p class="display-6">Display headline</p>
<p class="lead">Lead paragraph for KPI deltas.</p>`,
  images: `<svg class="img-fluid rounded border" viewBox="0 0 320 140" role="img" aria-label="Sample figure"></svg>`,
  'tables-figures': `<table class="table table-striped"><thead><tr><th scope="col">Job</th><th scope="col">Margin</th></tr></thead><tbody><tr><th scope="row">#5812</th><td>12.4%</td></tr></tbody></table>`,
  tables: `<table class="table table-striped"><thead><tr><th scope="col">Job</th><th scope="col">Margin</th></tr></thead><tbody><tr><th scope="row">#5812</th><td>12.4%</td></tr></tbody></table>`,
  prose: `<article><h3>Margin narrative</h3><p>Prose blocks use rebooted heading styles inside <code>.lab</code>.</p></article>`,
}

const CUSTOMIZE_COLOR = `.lab {
  --bg: #f5f5f7;
  --surface: #fff;
  --ink: #22252b;
  --muted: #676e7b;
  --line: #e0e3e9;
  --soft: #eceef5;
  --accent: #6389ea;
}
.lab-dark {
  --bg: #181b22;
  --surface: #242833;
  --ink: #f1f3f8;
  --muted: #aab3c3;
  --line: #404757;
  --soft: #303747;
}`

const COMPONENT_STATIC = {
  chips: `<div class="l-demo l-actions"><span class="l-chip">Draft</span><span class="l-chip l-chip-success">Ready</span><span class="l-chip l-chip-warn">Running</span></div>`,
  'nav-overflow': `<nav class="l-tabs" aria-label="Overflow nav"><button type="button" aria-pressed="true">Overview</button><button type="button">Activity</button><button type="button">Settings</button><button type="button" class="l-nav-more" aria-label="More sections">⋯</button></nav>`,
  toggler: `<div class="l-demo"><button type="button" class="btn btn-outline theme-secondary" aria-expanded="false" aria-controls="mg-collapse">Toggle section</button><div id="mg-collapse" hidden>Collapsed content region.</div></div>`,
  accordion: `<div class="l-demo">
  <div class="l-accordion">
    <button type="button" aria-expanded="true">Tokens <span aria-hidden="true">−</span></button>
    <p>Use the shared color, type and spacing tokens.</p>
  </div>
  <div class="l-accordion">
    <button type="button" aria-expanded="false">Behavior <span aria-hidden="true">+</span></button>
  </div>
  <div class="l-accordion">
    <button type="button" aria-expanded="false">Accessibility <span aria-hidden="true">+</span></button>
  </div>
</div>`,
  alert: `<div class="l-demo">
  <div class="alert theme-warning d-flex align-items-start gap-2" role="alert">
    <div><strong>Needs attention</strong><p>Two checks are waiting for a review.</p></div>
    <button type="button" class="l-icon-btn" aria-label="Dismiss notification">×</button>
  </div>
  <div class="alert theme-success"><div><strong>Saved</strong><p>Your changes are up to date.</p></div></div>
</div>`,
}

function decodeEntities(s) {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\\n/g, '\n')
}

function vueToStatic(html) {
  return html
    .replace(/<Transition[^>]*>/g, '')
    .replace(/<\/Transition>/g, '')
    .replace(/\s+v-[a-z-]+="[^"]*"/gi, '')
    .replace(/\s+@[a-z.]+="[^"]*"/gi, '')
    .replace(/\s+:[a-z-]+="[^"]*"/gi, '')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/\s+v-else\b/g, '')
    .replace(/>\s+</g, '>\n<')
    .trim()
}

function extractCatalogDemo(sectionId, slug) {
  if (COMPONENT_STATIC[slug]) return COMPONENT_STATIC[slug]
  const secRe = new RegExp(`<section id="${sectionId}"[\\s\\S]*?</section>`, 'i')
  const sec = catalog.match(secRe)
  if (!sec) return null
  const m = sec[0].match(/<div class="l-demo[^"]*">([\s\S]*?)<\/div>/)
  if (!m) return null
  return vueToStatic(m[1])
}

function extractGeneric(key) {
  const re = new RegExp(`'${key.replace(/\//g, '\\/')}': \`([\\s\\S]*?)\``,)
  const m = genericSrc.match(re)
  if (m) return m[1].trim()
  const [area, slug] = key.split('/')
  if (area === 'utilities') {
    const esc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const util = new RegExp(`(?:'${esc}'|${esc}): \`([\\s\\S]*?)\``,)
    const u = genericSrc.match(util)
    if (u) return u[1].trim()
  }
  return null
}

const copies = {}

for (const [key, block] of Object.entries(MARGIN_BS6_IA)) {
  const area = key === 'gettingStarted' ? 'getting-started' : key
  for (const [slug] of block.pages) {
    const routeKey = `${area}/${slug}`
    if (area === 'customize' && slug === 'color') {
      copies[routeKey] = CUSTOMIZE_COLOR
      continue
    }
    if (area === 'customize' && slug === 'color-modes') {
      copies[routeKey] =
        CUSTOMIZE_COLOR + '\n\n<div class="lab b2-bs6 b2-margin margin-bs6-root lab-dark">\n  <p>Dark mode surface using <code>.lab-dark</code>.</p>\n</div>'
      continue
    }
    const g = extractGeneric(routeKey)
    if (g) copies[routeKey] = g
  }
}

for (const [slug, html] of Object.entries(FORM_COPY)) copies[`forms/${slug}`] = html

for (const [slug, html] of Object.entries(CONTENT_COPY)) {
  copies[`content/${slug}`] = html
}

for (const [slug] of MARGIN_BS6_IA.components.pages) {
  if (COMPONENT_STATIC[slug]) {
    copies[`components/${slug}`] = COMPONENT_STATIC[slug]
    continue
  }
  const catalogId = COMPONENT_CATALOG_ALIASES[slug] ?? slug
  const demo = extractCatalogDemo(catalogId, slug)
  if (demo) copies[`components/${slug}`] = demo
}

const out = `/** Generated by scripts/build-margin-bs6-copy.mjs — do not edit by hand. */
export const MARGIN_BS6_COPY: Record<string, string> = ${JSON.stringify(copies, null, 2)}

function wrapMarkup(area: string, inner: string): string {
  if (area === 'customize' && inner.includes('--bg:')) return inner
  return \`<div class="lab b2-bs6 b2-margin margin-bs6-root">\\n\${inner}\\n</div>\`
}

export function marginBs6CopyMarkup(area: string, slug: string): string {
  const key = \`\${area}/\${slug}\`
  const raw = MARGIN_BS6_COPY[key]
  if (!raw) return wrapMarkup(area, \`<!-- \${key} -->\`)
  if (raw.trimStart().startsWith('<div class="lab')) return raw
  if (area === 'customize' && raw.includes('--bg:')) return raw
  return wrapMarkup(area, raw)
}
`

fs.writeFileSync(path.join(root, '.vitepress/theme/margin-bs6-copy.ts'), out)
console.log('Wrote margin-bs6-copy.ts with', Object.keys(copies).length, 'entries')