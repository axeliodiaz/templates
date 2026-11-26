#!/usr/bin/env node
import { chromium } from 'playwright'
import path from 'node:path'

const out = '/opt/cursor/artifacts'
const routes = [
  '/margin/utilities/flex',
  '/margin/components/accordion',
  '/margin/components/button',
  '/margin/forms/checkbox',
]

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1024, height: 900 } })
for (const r of routes) {
  await page.goto(`https://templates.axeldiaz.com${r}`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.locator('.vp-doc h1').first().waitFor({ state: 'visible', timeout: 30000 })
  await page.waitForTimeout(800)
  const slug = r.split('/').pop()
  await page.locator('.VPContent').screenshot({ path: path.join(out, `margin-prod-${slug}-1024.png`) })
  const html = await page.content()
  if (html.includes('Lateral detail drawer')) throw new Error(`drawer leak on ${r}`)
  if (r.includes('flex') && !html.includes('mg-demo-surface')) throw new Error('flex missing mg-demo-surface on prod')
}
await browser.close()
console.log('prod screenshots ok', routes.length)