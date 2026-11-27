#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = '/opt/cursor/artifacts/margin-graphs'
fs.mkdirSync(out, { recursive: true })

const routes = [
  ['arc', '/margin/graphs/arc'],
  ['line', '/margin/graphs/line'],
  ['bar', '/margin/graphs/bar'],
  ['donut', '/margin/graphs/donut'],
]

const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['dev', root, '--port', '4352'], {
  stdio: 'ignore',
})
try {
  let ready = false
  for (let i = 0; i < 160; i++) {
    try {
      if ((await fetch('http://localhost:4352/margin/graphs/line')).ok) {
        ready = true
        break
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  if (!ready) throw new Error('vitepress not ready')
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  for (const [slug, r] of routes) {
    for (const [vpName, vp] of [
      ['1024', { width: 1024, height: 900 }],
      ['390', { width: 390, height: 844 }],
    ]) {
      const page = await browser.newPage({ viewport: vp })
      await page.goto(`http://localhost:4352${r}`, { waitUntil: 'networkidle' })
      await page.locator('.vp-doc h1').first().waitFor({ state: 'visible', timeout: 45000 })
      await page
        .locator('.mg-guide-preview, .margin-graph-overview')
        .first()
        .waitFor({ state: 'visible', timeout: 45000 })
      await page.waitForTimeout(800)
      await page.emulateMedia({ colorScheme: 'light' })
      await page.evaluate(() => document.documentElement.classList.remove('dark'))
      await page.screenshot({ path: path.join(out, `${slug}-${vpName}-site-light.png`), fullPage: true })

      await page.emulateMedia({ colorScheme: 'dark' })
      await page.evaluate(() => document.documentElement.classList.add('dark'))
      await page.waitForTimeout(300)
      await page.screenshot({ path: path.join(out, `${slug}-${vpName}-site-dark.png`), fullPage: true })

      const btn = page.getByRole('button', { name: /dark preview/i }).first()
      if (await btn.count()) {
        await btn.click()
        await page.waitForFunction(
          () => document.querySelector('.mg-guide-preview.lab-dark') !== null,
          undefined,
          { timeout: 8000 },
        )
        await page.waitForTimeout(500)
        await page.screenshot({ path: path.join(out, `${slug}-${vpName}-dark-preview.png`), fullPage: true })
      }
      const chart = await page.locator('.fj-plot').count()
      const empty = await page.locator('.fj-state').count()
      console.log(JSON.stringify({ slug, vp: vpName, chart, empty, r }))
      await page.close()
    }
  }
  await browser.close()
  console.log('Saved to', out)
} finally {
  server.kill()
}