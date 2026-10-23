// Static guard: every internal sidebar/nav link in .vitepress/config.mts must
// resolve to a real page, and its #anchor must exist on that page.
// Anchors come from markdown headings (default slug or explicit {#id}),
// inline <span id="...">, literal id:'...' in page scripts (Vue-rendered
// headings) and id="..." attributes in public/*.html. Pure Node, no deps.
const fs = require('fs')
const path = require('path')
const root = path.resolve(__dirname, '..')
const cfg = fs.readFileSync(path.join(root, '.vitepress/config.mts'), 'utf8')

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    e.isDirectory() ? walk(p, out) : e.name.endsWith('.md') && out.push(path.relative(root, p))
  }
  return out
}
const mds = new Set(walk(root))

const slug = t => t.trim().toLowerCase()
  .replace(/[^\w\s-]/gu, '')
  .replace(/[\s_]+/g, '-')
  .replace(/^-+|-+$/g, '')

const anchorCache = {}
function anchorsOf(md) {
  if (anchorCache[md]) return anchorCache[md]
  const heads = new Set()
  const src = fs.readFileSync(path.join(root, md), 'utf8')
  for (const line of src.split('\n')) {
    const h = line.match(/^#{1,6}\s+(.*)/)
    if (h) {
      const t = h[1].trim()
      const ex = t.match(/\{#([^}]+)\}\s*$/)
      if (ex) heads.add(ex[1].toLowerCase())
      heads.add(slug(t.replace(/\{[^}]*\}\s*$/, '')))
    }
    for (const m of line.matchAll(/<span\s+id="([^"]+)"/g)) heads.add(m[1].toLowerCase())
    for (const m of line.matchAll(/\bid:\s*'([^']+)'/g)) heads.add(m[1].toLowerCase())
    for (const m of line.matchAll(/\bid:\s*"([^"]+)"/g)) heads.add(m[1].toLowerCase())
  }
  anchorCache[md] = heads
  return heads
}

function resolvePage(page) {
  const rel = page.replace(/^\//, '').replace(/\/$/, '')
  if (rel === '') return { kind: 'md', path: 'index.md' }
  for (const cand of [rel, rel + '.md', rel + '/index.md']) {
    if (mds.has(cand)) return { kind: 'md', path: cand }
  }
  if (fs.existsSync(path.join(root, 'public', rel))) return { kind: 'public', path: rel }
  return null
}

const links = new Set()
for (const m of cfg.matchAll(/link:\s*'([^']+)'/g)) links.add(m[1])
for (const m of cfg.matchAll(/link:\s*"([^"]+)"/g)) links.add(m[1])

const failures = []
let checked = 0
for (const link of links) {
  if (link.startsWith('http')) continue
  checked++
  const [page, frag] = link.split('#')
  const target = resolvePage(page)
  if (!target) { failures.push(`dead page: ${link}`); continue }
  if (!frag) continue
  if (target.kind === 'md') {
    if (!anchorsOf(target.path).has(frag.toLowerCase())) failures.push(`dead anchor: ${link} (in ${target.path})`)
  } else {
    const html = fs.readFileSync(path.join(root, 'public', target.path), 'utf8')
    if (!html.includes(`id="${frag}"`)) failures.push(`dead anchor: ${link} (in public/${target.path})`)
  }
}
if (failures.length) {
  console.error('sidebar-anchors FAIL')
  failures.forEach(f => console.error(' -', f))
  process.exit(1)
}
console.log(`sidebar-anchors PASS (${checked} internal links checked)`)
