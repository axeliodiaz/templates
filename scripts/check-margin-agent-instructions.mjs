#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const marginRoot = path.join(root, 'margin')
const agentRoot = path.join(marginRoot, 'agent-instructions')

function listDocPages(dir, base = '') {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    if (name === 'agent-instructions') continue
    const full = path.join(dir, name)
    const rel = base ? `${base}/${name}` : name
    if (fs.statSync(full).isDirectory()) {
      out.push(...listDocPages(full, rel))
      continue
    }
    if (name.endsWith('.md')) out.push(rel.replace(/\.md$/, ''))
  }
  return out
}

const missing = []
for (const rel of listDocPages(marginRoot)) {
  const agent = path.join(agentRoot, `${rel}.md`)
  if (!fs.existsSync(agent)) missing.push(rel)
}

if (missing.length) {
  console.error('check-margin-agent-instructions: missing', missing.length)
  for (const m of missing) console.error('  -', m)
  process.exit(1)
}
console.log('check-margin-agent-instructions: ok', listDocPages(marginRoot).length)