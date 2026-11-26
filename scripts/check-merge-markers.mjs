#!/usr/bin/env node
/** Fail CI when unresolved git conflict markers are committed. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const exts = new Set(['.vue', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.css', '.scss', '.md', '.html', '.json'])
const skip = new Set(['node_modules', '.git', 'dist', '.vitepress/dist', '.artifacts'])

const hits = []
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (skip.has(name)) continue
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p)
    else if (exts.has(path.extname(name))) {
      const text = fs.readFileSync(p, 'utf8')
      if (/^<<<<<<<[^\n]*$/m.test(text) || /^>>>>>>>[^\n]*$/m.test(text)) hits.push(path.relative(root, p))
    }
  }
}
walk(root)
if (hits.length) {
  console.error('Unresolved merge conflict markers in:', hits.join(', '))
  process.exit(1)
}
console.log('check-merge-markers: ok')