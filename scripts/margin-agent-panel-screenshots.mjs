#!/usr/bin/env node
import { chromium } from 'playwright'
import path from 'node:path'

const out = '/opt/cursor/artifacts'
const argBase = process.argv.find((a, i) => process.argv[i - 1] === '--base')
const base = (argBase ?? process.env.MARGIN_AUDIT_BASE ?? 'https://templates.axeldiaz.com').replace(/\/$/, '')

async function snap(page, name) {
  await page.screenshot({ path: path.join(out, name), fullPage: false })
}

async function openAgents(page) {
  const toggle = page.getByRole('button', { name: 'Para agentes' })
  await toggle.waitFor({ state: 'visible', timeout: 45000 })
  await toggle.click()
  await page.getByRole('tab', { name: 'Renderizado' }).waitFor({ state: 'visible' })
  await page.waitForTimeout(500)
}

async function setSiteDark(page, dark) {
  const root = page.locator('html')
  const isDark = await root.evaluate((el) => el.classList.contains('tpl-dark'))
  if (isDark !== dark) {
    const btn = page.locator('.tpl-theme-toggle')
    if (await btn.count()) await btn.click()
    await page.waitForTimeout(400)
  }
}

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })

// Accordion — rendered + markdown, light/dark, mobile
for (const [suffix, dark] of [
  ['light', false],
  ['dark', true],
]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${base}/margin/components/accordion`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('h1').first().waitFor({ state: 'visible' })
  await page.locator('.mg-guide-preview').first().waitFor({ state: 'visible' })
  await setSiteDark(page, dark)
  await openAgents(page)
  await snap(page, `margin-agent-accordion-rendered-1280-${suffix}.png`)
  await page.getByRole('tab', { name: 'Markdown' }).click()
  await page.waitForTimeout(300)
  await snap(page, `margin-agent-accordion-markdown-1280-${suffix}.png`)
  await page.close()
}

{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  await page.goto(`${base}/margin/components/accordion`, { waitUntil: 'domcontentloaded' })
  await page.locator('h1').first().waitFor()
  await openAgents(page)
  await snap(page, 'margin-agent-accordion-rendered-390.png')
  await page.close()
}

// Customize color
for (const [suffix, dark] of [
  ['light', false],
  ['dark', true],
]) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.goto(`${base}/margin/customize/color`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('h1').first().waitFor()
  await setSiteDark(page, dark)
  await openAgents(page)
  await snap(page, `margin-agent-customize-color-1280-${suffix}.png`)
  await page.close()
}

await browser.close()
console.log('margin-agent-panel screenshots ok')