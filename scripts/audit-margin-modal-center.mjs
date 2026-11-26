#!/usr/bin/env node
import { chromium } from 'playwright'

const base = (process.env.MARGIN_AUDIT_BASE ?? 'https://templates.axeldiaz.com').replace(/\/$/, '')

async function checkModal(page, viewport) {
  await page.setViewportSize(viewport)
  await page.goto(`${base}/margin/components/dialog`, { waitUntil: 'networkidle' })
  await page.locator('h1').first().waitFor()
  await page.locator('button', { hasText: 'Default modal' }).click()
  const dialog = page.locator('.modal.show .modal-dialog').first()
  await dialog.waitFor({ state: 'visible', timeout: 15000 })
  const box = await dialog.boundingBox()
  if (!box) throw new Error('modal-dialog missing box')
  const centerX = box.x + box.width / 2
  const centerY = box.y + box.height / 2
  const centeredX = Math.abs(centerX - viewport.width / 2) < viewport.width * 0.08
  const centeredY = Math.abs(centerY - viewport.height / 2) < viewport.height * 0.15
  return { viewport, box, centeredX, centeredY, pass: centeredX && centeredY }
}

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const page = await browser.newPage()
const desktop = await checkModal(page, { width: 1280, height: 800 })
await page.keyboard.press('Escape')
await page.waitForTimeout(400)
const mobile = await checkModal(page, { width: 390, height: 844 })
await browser.close()
const report = { base, desktop, mobile, failureCount: [desktop, mobile].filter((r) => !r.pass).length }
console.log(JSON.stringify(report, null, 2))
process.exit(report.failureCount ? 1 : 0)