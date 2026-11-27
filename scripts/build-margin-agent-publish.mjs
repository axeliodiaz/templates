#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = path.join(root, 'margin/agent-instructions')
const pubDir = path.join(root, 'public/margin/agents')

function walk(dir, base = '') {
  /** @type {string[]} */
  const files = []
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const rel = base ? `${base}/${name}` : name
    if (fs.statSync(full).isDirectory()) files.push(...walk(full, rel))
    else if (name.endsWith('.md')) files.push(rel)
  }
  return files
}

function rmrf(p) {
  if (!fs.existsSync(p)) return
  for (const e of fs.readdirSync(p)) {
    const f = path.join(p, e)
    if (fs.statSync(f).isDirectory()) rmrf(f)
    else fs.unlinkSync(f)
  }
  fs.rmdirSync(p)
}

if (!fs.existsSync(srcDir)) {
  console.error('build-margin-agent-publish: missing', srcDir)
  process.exit(1)
}

rmrf(pubDir)
fs.mkdirSync(pubDir, { recursive: true })

const files = walk(srcDir).sort()
const indexLines = ['# Margin design system — agent instruction index', '', '> templates.axeldiaz.com/margin', '']

/** @type {string[]} */
const fullParts = [
  '# Margin — full agent instructions',
  '',
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  '',
]

for (const rel of files) {
  const src = path.join(srcDir, rel)
  const dest = path.join(pubDir, rel)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const text = fs.readFileSync(src, 'utf8')
  fs.writeFileSync(dest, text)
  const urlPath = rel.replace(/\.md$/, '')
  const firstLine = text.split('\n').find((l) => l.startsWith('# '))?.replace(/^#\s+/, '') ?? urlPath
  indexLines.push(`- [${firstLine}](https://templates.axeldiaz.com/margin/agents/${urlPath}.md): /margin/agents/${urlPath}.md`)
  fullParts.push('', '---', '', `<!-- ${urlPath} -->`, '', text)
}

fs.writeFileSync(path.join(root, 'public/margin/llms.txt'), indexLines.join('\n') + '\n')
fs.writeFileSync(path.join(root, 'public/margin/llms-full.txt'), fullParts.join('\n'))
console.log(`build-margin-agent-publish: ${files.length} files → public/margin/agents/`)