#!/usr/bin/env node
/** Badge Colors row — light/dark badges at mobile + desktop, light/dark page + dark preview. */
import { chromium } from 'playwright'
import path from 'node:path'

const out = '/opt/cursor/artifacts'
const argBase = process.argv.find((a, i) => process.argv[i - 1] === '--base')
const base = (argBase ?? process.env.MARGIN_AUDIT_BASE ?? 'https://templates.axeldiaz.com').replace(/\/$/, '')

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })

async function shot(name, viewport, colorScheme, afterDarkPreview = false) {
  const page = await browser.newPage({ viewport, colorScheme })
  await page.goto(`${base}/margin/components/badge/`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('.mg-badge-demo').first().waitFor({ state: 'visible', timeout: 60000 })
  if (afterDarkPreview) {
    await page.getByRole('button', { name: /Dark preview/i }).click()
    await page.waitForTimeout(800)
  }
  await page.locator('.mg-badge-demo').first().screenshot({
    path: path.join(out, `margin-prod-badge-colors-${name}.png`),
  })
  const light = await page.locator('.text-bg-light').first().evaluate((e) => ({
    bg: getComputedStyle(e).backgroundColor,
    fg: getComputedStyle(e).color,
  }))
  const dark = await page.locator('.text-bg-dark').first().evaluate((e) => ({
    bg: getComputedStyle(e).backgroundColor,
    fg: getComputedStyle(e).color,
  }))
  console.log(name, { light, dark })
  await page.close()
}

await shot('1024-light', { width: 1280, height: 900 }, 'light')
await shot('390-light', { width: 390, height: 844 }, 'light')
await shot('1024-dark', { width: 1280, height: 900 }, 'dark')
await shot('390-dark', { width: 390, height: 844 }, 'dark')
await shot('390-dark-preview', { width: 390, height: 844 }, 'light', true)

await browser.close()
console.log('badge contrast screenshots ok')