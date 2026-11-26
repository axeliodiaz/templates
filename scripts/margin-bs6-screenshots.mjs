#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = '/opt/cursor/artifacts'
const routes = [
  '/margin/components/accordion',
  '/margin/utilities/flex',
  '/margin/components/button',
  '/margin/forms/checkbox',
  '/margin/content/typography',
  '/margin/customize/color',
]

const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['dev', root, '--port', '4348'], { stdio: 'ignore' })
try {
  let ready = false
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch('http://localhost:4348/margin/components/accordion')).ok) {
        ready = true
        break
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  if (!ready) throw new Error('vitepress not ready')
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1024, height: 900 } })
  for (const r of routes) {
    await page.goto(`http://localhost:4348${r}`, { waitUntil: 'networkidle' })
    const slug = r.split('/').pop()
    await page.screenshot({ path: path.join(out, `margin-after-${slug}-1024-light.png`) })
    const btn = page.getByRole('button', { name: /dark preview/i }).first()
    if (await btn.count()) {
      await btn.click()
      await page.waitForTimeout(400)
      await page.screenshot({ path: path.join(out, `margin-after-${slug}-1024-dark-preview.png`) })
    }
  }
  await browser.close()
} finally {
  server.kill()
}