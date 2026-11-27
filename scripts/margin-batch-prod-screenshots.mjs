#!/usr/bin/env node
/**
 * Production verification for Margin batch: agents + component polish pages.
 */
import { chromium } from 'playwright'
import path from 'node:path'

const out = '/opt/cursor/artifacts'
const base = (process.env.MARGIN_SCREENSHOT_BASE || 'https://templates.axeldiaz.com').replace(/\/$/, '')

const routes = [
  '/margin/components/accordion',
  '/margin/customize/color',
  '/margin/components/close-button',
  '/margin/components/spinner',
  '/margin/components/stepper',
  '/margin/components/toggler',
  '/margin/components/card',
  '/margin/components/carousel',
]

async function capture(page, route, tag) {
  const slug = route.split('/').pop() || 'page'
  const preview = page.locator('.mg-guide-preview').first()
  await preview.waitFor({ state: 'visible', timeout: 45000 })
  await page.waitForTimeout(500)
  await preview.screenshot({ path: path.join(out, `margin-batch-prod-${slug}-${tag}.png`) })
}

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
try {
  for (const [w, h, vtag] of [
    [1280, 900, '1280-light'],
    [390, 844, '390-light'],
  ]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } })
    for (const route of routes) {
      await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 120000 })
      await page.locator('.vp-doc h1').first().waitFor({ state: 'visible', timeout: 45000 })
      await capture(page, route, vtag)
      const darkBtn = page.getByRole('button', { name: /dark preview/i }).first()
      if (await darkBtn.count()) {
        await darkBtn.click()
        await page.waitForFunction(() => document.querySelector('.mg-guide-preview.lab-dark') !== null, { timeout: 8000 })
        await capture(page, route, vtag.replace('light', 'dark-preview'))
      }
    }
    await page.close()
  }

  const page = await browser.newPage()
  const accordion = await (await fetch(`${base}/margin/components/accordion`)).text()
  const hasAgent = /Para agentes|para agentes/i.test(accordion)
  const mdRes = await fetch(`${base}/margin/agents/components/accordion.md`)
  const llmsRes = await fetch(`${base}/margin/llms.txt`)
  console.log(
    JSON.stringify(
      {
        base,
        hasAgentPanelHtml: hasAgent,
        agentsMd: { status: mdRes.status, ct: mdRes.headers.get('content-type'), len: (await mdRes.text()).length },
        llms: { status: llmsRes.status, ct: llmsRes.headers.get('content-type'), head: (await llmsRes.text()).slice(0, 120) },
      },
      null,
      2,
    ),
  )
  await page.close()
  console.log('Saved batch prod screenshots to', out)
} finally {
  await browser.close()
}