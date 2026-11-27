#!/usr/bin/env node
import { chromium } from 'playwright'
import path from 'node:path'

const out = '/opt/cursor/artifacts'
const argBase = process.argv.find((a, i) => process.argv[i - 1] === '--base')
const base = (argBase ?? process.env.MARGIN_AUDIT_BASE ?? 'https://templates.axeldiaz.com').replace(/\/$/, '')

async function snapPreview(page, name) {
  const preview = page.locator('.mg-guide-preview').first()
  await preview.waitFor({ state: 'visible', timeout: 45000 })
  await preview.screenshot({ path: path.join(out, name) })
}

async function agentsToggle(page) {
  return page.getByRole('button', { name: 'Agents' })
}

async function openAgents(page) {
  const toggle = await agentsToggle(page)
  await toggle.waitFor({ state: 'visible', timeout: 45000 })
  const pressed = await toggle.getAttribute('aria-pressed')
  if (pressed !== 'true') await toggle.click()
  await page.getByRole('tab', { name: 'Rendered' }).waitFor({ state: 'visible' })
  await page.waitForTimeout(400)
}

async function closeAgents(page) {
  const toggle = await agentsToggle(page)
  if ((await toggle.getAttribute('aria-pressed')) === 'true') await toggle.click()
  await page.waitForTimeout(300)
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

async function setPreviewDark(page, dark) {
  const btn = page.getByRole('button', { name: /preview$/i })
  const light = await btn.textContent()
  const wantsLight = !dark
  const isLightLabel = /light/i.test(light ?? '')
  if (wantsLight !== isLightLabel) await btn.click()
  await page.waitForTimeout(250)
}

async function auditRoute(browser, route, slug) {
  for (const [w, h, tag] of [
    [1280, 900, '1280'],
    [390, 844, '390'],
  ]) {
    for (const [siteDark, siteTag] of [
      [false, 'light'],
      [true, 'dark'],
    ]) {
      const page = await browser.newPage({ viewport: { width: w, height: h } })
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 120000 })
      await page.locator('h1').first().waitFor({ state: 'visible' })
      await setSiteDark(page, siteDark)
      await closeAgents(page)
      await snapPreview(page, `margin-agents-${slug}-off-${tag}-${siteTag}.png`)
      await openAgents(page)
      await snapPreview(page, `margin-agents-${slug}-rendered-${tag}-${siteTag}.png`)
      await page.getByRole('tab', { name: 'Markdown' }).click()
      await page.waitForTimeout(300)
      await snapPreview(page, `margin-agents-${slug}-markdown-${tag}-${siteTag}.png`)
      if (w === 390) {
        await setPreviewDark(page, true)
        await snapPreview(page, `margin-agents-${slug}-markdown-390-preview-dark.png`)
      }
      await page.close()
    }
  }
}

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
try {
  await auditRoute(browser, '/margin/components/accordion', 'accordion')
  await auditRoute(browser, '/margin/customize/color', 'customize-color')
  const page = await browser.newPage()
  const html = await (await fetch(`${base}/margin/components/accordion`)).text()
  const hasAgent = /\bAgents\b/.test(html) && !/Para agentes/i.test(html)
  console.log(JSON.stringify({ base, agentsToolbarInHtml: hasAgent }, null, 2))
  await page.close()
  console.log('margin-agent-panel screenshots ok →', out)
} finally {
  await browser.close()
}