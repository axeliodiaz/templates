#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'

const root = '/agent/repos/templates'
const out = '/opt/cursor/artifacts/margin-squash-force-push'
fs.mkdirSync(out, { recursive: true })

const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--port', '4360'], {
  stdio: 'ignore',
})
try {
  for (let i = 0; i < 80; i++) {
    try {
      if ((await fetch('http://localhost:4360/margin/squash-force-push')).ok) break
    } catch {}
    await new Promise((r) => setTimeout(r, 200))
  }
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  for (const [vp, size] of [
    ['1024', { width: 1024, height: 900 }],
    ['390', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport: size })
    await page.goto('http://localhost:4360/margin/squash-force-push', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
    await page.locator('.mg-squash').first().screenshot({ path: path.join(out, `squash-${vp}-light.png`) })
    await page.getByRole('button', { name: /dark preview/i }).click()
    await page.waitForTimeout(400)
    await page.locator('.mg-squash').first().screenshot({ path: path.join(out, `squash-${vp}-dark-preview.png`) })
    await page.close()
  }
  await browser.close()
} finally {
  server.kill()
}