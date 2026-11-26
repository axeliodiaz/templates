#!/usr/bin/env node
/** Production screenshots: wait for h1, zoom preview, open modals for dialog captures. */
import { chromium } from 'playwright'
import path from 'node:path'

const out = '/opt/cursor/artifacts'
const argBase = process.argv.find((a, i) => process.argv[i - 1] === '--base')
const base = (argBase ?? process.env.MARGIN_AUDIT_BASE ?? 'https://templates.axeldiaz.com').replace(/\/$/, '')
const withSlash = (p) => (p.endsWith('/') ? p : `${p}/`)

const routes = [
  { path: '/margin/components/alert', name: 'alerts-polish', zoom: '.mg-alert-demo' },
  { path: '/margin/components/badge', name: 'badge-polish', zoom: '.mg-badge-demo' },
  { path: '/margin/components/chips', name: 'chips-polish' },
  { path: '/margin/forms/input-group', name: 'forms-input-group-polish' },
  { path: '/margin/components/card', name: 'card-polish' },
  { path: '/margin/components/carousel', name: 'carousel-polish' },
  { path: '/margin/components/close-button', name: 'close-button-polish' },
  { path: '/margin/components/collapse', name: 'collapse-polish' },
  { path: '/margin/components/list-group', name: 'list-group-polish' },
  { path: '/margin/components/nav', name: 'navs-tabs-polish' },
  { path: '/margin/components/placeholder', name: 'placeholders-polish', zoom: '.mg-placeholder-demo' },
  { path: '/margin/components/modal', name: 'dialog-closed', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/modal', name: 'dialog-default-open', zoom: '.modal.show .modal-dialog', openModal: 'default' },
  { path: '/margin/components/modal', name: 'dialog-viewport-open', openModal: 'default', fullPage: true },
]

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })

for (const r of routes) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${base}${withSlash(r.path)}`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('.vp-doc h1').first().waitFor({ state: 'visible', timeout: 45000 })
  await page.locator('.mg-guide-preview').first().waitFor({ state: 'visible', timeout: 45000 })
  await page.waitForTimeout(1200)
  if (r.openModal) {
    await page.getByRole('button', { name: /Default modal/i }).click()
    await page.locator('.modal.show .modal-dialog').first().waitFor({ state: 'visible', timeout: 15000 })
    await page.waitForTimeout(400)
  }
  if (r.fullPage) {
    await page.screenshot({ path: path.join(out, `margin-prod-${r.name}-1280.png`) })
  } else {
    const sel = r.zoom ?? '.mg-guide-preview .margin-bs6-root, .mg-guide-preview .margin-bs6-forms'
    const target = page.locator(sel).first()
    await target.waitFor({ state: 'visible', timeout: 45000 })
    await target.screenshot({ path: path.join(out, `margin-prod-${r.name}-1024.png`) })
  }
  await page.close()
}

// Mobile dialog open
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(`${base}/margin/components/modal/`, { waitUntil: 'domcontentloaded' })
  await page.locator('h1').first().waitFor()
  await page.getByRole('button', { name: /Default modal/i }).click()
  await page.locator('.modal.show .modal-dialog').first().waitFor({ state: 'visible' })
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(out, 'margin-prod-dialog-open-mobile-390.png') })
  await page.close()
}

await browser.close()
console.log('visual screenshots ok', routes.length + 1)