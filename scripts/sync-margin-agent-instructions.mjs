#!/usr/bin/env node
/**
 * Ensure margin/agent-instructions/<path>.md exists for every Margin doc page.
 * Does not overwrite existing files unless MARGIN_AGENT_SYNC_FORCE=1.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { OVERRIDES, defaultInstruction } from './margin-agent-instruction-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const marginRoot = path.join(root, 'margin')
const agentRoot = path.join(marginRoot, 'agent-instructions')
const copyPath = path.join(root, '.vitepress/theme/margin-bs6-copy.ts')

const EXCLUDE = new Set([
  'agent-instructions',
])

const force = process.env.MARGIN_AGENT_SYNC_FORCE === '1'

/** @type {Map<string, string>} */
const copyMarkup = new Map()
if (fs.existsSync(copyPath)) {
  const src = fs.readFileSync(copyPath, 'utf8')
  for (const m of src.matchAll(/"([^"]+)":\s*"([^"]*)"/g)) {
    copyMarkup.set(m[1], m[2].replace(/\\n/g, '\n'))
  }
}

function listDocPages(dir, base = '') {
  /** @type {{rel:string, area:string, slug:string, title:string}[]} */
  const out = []
  for (const name of fs.readdirSync(dir)) {
    if (EXCLUDE.has(name)) continue
    const full = path.join(dir, name)
    const rel = base ? `${base}/${name}` : name
    if (fs.statSync(full).isDirectory()) {
      out.push(...listDocPages(full, rel))
      continue
    }
    if (!name.endsWith('.md')) continue
    const relMd = rel.replace(/\.md$/, '')
    const parts = relMd.split('/')
    const area = parts[0]
    const slug = parts.slice(1).join('/') || 'index'
    const title = slug === 'index' ? area.replace(/-/g, ' ') : slug.replace(/-/g, ' ')
    out.push({
      rel: relMd,
      area,
      slug: slug === 'index' ? 'index' : parts[parts.length - 1],
      title: title.charAt(0).toUpperCase() + title.slice(1),
    })
  }
  return out
}

function lookupMarkup(area, slug) {
  const keys = [
    `${area}/${slug}`,
    `components/${slug}`,
    `forms/${slug}`,
    `utilities/${slug}`,
    `layout/${slug}`,
    `helpers/${slug}`,
    `content/${slug}`,
    `customize/${slug}`,
    `getting-started/${slug}`,
    `guides/${slug}`,
  ]
  for (const k of keys) {
    if (copyMarkup.has(k)) return copyMarkup.get(k)
  }
  return ''
}

const pages = listDocPages(marginRoot)
let created = 0
let skipped = 0

for (const page of pages) {
  const outFile = path.join(agentRoot, `${page.rel}.md`)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  if (fs.existsSync(outFile) && !force) {
    skipped++
    continue
  }
  const override = OVERRIDES[page.rel]
  const body = override
    ? override({ title: page.title, area: page.area, slug: page.slug })
    : defaultInstruction({
        title: page.title,
        area: page.area,
        slug: page.slug === 'index' ? '' : page.slug,
        markup: lookupMarkup(page.area, page.slug === 'index' ? 'index' : page.slug),
      })
  fs.writeFileSync(outFile, body.trim() + '\n')
  created++
}

console.log(`sync-margin-agent-instructions: ${pages.length} pages, ${created} written, ${skipped} kept`)