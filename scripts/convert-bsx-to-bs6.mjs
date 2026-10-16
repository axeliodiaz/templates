/**
 * One-off helper: convert bsx-sc static blocks in markdown to real Bootstrap 6 markup inside `.sc`.
 * Usage: node scripts/convert-bsx-to-bs6.mjs path/to/file.md
 */
import fs from 'node:fs'

const file = process.argv[2]
if (!file) {
  console.error('Usage: node scripts/convert-bsx-to-bs6.mjs <file.md>')
  process.exit(1)
}

let html = fs.readFileSync(file, 'utf8')

html = html.replace(/<div class="bsx bsx-sc">/g, '<div class="sc">')

const themeMap = { pri: 'primary', sec: 'secondary', ok: 'success', warn: 'warning', bad: 'danger', info: 'info' }

function btnClasses(raw) {
  const parts = raw.trim().split(/\s+/).filter(Boolean)
  let variant = 'solid'
  let theme = 'secondary'
  let size = ''
  let extra = ''
  if (parts.includes('link')) return { tag: 'button', cls: `btn-link${parts.includes('dis') ? ' disabled' : ''}`, dis: parts.includes('dis') }
  if (parts.includes('dis')) extra = ' disabled'
  if (parts.includes('sm')) size = ' btn-sm'
  if (parts.includes('lg')) size = ' btn-lg'
  if (parts.includes('blk')) extra += ' w-100'
  if (parts.includes('pill')) extra += ' rounded-pill'
  if (parts.includes('act')) extra += ' active'
  const outline = parts.find((p) => p.startsWith('o-'))
  if (outline) {
    variant = 'outline'
    theme = themeMap[outline.slice(2)] || 'primary'
  } else {
    for (const [k, v] of Object.entries(themeMap)) {
      if (parts.includes(k)) theme = v
    }
  }
  return { tag: 'button', cls: `btn-${variant} theme-${theme}${size}${parts.includes('dis') ? ' disabled' : ''}`, dis: parts.includes('dis') }
}

html = html.replace(/<span class="btn([^"]*)"([^>]*)>([\s\S]*?)<\/span>/g, (_, cls, rest, inner) => {
  const { tag, cls: c, dis } = btnClasses(cls)
  const type = dis ? '' : ' type="button"'
  return `<${tag}${type} class="${c}"${rest}>${inner}</${tag}>`
})

for (const [k, v] of Object.entries(themeMap)) {
  html = html.replaceAll(`alert ${k}`, `alert theme-${v}`)
  html = html.replaceAll(`badge ${k}`, `badge theme-${v}`)
  html = html.replaceAll(`badge o`, `badge theme-secondary border`)
}

html = html.replace(/<div class="card"><div class="bd">/g, '<div class="card"><div class="card-body">')
html = html.replace(/<div class="card"><div class="hd">/g, '<div class="card"><div class="card-header">')
html = html.replace(/<div class="card"><div class="img">/g, '<div class="card"><div class="card-img-top sc-card-img">')
html = html.replace(/<div class="ft">/g, '<div class="card-footer">')
html = html.replace(/class="inp/g, 'class="form-control')
html = html.replace(/<label class="l">/g, '<label class="form-label">')
html = html.replace(/<div class="row">/g, '<div class="d-flex flex-wrap gap-2 align-items-center mb-2">')
html = html.replace(/<div class="col">/g, '<div class="d-flex flex-column gap-2">')
html = html.replace(/<div class="grid2">/g, '<div class="row row-cols-1 row-cols-md-2 g-3">')
html = html.replace(/<div class="pr([^"]*)"><i style="width:([^"]+)"([^>]*)><\/i><\/div>/g, '<div class="progress$1" role="progressbar"><div class="progress-bar" style="width:$2"$3></div></div>')
html = html.replace(/<div class="lg-list([^"]*)"><div class="it/g, '<div class="list-group$1"><div class="list-group-item')
html = html.replace(/class="it act"/g, 'class="list-group-item active"')
html = html.replace(/class="it dis"/g, 'class="list-group-item disabled"')
html = html.replace(/class="it ok"/g, 'class="list-group-item list-group-item-success"')
html = html.replace(/class="it bad"/g, 'class="list-group-item list-group-item-danger"')
html = html.replace(/class="it"/g, 'class="list-group-item"')
html = html.replace(/<table class="tb/g, '<table class="table')
html = html.replace(/table class="table str"/g, 'table table-striped')
html = html.replace(/table class="table hov"/g, 'table table-hover')
html = html.replace(/table class="table bor sm"/g, 'table table-bordered table-sm')
html = html.replace(/<div class="nav"><a class="act">/g, '<ul class="nav nav-underline"><li class="nav-item"><a class="nav-link active" href="#">')
html = html.replace(/Bootstrap 5\.3/g, 'Bootstrap 6 (6.0.0-alpha.1)')

fs.writeFileSync(file, html)
console.log('Converted', file)
