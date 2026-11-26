#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MARGIN_BS6_IA } from './margin-bs6-ia.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const routes = []
for (const [key, block] of Object.entries(MARGIN_BS6_IA)) {
  const area = key === 'gettingStarted' ? 'getting-started' : key
  for (const [slug, , isIndex] of block.pages) {
    routes.push(`/margin/${area}/${isIndex && slug !== 'introduction' ? '' : slug}`.replace(/\/$/, '') || `/margin/${area}`)
    if (!isIndex) routes.push(`/margin/${area}/${slug}`)
  }
}
const unique = [...new Set(routes)]

const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['dev', root, '--port', '4349'], { stdio: 'ignore' })
try {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch('http://localhost:4349/margin')).ok) break
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 } })
  const errors = []
  for (const r of unique) {
    const pe = []
    page.once('pageerror', (e) => pe.push(e.message))
    await page.goto(`http://localhost:4349${r}`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /dark preview/i }).first().click().catch(() => {})
    await page.waitForTimeout(150)
    const hasCopy = await page.locator('.margin-bs6-doc-code').count()
    const placeholder = await page.locator('.margin-bs6-doc-code-gap').count()
    if (!hasCopy) errors.push({ r, reason: 'missing copy block' })
    if (placeholder) errors.push({ r, reason: 'placeholder copy' })
    if (pe.length) errors.push({ r, reason: pe[0] })
  }
  await browser.close()
  console.log('routes', unique.length, 'errors', errors.length)
  if (errors.length) {
    console.log(errors.slice(0, 20))
    process.exitCode = 1
  }
} finally {
  server.kill()
}