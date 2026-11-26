#!/usr/bin/env node
import { chromium } from 'playwright'
import path from 'node:path'

const out = '/opt/cursor/artifacts'
const base = 'https://templates.axeldiaz.com'
const routes = [
  { path: '/margin/guides/quickstart', name: 'quickstart-page' },
  { path: '/margin/guides/quickstart', name: 'quickstart-starter-zoom', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/getting-started/', name: 'getting-started' },
  { path: '/margin/customize/overview', name: 'customize-overview' },
  { path: '/margin/guides/migration', name: 'guides-migration' },
  { path: '/margin/guides/contribute', name: 'guides-contribute' },
  { path: '/margin/components/list-group', name: 'component-list-group', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/nav', name: 'component-navs-tabs', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/placeholders', name: 'component-placeholders', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/alerts', name: 'component-alerts', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/badge', name: 'component-badge', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/carousel', name: 'component-carousel', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/chips', name: 'component-chips', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/close-button', name: 'component-close-button', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/collapse', name: 'component-collapse', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/components/dialog', name: 'component-dialog', zoom: '.mg-guide-preview .margin-bs6-root' },
  { path: '/margin/forms/overview', name: 'forms-overview', zoom: '.mg-guide-preview .margin-bs6-root' },
]

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1024, height: 900 } })

for (const r of routes) {
  await page.goto(`${base}${r.path}`, { waitUntil: 'networkidle', timeout: 90000 })
  await page.locator('.vp-doc h1').first().waitFor({ state: 'visible', timeout: 30000 })
  await page.waitForTimeout(600)
  const target = r.zoom ? page.locator(r.zoom).first() : page.locator('.VPContent')
  await target.screenshot({ path: path.join(out, `margin-prod-${r.name}-1024.png`) })
  if (r.path.includes('quickstart')) {
    const bg = await page.$eval('button.btn-solid.theme-primary', (el) => getComputedStyle(el).backgroundColor)
    if (bg === 'rgba(0, 0, 0, 0)' || bg === 'rgb(239, 239, 239)') {
      throw new Error(`quickstart primary button still unstyled: ${bg}`)
    }
    const markup = await page.$eval('.margin-bs6-doc-code code', (el) => el.textContent.trim())
    if (/^<div class="lab/i.test(markup) && markup.toLowerCase().includes('<!doctype')) {
      throw new Error('quickstart copy still wraps doctype in lab div')
    }
  }
}
await browser.close()
console.log('prod screenshots ok', routes.length)