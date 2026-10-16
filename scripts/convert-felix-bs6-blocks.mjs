/**
 * Converts felix/components-more.md bsx blocks to .felix-bs6 + Bootstrap 6 markup.
 */
import fs from 'node:fs'
import path from 'node:path'

const file = path.join(process.cwd(), 'felix/components-more.md')
let md = fs.readFileSync(file, 'utf8')

md = md.replace(
  /Every component Bootstrap 5\.3 documents/,
  'Every component Bootstrap 6.0.0-alpha.1 documents (pinned CDN; Felix tokens scoped under `.felix-bs6`). Chart and navbar demos below keep existing Motion behavior.'
)

function btnClass(raw) {
  const c = raw.trim()
  const parts = []
  if (c.includes('dis')) parts.push('disabled')
  if (c.includes('sm')) parts.push('btn-sm')
  if (c.includes('lg')) parts.push('btn-lg')
  if (c.includes('blk')) parts.push('w-100')
  if (c.includes('pill')) parts.push('rounded-pill')
  if (c.includes('act')) parts.push('active')
  if (/\bo-pri\b/.test(c)) parts.push('btn-outline', 'theme-primary')
  else if (/\bo-ok\b/.test(c)) parts.push('btn-outline', 'theme-success')
  else if (/\bo-warn\b/.test(c)) parts.push('btn-outline', 'theme-warning')
  else if (/\bo-bad\b/.test(c)) parts.push('btn-outline', 'theme-danger')
  else if (/\bo-info\b/.test(c)) parts.push('btn-outline', 'theme-info')
  else if (/\bpri\b/.test(c)) parts.push('btn-solid', 'theme-primary')
  else if (/\bsec\b/.test(c)) parts.push('btn-outline', 'theme-secondary')
  else if (/\bok\b/.test(c)) parts.push('btn-solid', 'theme-success')
  else if (/\bwarn\b/.test(c)) parts.push('btn-solid', 'theme-warning')
  else if (/\bbad\b/.test(c)) parts.push('btn-solid', 'theme-danger')
  else if (/\binfo\b/.test(c)) parts.push('btn-solid', 'theme-info')
  else if (/\b link\b/.test(c) || c === 'link') parts.push('btn-link')
  else parts.push('btn-outline', 'theme-secondary')
  return parts.join(' ')
}

function convertSpansToButtons(html) {
  return html.replace(/<span class="btn([^"]*)">([\s\S]*?)<\/span>/g, (_, cls, inner) => {
    if (inner.includes('class="spin') || inner.includes('class="grow')) {
      const label = inner.replace(/<span class="(?:spin|grow)[^"]*"><\/span>\s*/g, '').trim()
      return `<button type="button" class="${btnClass(cls)}" disabled><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${label}</button>`
    }
    return `<button type="button" class="${btnClass(cls)}">${inner}</button>`
  })
}

function convertBlock(block) {
  let h = block.replace(/class="bsx bsx-fx"/, 'class="felix-bs6" data-bs-theme="light"')
  h = convertSpansToButtons(h)
  h = h.replace(/<div class="row">/g, '<div class="d-flex flex-wrap gap-2 align-items-center mb-2">')
  h = h.replace(/<div class="col">/g, '<div class="d-flex flex-column gap-2">')
  h = h.replace(/<div class="grid2">/g, '<div class="row g-3">')
  h = h.replace(/class="alert pri"/g, 'class="alert theme-primary" role="alert"')
  h = h.replace(/class="alert ok"/g, 'class="alert theme-success" role="alert"')
  h = h.replace(/class="alert warn"/g, 'class="alert theme-warning alert-dismissible fade show" role="alert"')
  h = h.replace(/class="alert bad"/g, 'class="alert theme-danger" role="alert"')
  h = h.replace(/class="alert info"/g, 'class="alert theme-info alert-dismissible fade show" role="alert"')
  h = h.replace(/class="alert neu"/g, 'class="alert theme-secondary" role="alert"')
  h = h.replace(/<span class="x">&#10005;<\/span>/g, '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>')
  h = h.replace(/class="badge pri"/g, 'class="badge theme-primary"')
  h = h.replace(/class="badge ok"/g, 'class="badge theme-success"')
  h = h.replace(/class="badge warn"/g, 'class="badge theme-warning"')
  h = h.replace(/class="badge bad"/g, 'class="badge theme-danger"')
  h = h.replace(/class="badge info"/g, 'class="badge theme-info"')
  h = h.replace(/class="badge "/g, 'class="badge theme-secondary"')
  h = h.replace(/class="badge o"/g, 'class="badge border text-body-secondary"')
  h = h.replace(/class="inp sm"/g, 'class="form-control form-control-sm"')
  h = h.replace(/class="inp lg"/g, 'class="form-control form-control-lg"')
  h = h.replace(/class="inp sel"/g, 'class="form-select"')
  h = h.replace(/class="inp"/g, 'class="form-control"')
  h = h.replace(/class="card"><div class="bd"/g, 'class="card"><div class="card-body"')
  h = h.replace(/<div class="hd">/g, '<div class="card-header">')
  h = h.replace(/<div class="ft">/g, '<div class="card-footer text-body-secondary">')
  h = h.replace(/class="pr"/g, 'class="progress"')
  h = h.replace(/<i style="width:([^"]+)">([^<]*)<\/i>/g, '<div class="progress-bar" style="width:$1">$2</div>')
  h = h.replace(/class="spin/g, 'class="spinner-border')
  h = h.replace(/class="nav pills"/g, 'class="nav nav-pills gap-1"')
  h = h.replace(/class="nav fill"/g, 'class="nav nav-pills nav-fill"')
  h = h.replace(/class="nav card"/g, 'class="nav nav-pills"')
  h = h.replace(/class="nav"/g, 'class="nav nav-underline mb-2 gap-2"')
  h = h.replace(/<a class="act">/g, '<a class="nav-link active" href="#">')
  h = h.replace(/<a class="dis">/g, '<a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">')
  h = h.replace(/<a>/g, '<a class="nav-link" href="#">')
  h = h.replace(/class="lg-list"/g, 'class="list-group"')
  h = h.replace(/class="it act"/g, 'class="list-group-item active"')
  h = h.replace(/class="it dis"/g, 'class="list-group-item disabled"')
  h = h.replace(/<div class="it/g, '<div class="list-group-item')
  h = h.replace(/class="tb/g, 'class="table table-sm')
  h = h.replace(/class="tw"/g, 'class="table-responsive"')
  return h
}

md = md.replace(/<div class="bsx bsx-fx">[\s\S]*?<\/div>\n(?=\n|$)/g, (block) => convertBlock(block))

fs.writeFileSync(file, md)
console.log('Converted', file)
