#!/usr/bin/env node
/** Mid-transition frames for accordion + Dark preview toggle (production). */
import { chromium } from 'playwright'
import path from 'node:path'

const base = (process.env.MARGIN_AUDIT_BASE ?? 'https://templates.axeldiaz.com').replace(/\/$/, '')
const out = '/opt/cursor/artifacts'

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' })

async function snap(file, clip) {
  if (clip) {
    await page.screenshot({ path: path.join(out, file), clip })
  } else {
    await page.locator('.mg-guide-preview').first().screenshot({ path: path.join(out, file) })
  }
}

await page.emulateMedia({ reducedMotion: 'no-preference' })
await page.goto(`${base}/margin/components/accordion`, { waitUntil: 'domcontentloaded', timeout: 120000 })
await page.locator('.mg-guide-preview').first().waitFor({ visible: true })

const behBtn = page.locator('.l-accordion button').filter({ hasText: 'Behavior' })
await behBtn.click()
await snap('margin-motion-accordion-t0.png')
await page.waitForTimeout(100)
await snap('margin-motion-accordion-t100ms.png')
await page.waitForTimeout(150)
await snap('margin-motion-accordion-t250ms.png')

await page.goto(`${base}/margin/content/reboot`, { waitUntil: 'domcontentloaded' })
await page.locator('.mg-guide-preview').first().waitFor({ visible: true })
const toggle = page.locator('.mg-guide-toggle')
await toggle.click()
await snap('margin-motion-preview-dark-t0.png')
await page.waitForTimeout(100)
await snap('margin-motion-preview-dark-t100ms.png')
await page.waitForTimeout(150)
await snap('margin-motion-preview-dark-t250ms.png')

await page.emulateMedia({ reducedMotion: 'reduce' })
await page.goto(`${base}/margin/components/accordion`, { waitUntil: 'domcontentloaded' })
await page.locator('.mg-guide-preview').first().waitFor({ visible: true })
const acc = page.locator('.l-accordion button').filter({ hasText: 'Accessibility' })
const boxBefore = await acc.boundingBox()
await acc.click()
await page.waitForTimeout(50)
const boxAfter = await acc.boundingBox()
await snap('margin-motion-accordion-reduced-motion.png')
console.log('reduced-motion accordion click', { boxBefore, boxAfter })

await browser.close()
console.log('margin-motion capture ok')