#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'

const root = process.argv.find((a) => a.endsWith('templates')) || '/agent/repos/templates'
const out = '/opt/cursor/artifacts/margin-arc-fix'
fs.mkdirSync(out, { recursive: true })

const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['dev', root, '--port', '4353'], {
  stdio: 'ignore',
})
try {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch('http://localhost:4353/margin/graphs/arc')).ok) break
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  for (const [vpName, vp] of [
    ['1024', { width: 1024, height: 900 }],
    ['390', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport: vp })
    await page.goto('http://localhost:4353/margin/graphs/arc', { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    for (const [mode, fn] of [
      ['light', async () => {}],
      ['dark', async () => {
        await page.emulateMedia({ colorScheme: 'dark' })
        await page.evaluate(() => document.documentElement.classList.add('dark'))
      }],
      ['dark-preview', async () => {
        await page.getByRole('button', { name: /dark preview/i }).click()
      }],
    ]) {
      await fn()
      await page.waitForTimeout(400)
      const stack = page.locator('.fj-plot-stack--arc')
      await stack.screenshot({ path: path.join(out, `arc-multi-${vpName}-${mode}.png`) })
    }
    await page.selectOption('.mg-graph-variant select', 'single')
    await page.waitForTimeout(600)
    await page.locator('.fj-plot-stack--arc').screenshot({
      path: path.join(out, `arc-single-${vpName}.png`),
    })
    const dots = await page.locator('.fj-legend-dot').evaluateAll((els) =>
      els.map((el) => getComputedStyle(el).backgroundColor),
    )
    const strokes = await page
      .locator('.fj-plot--arc path[stroke-width="14"]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('stroke')))
    console.log({ vp: vpName, dots, strokes: strokes.slice(0, 6) })
    await page.close()
  }
  await browser.close()
} finally {
  server.kill()
}