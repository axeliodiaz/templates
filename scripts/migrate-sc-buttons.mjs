import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'scopecraft')
const files = fs.readdirSync(root).filter((f) => f.endsWith('.md'))

function migrate(s) {
  return s
    .replace(/<span class="sc-btn pri">([\s\S]*?)<\/span>/g, '<button type="button" class="btn-solid theme-primary">$1</button>')
    .replace(/<span class="sc-btn dis">([\s\S]*?)<\/span>/g, '<button type="button" class="btn-solid theme-primary disabled" disabled>$1</button>')
    .replace(/<span class="sc-btn">([\s\S]*?)<\/span>/g, '<button type="button" class="btn-outline theme-secondary">$1</button>')
}

for (const f of files) {
  const p = path.join(root, f)
  const before = fs.readFileSync(p, 'utf8')
  const after = migrate(before)
  if (after !== before) {
    fs.writeFileSync(p, after)
    console.log('Updated buttons in', f)
  }
}
