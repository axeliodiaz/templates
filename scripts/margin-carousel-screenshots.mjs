#!/usr/bin/env node
/**
 * Carousel guide: light, dark preview, 390px — verifies images render in slides.
 */
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = '/opt/cursor/artifacts'
const route = '/margin/components/carousel'
const base = process.env.MARGIN_SCREENSHOT_BASE || 'http://localhost:4349'

async function waitReady(url) {
  for (let i = 0; i < 160; i++) {
    try {
      if ((await fetch(url)).ok) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 250))
  }
  return false
}

async function capture(page, name) {
  const preview = page.locator('.mg-guide-preview').first()
  await preview.waitFor({ state: 'visible', timeout: 30000 })
  await page.waitForFunction(
    () => {
      const imgs = document.querySelectorAll('.mg-carousel-demo img.mg-carousel-img')
      return imgs.length >= 3 && [...imgs].every((img) => img.naturalWidth > 0)
    },
    { timeout: 30000 },
  )
  await page.waitForTimeout(400)
  await preview.screenshot({ path: path.join(out, name) })
}

let server
if (!process.env.MARGIN_SCREENSHOT_BASE) {
  server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['dev', root, '--port', '4349'], {
    stdio: 'ignore',
  })
  if (!(await waitReady(`${base}${route}`))) throw new Error('vitepress not ready')
}

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
try {
  for (const [w, h, tag] of [
    [1280, 900, '1280-light'],
    [390, 844, '390-light'],
  ]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } })
    await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' })
    await page.locator('.vp-doc h1').first().waitFor({ state: 'visible', timeout: 30000 })
    await capture(page, `margin-carousel-${tag}.png`)

    const darkBtn = page.getByRole('button', { name: /dark preview/i }).first()
    if (await darkBtn.count()) {
      await darkBtn.click()
      await page.waitForFunction(() => document.querySelector('.mg-guide-preview.lab-dark') !== null, { timeout: 5000 })
      await capture(page, `margin-carousel-${tag.replace('light', 'dark-preview')}.png`)
    }
    await page.close()
  }
  console.log('Saved margin-carousel screenshots to', out)
} finally {
  await browser.close()
  server?.kill()
}