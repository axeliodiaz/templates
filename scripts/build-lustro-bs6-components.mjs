#!/usr/bin/env node
/**
 * Builds public/lustro-template/components-more.html from lustro/components-more.md
 * by converting legacy .bsx-lu previews to real Bootstrap 6 markup inside .lustro-bs6-root.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const mdPath = path.join(root, 'lustro/components-more.md')
const outPath = path.join(root, 'public/lustro-template/components-more.html')

const BS6_CSS =
  'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css'
const BS6_CSS_SRI =
  'sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe'
const BS6_JS =
  'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js'
const BS6_JS_SRI =
  'sha384-1a/pXj49ZQ1aHEmrJ+gMw1otqoVsYwlEnlD8mIfY2TV03r20Y0CN7uqx1tQogjPL'

function btnClasses(raw) {
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  const out = ['btn']
  let solid = true
  for (const p of parts) {
    if (p === 'pri') {
      out.push(solid ? 'btn-solid theme-primary' : 'btn-outline theme-primary')
    } else if (p === 'sec') out.push(solid ? 'btn-solid theme-secondary' : 'btn-outline theme-secondary')
    else if (p === 'ok') out.push(solid ? 'btn-solid theme-success' : 'btn-outline theme-success')
    else if (p === 'warn') out.push(solid ? 'btn-solid theme-warning' : 'btn-outline theme-warning')
    else if (p === 'bad') out.push(solid ? 'btn-solid theme-danger' : 'btn-outline theme-danger')
    else if (p === 'info') out.push(solid ? 'btn-solid theme-info' : 'btn-outline theme-info')
    else if (p.startsWith('o-')) {
      solid = false
      const v = p.slice(2)
      if (v === 'pri') out.push('btn-outline theme-primary')
      else if (v === 'ok') out.push('btn-outline theme-success')
      else if (v === 'warn') out.push('btn-outline theme-warning')
      else if (v === 'bad') out.push('btn-outline theme-danger')
      else if (v === 'info') out.push('btn-outline theme-info')
    } else if (p === 'sm') out.push('btn-sm')
    else if (p === 'lg') out.push('btn-lg')
    else if (p === 'dis') out.push('disabled')
    else if (p === 'link') out.push('btn-link')
    else if (p === 'blk') out.push('w-100')
    else if (p === 'pill') out.push('rounded-pill')
  }
  return [...new Set(out)].join(' ')
}

function transformBlock(html) {
  let h = html
  h = h.replace(/<div class="bsx bsx-lu">/g, '<div class="lu-bs6-block">')
  h = h.replace(/<span class="btn ([^"]*)"([^>]*)>([\s\S]*?)<\/span>/g, (_, cls, rest, inner) => {
    const disabled = cls.includes('dis') ? ' disabled' : ''
    return `<button type="button" class="${btnClasses(cls)}"${rest}${disabled}>${inner}</button>`
  })
  h = h.replace(/<div class="row">/g, '<div class="d-flex flex-wrap gap-2 align-items-center mb-2">')
  h = h.replace(/<div class="col">/g, '<div class="d-flex flex-column gap-2">')
  h = h.replace(/<div class="grid2">/g, '<div class="row g-3">')
  h = h.replace(/<span class="badge ([^"]*)">/g, (_, cls) => {
    const theme = cls.includes('ok')
      ? 'theme-success'
      : cls.includes('warn')
        ? 'theme-warning'
        : cls.includes('bad')
          ? 'theme-danger'
          : cls.includes('info')
            ? 'theme-info'
            : cls.includes('pri')
              ? 'theme-primary'
              : 'theme-secondary'
    return `<span class="badge ${theme}">`
  })
  h = h.replace(/<div class="alert ([^"]*)">/g, (_, cls) => {
    const theme = cls.includes('ok')
      ? 'theme-success'
      : cls.includes('warn')
        ? 'theme-warning'
        : cls.includes('bad')
          ? 'theme-danger'
          : cls.includes('info')
            ? 'theme-info'
            : cls.includes('pri')
              ? 'theme-primary'
              : 'theme-secondary'
    return `<div class="alert ${theme} d-flex gap-2 align-items-start" role="alert">`
  })
  h = h.replace(/<label class="l">/g, '<label class="form-label">')
  h = h.replace(/<input class="inp([^"]*)"([^>]*)>/g, (_, extra, rest) => {
    const size = extra.includes('sm') ? ' form-control-sm' : extra.includes('lg') ? ' form-control-lg' : ''
    const state = extra.includes('ok')
      ? ' is-valid'
      : extra.includes('bad')
        ? ' is-invalid'
        : ''
    return `<input class="form-control${size}${state}"${rest}>`
  })
  h = h.replace(/<textarea class="inp([^"]*)"([^>]*)>/g, (_, extra, rest) => {
    const size = extra.includes('sm') ? ' form-control-sm' : extra.includes('lg') ? ' form-control-lg' : ''
    return `<textarea class="form-control${size}"${rest}>`
  })
  h = h.replace(/<select class="inp([^"]*)"([^>]*)>/g, (_, extra, rest) => {
    const size = extra.includes('sm') ? ' form-select-sm' : extra.includes('lg') ? ' form-select-lg' : ''
    return `<select class="form-select${size}"${rest}>`
  })
  h = h.replace(/<div class="card"><div class="bd">/g, '<div class="col-md-6"><div class="card h-100"><div class="card-body">')
  h = h.replace(/<div class="card"><div class="hd">/g, '<div class="col-md-6"><div class="card h-100"><div class="card-header">')
  h = h.replace(/<div class="ft">/g, '<div class="card-footer text-muted small">')
  h = h.replace(/<\/div><\/div><\/div>/g, '</div></div></div>')
  h = h.replace(/<h5>/g, '<h5 class="card-title">')
  h = h.replace(/<div class="nav pills">/g, '<ul class="nav nav-pills gap-1">')
  h = h.replace(/<div class="nav"><a class="act">/g, '<ul class="nav nav-underline gap-2"><li class="nav-item"><a class="nav-link active" href="#">')
  h = h.replace(/<div class="nav"><a>/g, '<ul class="nav nav-underline gap-2"><li class="nav-item"><a class="nav-link" href="#">')
  h = h.replace(/<a class="act">/g, '<a class="nav-link active" href="#">')
  h = h.replace(/<a>/g, '<a class="nav-link" href="#">')
  h = h.replace(/<a class="dis">/g, '<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">')
  return h
}

const md = fs.readFileSync(mdPath, 'utf8')
const lines = md.split('\n')
const sections = []
let i = 0
while (i < lines.length) {
  const line = lines[i]
  if (line.startsWith('## ') && !line.includes('Navbar')) {
    const title = line.replace(/^##\s+/, '').trim()
    i++
    const buf = []
    while (i < lines.length && !lines[i].startsWith('## ')) {
      if (!lines[i].startsWith('<script')) buf.push(lines[i])
      i++
    }
    const body = buf.join('\n').trim()
    const m = body.match(/<div class="bsx bsx-lu">[\s\S]*?<\/div>/)
    if (m) {
      sections.push({ title, html: transformBlock(m[0]) })
    } else if (body && !body.startsWith('<script')) {
      sections.push({ title, html: `<p class="text-secondary small">${body.replace(/</g, '&lt;')}</p>` })
    }
    continue
  }
  i++
}

const sectionHtml = sections
  .map(
    (s) =>
      `<section class="mb-2" id="${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"><h2 class="lu-section-title h6">${s.title}</h2>${s.html}</section>`
  )
  .join('\n')

const html = `<!doctype html>
<html lang="en" data-bs-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lustro — Bootstrap 6 component set</title>
<link rel="icon" href="data:,">
<link rel="stylesheet" href="${BS6_CSS}" integrity="${BS6_CSS_SRI}" crossorigin="anonymous">
<link rel="stylesheet" href="/lustro-template/lustro-theme.css">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700&display=swap" rel="stylesheet">
<style>
  html, body { height: 100%; margin: 0; }
  body { background: #07070f; }
</style>
</head>
<body>
<div class="lustro-bs6-root container-fluid py-3" data-bs-theme="dark">
  <header class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
    <div class="d-flex align-items-center">
      <span class="lustro-mark" aria-hidden="true">L</span>
      <div>
        <div class="fw-semibold">Lustro</div>
        <div class="small text-secondary">Bootstrap 6.0.0-alpha.1 · scoped preview</div>
      </div>
    </div>
    <button type="button" class="btn-outline btn-sm theme-secondary" id="themeToggle" aria-pressed="true">Light mode</button>
  </header>
  <p class="small text-secondary mb-4">Fictitious data. Interactive toasts and dialogs use Bootstrap 6 ESM. Chart-heavy Lustro pages stay on the VitePress catalog with existing motion.</p>
  <div class="d-flex flex-wrap gap-2 mb-4">
    <button type="button" class="btn-solid theme-primary btn-sm" id="demoToast">Show toast</button>
    <button type="button" class="btn-outline theme-primary btn-sm" data-bs-toggle="dialog" data-bs-target="#demoDialog">Open dialog</button>
  </div>
  ${sectionHtml}
</div>
<dialog class="dialog" id="demoDialog" aria-labelledby="demoDialogTitle">
  <form method="dialog">
    <div class="dialog-header">
      <h2 class="dialog-title h6" id="demoDialogTitle">Lustro dialog</h2>
      <button type="button" class="btn-close" data-bs-dismiss="dialog" aria-label="Close"></button>
    </div>
    <div class="dialog-body"><p class="mb-0">Bootstrap 6 dialog with Lustro tokens. Press Escape to close.</p></div>
    <div class="dialog-footer">
      <button type="button" class="btn-solid theme-secondary" data-bs-dismiss="dialog">Cancel</button>
      <button type="submit" class="btn-solid theme-primary">Confirm</button>
    </div>
  </form>
</dialog>
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToast" class="toast" role="status" aria-live="polite" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">Saved on Bootstrap 6.</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</div>
<script type="module" src="${BS6_JS}" integrity="${BS6_JS_SRI}" crossorigin="anonymous"></script>
<script type="module">
import { Toast } from "${BS6_JS}";
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const applyTheme = (dark) => {
  root.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
  document.querySelector('.lustro-bs6-root')?.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
  themeBtn.textContent = dark ? 'Light mode' : 'Dark mode';
  themeBtn.setAttribute('aria-pressed', String(dark));
};
let dark = true;
themeBtn?.addEventListener('click', () => { dark = !dark; applyTheme(dark); });
document.getElementById('demoToast')?.addEventListener('click', () => {
  Toast.getOrCreateInstance(document.getElementById('liveToast')).show();
});
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.lustro-bs6-root *').forEach((el) => { el.style.animationDuration = '0.01ms'; });
}
</script>
</body>
</html>
`

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, html)
console.log('Wrote', outPath, `(${sections.length} sections)`)
