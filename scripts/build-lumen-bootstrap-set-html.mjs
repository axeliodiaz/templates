#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const mdPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, 'lumen/components-more.md')
const md = fs.readFileSync(mdPath, 'utf8')
const sections = []
const re = /^## (.+)$/gm
const headers = [...md.matchAll(re)]
for (let i = 0; i < headers.length; i++) {
  const title = headers[i][1]
  const start = headers[i].index + headers[i][0].length
  const end = i + 1 < headers.length ? headers[i + 1].index : md.length
  const body = md.slice(start, end).trim()
  if (title.startsWith('Language') || title.startsWith('Navbar')) continue
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  sections.push({ title, id, body })
}

function btnClass(raw) {
  let c = raw.trim()
  const map = [
    ['btn pri', 'btn-solid theme-primary'],
    ['btn sec', 'btn-solid theme-secondary'],
    ['btn ok', 'btn-solid theme-success'],
    ['btn warn', 'btn-solid theme-warning'],
    ['btn bad', 'btn-solid theme-danger'],
    ['btn info', 'btn-solid theme-info'],
    ['btn o-pri', 'btn-outline theme-primary'],
    ['btn o-ok', 'btn-outline theme-success'],
    ['btn o-warn', 'btn-outline theme-warning'],
    ['btn o-bad', 'btn-outline theme-danger'],
    ['btn o-info', 'btn-outline theme-info'],
    ['btn link', 'btn-link'],
  ]
  for (const [from, to] of map) {
    if (c === from || c.startsWith(from + ' ')) c = c.replace(from, to)
  }
  if (c === 'btn' || c.startsWith('btn ')) c = c.replace(/^btn\b/, 'btn-outline theme-secondary')
  c = c.replace(/\bsm\b/g, 'btn-sm').replace(/\blg\b/g, 'btn-lg').replace(/\bdis\b/g, 'disabled')
  c = c.replace(/\bblk\b/g, 'w-100').replace(/\bpill\b/g, 'rounded-pill')
  return c.trim()
}

function convertBsx(html) {
  if (!html.includes('bsx')) return ''
  let h = html.replace(/<div class="bsx bsx-lmn">/g, '').replace(/<div class="bsx-lmn">/g, '')
  if (h.endsWith('</div>')) h = h.slice(0, -6)

  for (let i = 0; i < 20; i++) {
    const next = h.replace(
      /<span class="(btn[^"]*)"([^>]*)>((?!<span)[\s\S]*?)<\/span>/g,
      (_, cls, attrs, inner) => {
        const disabled = /\bdis\b/.test(cls) ? ' disabled' : ''
        return `<button type="button" class="${btnClass(cls)}"${attrs}${disabled}>${inner}</button>`
      }
    )
    if (next === h) break
    h = next
  }

  h = h.replace(/<div class="row">/g, '<div class="d-flex flex-wrap gap-2 align-items-center mb-2">')
  h = h.replace(/<div class="col">/g, '<div class="d-flex flex-column gap-2">')
  h = h.replace(/<div class="grid2">/g, '<div class="row g-3">')

  h = h.replace(/class="badge pri"/g, 'class="badge theme-primary"')
  h = h.replace(/class="badge ok"/g, 'class="badge theme-success"')
  h = h.replace(/class="badge warn"/g, 'class="badge theme-warning"')
  h = h.replace(/class="badge bad"/g, 'class="badge theme-danger"')
  h = h.replace(/class="badge info"/g, 'class="badge theme-info"')
  h = h.replace(/class="badge "/g, 'class="badge theme-secondary "')
  h = h.replace(/class="badge o"/g, 'class="badge border text-body-secondary"')

  h = h.replace(/<div class="alert pri">/g, '<div class="alert theme-primary" role="alert">')
  h = h.replace(/<div class="alert ok">/g, '<div class="alert theme-success" role="alert">')
  h = h.replace(/<div class="alert warn">/g, '<div class="alert theme-warning" role="alert">')
  h = h.replace(/<div class="alert bad">/g, '<div class="alert theme-danger" role="alert">')
  h = h.replace(/<div class="alert info">/g, '<div class="alert theme-info" role="alert">')
  h = h.replace(/<div class="alert neu">/g, '<div class="alert theme-secondary" role="alert">')

  h = h.replace(/<div class="bd">/g, '<div class="card-body">')
  h = h.replace(/<div class="hd">/g, '<div class="card-header">')
  h = h.replace(/<div class="ft">/g, '<div class="card-footer">')
  h = h.replace(/<div class="card">/g, '<div class="card h-100">')
  h = h.replace(/<div class="card hl">/g, '<div class="card lmn-card-highlight">')
  h = h.replace(/<div class="img"><\/div>/g, '<div class="card-img-top" aria-hidden="true"></div>')
  h = h.replace(/<h5>/g, '<h5 class="card-title mb-2">')

  h = h.replace(/<label class="l">/g, '<label class="form-label">')
  h = h.replace(/class="inp/g, 'class="form-control')
  h = h.replace(/class="form-control sel/g, 'class="form-select')
  h = h.replace(/class="form-control sm/g, 'class="form-control form-control-sm')
  h = h.replace(/class="form-control lg/g, 'class="form-control form-control-lg')

  h = h.replace(/<span class="grp([^"]*)">/g, '<div class="btn-group$1" role="group">')
  h = h.replace(/<span class="grp v">/g, '<div class="btn-group-vertical" role="group">')
  h = h.replace(/<\/span>(?=\s*<(?:\/div|span class="grp))/g, '</div>')

  return `<div class="lmn-bs6-surface mb-3">${h}</div>`
}

const body = sections
  .map((s) => {
    const inner = convertBsx(s.body)
    if (!inner) return ''
    return `<section id="${s.id}" class="mb-4"><h2 class="h5 mb-3">${s.title}</h2>${inner}</section>`
  })
  .filter(Boolean)
  .join('\n')

const html = `<!doctype html>
<html lang="en" data-bs-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lumen · Bootstrap 6 component set</title>
<link rel="icon" href="data:,">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css" integrity="sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe" crossorigin="anonymous">
<link rel="stylesheet" href="/lumen-template/lumen-theme.css">
<style>
  body { padding: 1.25rem; max-width: 1100px; margin: 0 auto; background: #eceef1; font-family: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif; }
  .lmn-bs6-surface { background: var(--bs-bg-body); border: 1px solid var(--bs-border-color); border-radius: 12px; padding: 1rem; }
  .lmn-bs6-surface .btn-solid, .lmn-bs6-surface .btn-outline { transition: background-color .15s ease, border-color .15s ease, transform .12s ease; }
  .lmn-bs6-surface .btn-solid:active:not(:disabled), .lmn-bs6-surface .btn-outline:active:not(:disabled) { transform: scale(.98); }
  @media (prefers-reduced-motion: reduce) { .lmn-bs6-surface .btn-solid, .lmn-bs6-surface .btn-outline { transition: none; } * { animation-duration: 0.01ms !important; } }
</style>
</head>
<body>
<header class="mb-4">
  <p class="text-uppercase text-secondary small mb-1">Lumen template</p>
  <h1 class="h3">Bootstrap 6 component set</h1>
  <p class="text-secondary">Bootstrap 6.0.0-alpha.1 with Lumen tokens. Fictitious data; interactions are local.</p>
</header>
${body}
<script type="module">
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  for (const el of document.querySelectorAll('.lmn-bs6-surface')) {
    el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: 'ease-out', fill: 'both' });
  }
}
</script>
</body>
</html>
`

const out = path.join(root, 'public/lumen-template/bootstrap-set.html')
fs.writeFileSync(out, html)
console.log('Wrote', out, body.split('<section').length - 1, 'sections')
