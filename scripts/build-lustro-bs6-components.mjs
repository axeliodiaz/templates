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
<link rel="stylesheet" href="/theme-reveal.css">
<script src="/theme-reveal.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700&display=swap" rel="stylesheet">
<style>
  html, body { height: 100%; margin: 0; }
  body { background: #07070f; }
</style>
<style>
.detail-drawer{position:fixed;inset:0 0 0 auto;margin:0;width:min(480px,100vw);max-width:100vw;height:100dvh;max-height:100dvh;border:0;border-left:1px solid var(--bs-border-color);padding:1.5rem;background:var(--bs-bg-1,var(--bs-body-bg));color:var(--bs-fg-1,var(--bs-body-color));box-shadow:-1rem 0 3rem rgb(0 0 0/.22);overflow-y:auto}.detail-drawer::backdrop{background:rgb(12 15 25/.42)}.detail-drawer .dd-header{display:flex;align-items:start;justify-content:space-between;gap:1rem;margin-bottom:1rem}.detail-drawer .dd-title{margin:0;font-size:1.35rem}.detail-drawer .dd-panel{border:1px solid var(--bs-border-color);border-radius:.75rem;padding:1rem;margin:1rem 0;background:var(--bs-bg-2,var(--bs-body-bg))}.detail-drawer dl{display:grid;grid-template-columns:8rem 1fr;gap:.5rem 1rem;margin:1rem 0 0}.detail-drawer dt{color:var(--bs-fg-3,var(--bs-secondary-color));font-size:.8rem}.detail-drawer dd{margin:0;overflow-wrap:anywhere}@media(max-width:600px){.detail-drawer{padding:1rem}.detail-drawer dl{grid-template-columns:6rem 1fr}}
</style>
  <link rel="stylesheet" href="/vendor/fontawesome/css/all.min.css">
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
<section class="mb-4" id="lateral-detail-drawer"><h2 class="lu-section-title h6">Lateral detail drawer</h2><div class="lu-bs6-block"><button type="button" class="btn-outline theme-primary btn-sm" data-detail-drawer>Open detail drawer</button></div></section>
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
themeBtn?.addEventListener('click', () => { dark = !dark; ThemeReveal.reveal(themeBtn, () => applyTheme(dark)); });
document.getElementById('demoToast')?.addEventListener('click', () => {
  Toast.getOrCreateInstance(document.getElementById('liveToast')).show();
});
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.lustro-bs6-root *').forEach((el) => { el.style.animationDuration = '0.01ms'; });
}
</script>
<dialog class="detail-drawer" id="detailDrawer" aria-labelledby="detailDrawerTitle">
  <div class="dd-header"><div><span class="badge theme-primary">DETAIL PANEL · DEMO</span><h2 class="dd-title" id="detailDrawerTitle">Component review</h2></div><button type="button" class="btn-close" data-drawer-close aria-label="Close"></button></div>
  <p class="text-secondary">Review details without losing the component set behind this panel. Fictitious data; actions stay local.</p>
  <div class="dd-panel"><span class="badge theme-success">Ready for review</span><dl><div><dt>Component</dt><dd>Detail drawer (original)</dd></div><div><dt>Owner</dt><dd>Design systems (fictitious)</dd></div><div><dt>Scope</dt><dd>Local demo only</dd></div></dl></div>
  <div class="dd-panel"><h3 class="h6">Review note</h3><label class="form-label" for="drawerNote">Local note</label><textarea class="form-control" id="drawerNote" rows="4" placeholder="Add a note for this preview"></textarea></div>
  <p id="drawerStatus" role="status" class="small text-secondary"></p><div class="d-flex justify-content-end gap-2"><button type="button" class="btn-solid theme-secondary btn-sm" data-drawer-close>Close</button><button type="button" class="btn-solid theme-primary btn-sm" id="drawerAction">Mark reviewed</button></div>
</dialog>
<script type="module">
const drawer=document.getElementById("detailDrawer"),status=document.getElementById("drawerStatus");
let lastTrigger=null,closing=false;
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
function focusables(){return [...drawer.querySelectorAll("button:not(:disabled),textarea:not(:disabled),input:not(:disabled),select:not(:disabled),a[href],[tabindex='0']")]}
async function openDrawer(e){lastTrigger=e.currentTarget;drawer.showModal();if(!reduced.matches){const{animate}=await import("https://cdn.jsdelivr.net/npm/motion@14.1.0/+esm");animate(drawer,{x:["100%","0%"],opacity:[.65,1]},{duration:.25,ease:"easeOut"})}}
async function closeDrawer(){if(closing||!drawer.open)return;closing=true;if(!reduced.matches){const{animate}=await import("https://cdn.jsdelivr.net/npm/motion@14.1.0/+esm");await animate(drawer,{x:["0%","100%"],opacity:[1,.65]},{duration:.16,ease:"easeIn"}).finished}drawer.close();closing=false;lastTrigger?.focus()}
drawer.addEventListener("cancel",(e)=>{e.preventDefault();closeDrawer()});
drawer.addEventListener("click",(e)=>{const r=drawer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDrawer()});
drawer.addEventListener("keydown",(e)=>{if(e.key!=="Tab")return;const f=focusables();if(!f.length)return;const first=f[0],last=f[f.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
document.querySelectorAll("[data-detail-drawer]").forEach(b=>b.addEventListener("click",openDrawer));
drawer.querySelectorAll("[data-drawer-close]").forEach(b=>b.addEventListener("click",closeDrawer));
document.getElementById("drawerAction").addEventListener("click",()=>{status.textContent="Demo only: marked reviewed locally. Nothing was saved or sent."});
</script>
</body>
</html>
`

if (process.argv.includes('--check')) {
  if (!fs.existsSync(outPath) || fs.readFileSync(outPath, 'utf8') !== html) {
    console.error('Lustro component export drift: run npm run build:lustro-bs6 and commit the output.')
    process.exitCode = 1
  } else console.log('PASS Lustro generated export matches committed content')
} else {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, html)
  console.log('Wrote', outPath, `(${sections.length} sections)`)
}
