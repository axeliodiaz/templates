import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'scopecraft/components-more.md')
let s = fs.readFileSync(file, 'utf8')

s = s.replace(
  'Every component Bootstrap 5.3 documents, rebuilt in the Scopecraft style.',
  'Every component Bootstrap 6.0.0-alpha.1 documents, rendered with real Bootstrap markup and Scopecraft tokens inside `.sc-bs6-root` (no bleed into the VitePress shell).'
)

s = s.replaceAll('<div class="bsx bsx-sc">', '<div class="sc-bs6-root sc-bs6-more" data-bs-theme="light">')

const btnMap = [
  ['pri', 'btn-solid theme-primary'],
  ['sec', 'btn-outline theme-secondary'],
  ['ok', 'btn-solid theme-success'],
  ['warn', 'btn-solid theme-warning'],
  ['bad', 'btn-solid theme-danger'],
  ['info', 'btn-solid theme-info'],
  ['o-pri', 'btn-outline theme-primary'],
  ['o-ok', 'btn-outline theme-success'],
  ['o-warn', 'btn-outline theme-warning'],
  ['o-bad', 'btn-outline theme-danger'],
  ['o-info', 'btn-outline theme-info'],
  ['link', 'btn-link'],
]

s = s.replace(/<span class="btn ([^"]*)"([^>]*)>([\s\S]*?)<\/span>/g, (full, cls, rest, inner) => {
  const token = cls.trim().split(/\s+/)[0]
  const mapped = btnMap.find(([k]) => token === k)?.[1] ?? 'btn-outline theme-secondary'
  const extra = cls.replace(token, '').trim()
  return `<button type="button" class="${mapped}${extra ? ' ' + extra : ''}"${rest}>${inner}</button>`
})

s = s.replaceAll('class="alert pri"', 'class="alert theme-primary"')
s = s.replaceAll('class="alert ok"', 'class="alert theme-success"')
s = s.replaceAll('class="alert warn"', 'class="alert theme-warning"')
s = s.replaceAll('class="alert bad"', 'class="alert theme-danger"')
s = s.replaceAll('class="alert info"', 'class="alert theme-info"')
s = s.replaceAll('class="alert neu"', 'class="alert theme-secondary"')
s = s.replaceAll('<input class="inp', '<input class="form-control')
s = s.replaceAll('<span class="badge', '<span class="badge')
s = s.replaceAll('class="badge pri"', 'class="badge text-bg-primary"')
s = s.replaceAll('class="badge ok"', 'class="badge text-bg-success"')
s = s.replaceAll('class="badge warn"', 'class="badge text-bg-warning"')
s = s.replaceAll('class="badge bad"', 'class="badge text-bg-danger"')
s = s.replaceAll('class="badge info"', 'class="badge text-bg-info"')

fs.writeFileSync(file, s)
console.log('Updated', file)
