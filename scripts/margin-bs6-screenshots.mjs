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


const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['dev', root, '--port', '4348'], {
  stdio: 'ignore',
})
try {
  let ready = false
  for (let i = 0; i < 160; i++) {
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
    await page.goto(`http://localhost:4348${r}`, { waitUntil: 'domcontentloaded' })
    await page.locator('.vp-doc h1').first().waitFor({ state: 'visible', timeout: 30000 })
    await page
      .locator(
        '.mg-guide-preview .margin-bs6-root, .mg-guide-preview .margin-bs6-generic, .mg-guide-preview .kit-embedded, .mg-guide-preview .mg-swatch-grid',
      )
      .first()
      .waitFor({ state: 'visible', timeout: 30000 })
    await page.waitForFunction(
      () => {
        const frame = document.querySelector('.mg-guide-preview .mg-guide-frame')
        return frame && (frame.textContent?.trim().length ?? 0) > 8
      },
      { timeout: 30000 },
    )
    const title = await page.locator('.vp-doc h1').first().innerText()
    if (!title?.trim()) throw new Error(`missing h1 on ${r}`)
    await page.waitForTimeout(500)
    const slug = r.split('/').pop()
    const light = path.join(out, `margin-after-${slug}-1024-light.png`)
    await page.locator('.VPContent').screenshot({ path: light })
    const btn = page.getByRole('button', { name: /dark preview/i }).first()
    if (await btn.count()) {
      await btn.click()
      await page.waitForFunction(
        () => document.querySelector('.mg-guide-preview.lab-dark') !== null,
        undefined,
        { timeout: 5000 },
      )
      await page.waitForTimeout(400)
      const dark = path.join(out, `margin-after-${slug}-1024-dark-preview.png`)
      await page.locator('.VPContent').screenshot({ path: dark })
    }
  }
  await browser.close()
  console.log('Saved validated screenshots for', routes.length, 'routes')
} finally {
  server.kill()
}