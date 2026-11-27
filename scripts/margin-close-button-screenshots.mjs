#!/usr/bin/env node
import { chromium } from 'playwright'
import path from 'node:path'

const out = '/opt/cursor/artifacts'
const argBase = process.argv.find((a, i) => process.argv[i - 1] === '--base')
const base = (argBase ?? process.env.MARGIN_AUDIT_BASE ?? 'https://templates.axeldiaz.com').replace(/\/$/, '')

async function setSiteDark(page, dark) {
  const isDark = await page.locator('html').evaluate((el) => el.classList.contains('tpl-dark'))
  if (isDark !== dark) {
    await page.locator('.tpl-theme-toggle').click()
    await page.waitForTimeout(400)
  }
}

async function setPreviewDark(page, dark) {
  const btn = page.getByRole('button', { name: /Dark preview|Light preview/i })
  if (!(await btn.count())) return
  const label = await btn.innerText()
  const isDark = /light preview/i.test(label)
  if (isDark !== dark) {
    await btn.click()
    await page.waitForTimeout(500)
  }
}

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })

for (const [suffix, siteDark, previewDark] of [
  ['light-site-light-preview', false, false],
  ['light-site-dark-preview', false, true],
  ['dark-site-dark-preview', true, true],
]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } })
  await page.goto(`${base}/margin/components/close-button`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('.mg-guide-preview').first().waitFor({ state: 'visible', timeout: 60000 })
  await page.locator('.mg-close-demo').first().waitFor({ state: 'visible', timeout: 60000 })
  await setSiteDark(page, siteDark)
  await setPreviewDark(page, previewDark)
  await page.waitForTimeout(400)
  await page.locator('.mg-guide-preview').screenshot({ path: path.join(out, `margin-close-button-${suffix}-1280.png`) })
  await page.close()
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 900 } })
  await page.goto(`${base}/margin/components/close-button`, { waitUntil: 'domcontentloaded' })
  await page.locator('.mg-close-demo').first().waitFor({ state: 'visible', timeout: 60000 })
  await page.locator('.mg-guide-preview').screenshot({ path: path.join(out, 'margin-close-button-mobile-390.png') })
  await page.close()
}

await browser.close()
console.log('margin-close-button screenshots ok')