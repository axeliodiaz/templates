#!/usr/bin/env node
/**
 * Render-time audit: every .btn* inside Margin doc previews must look like a control
 * (padding + non-transparent fill or visible border). Compares against /margin/components/button baseline.
 *
 * Usage:
 *   MARGIN_AUDIT_BASE=http://127.0.0.1:4173 node scripts/audit-margin-button-render.mjs
 *   MARGIN_AUDIT_BASE=https://templates.axeldiaz.com node scripts/audit-margin-button-render.mjs
 */
import { chromium } from 'playwright'
import { MARGIN_BS6_IA } from './margin-bs6-ia.mjs'

const base = (process.env.MARGIN_AUDIT_BASE ?? 'http://127.0.0.1:4173').replace(/\/$/, '')

function collectRoutes() {
  const out = []
  for (const [key, block] of Object.entries(MARGIN_BS6_IA)) {
    const area = key === 'gettingStarted' ? 'getting-started' : key
    for (const [slug, , isIndex] of block.pages) {
      if (area === 'getting-started' && slug === 'introduction') {
        out.push('/margin/getting-started/')
        continue
      }
      if (isIndex) out.push(`/margin/${area}/`)
      else out.push(`/margin/${area}/${slug}`)
    }
  }
  return [...new Set(out)].sort()
}

function isTransparentBg(bg) {
  if (!bg || bg === 'transparent') return true
  const m = bg.match(/rgba?\(([^)]+)\)/)
  if (!m) return false
  const parts = m[1].split(',').map((p) => p.trim())
  if (parts.length === 4) return parseFloat(parts[3]) === 0
  return false
}

function looksStyled(cs, className) {
  const padT = parseFloat(cs.paddingTop)
  const padL = parseFloat(cs.paddingLeft)
  const borderW = parseFloat(cs.borderTopWidth)
  const hasPad = padT >= 4 && padL >= 6
  const hasBg = !isTransparentBg(cs.backgroundColor)
  const hasBorder =
    borderW >= 1 && cs.borderTopStyle !== 'none' && !/rgba?\(0,\s*0,\s*0/.test(cs.borderTopColor)
  if (/\bbtn-link\b/.test(className)) {
    return hasPad || cs.textDecorationLine.includes('underline')
  }
  if (/\bbtn-solid\b/.test(className)) {
    return hasPad && hasBg
  }
  if (/\bbtn-outline\b/.test(className)) {
    return hasPad && (hasBorder || hasBg)
  }
  return hasPad && (hasBg || hasBorder)
}

async function auditButtonsOnPage(page, route) {
  const failures = []
  const buttons = await page.$$('.mg-guide-preview .margin-bs6-root [class*="btn-"]')
  for (const el of buttons) {
    const meta = await el.evaluate((node) => ({
      className: node.className,
      text: (node.textContent ?? '').trim().slice(0, 40),
      tag: node.tagName.toLowerCase(),
    }))
    if (!/\b(btn-solid|btn-outline|btn-link|btn-subtle|btn-text|btn-danger)\b/.test(meta.className)) continue
    if (meta.tag === 'button' && (await el.getAttribute('disabled')) !== null) continue
    const cs = await el.evaluate((node) => {
      const s = getComputedStyle(node)
      return {
        paddingTop: s.paddingTop,
        paddingLeft: s.paddingLeft,
        backgroundColor: s.backgroundColor,
        borderTopWidth: s.borderTopWidth,
        borderTopStyle: s.borderTopStyle,
        borderTopColor: s.borderTopColor,
        textDecorationLine: s.textDecorationLine,
      }
    })
    if (!looksStyled(cs, meta.className)) {
      failures.push({ ...meta, ...cs, route })
    }
  }
  return failures
}

const routes = collectRoutes()
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

const refRoute = '/margin/components/button'
await page.goto(`${base}${refRoute}`, { waitUntil: 'networkidle', timeout: 120000 })
const refBtn = await page.$('.margin-bs6-root .btn-solid.theme-primary')
if (!refBtn) {
  console.error('Baseline missing: no .btn-solid.theme-primary on', refRoute)
  process.exit(2)
}
const refOk = await refBtn.evaluate((node) => {
  const s = getComputedStyle(node)
  return {
    paddingTop: s.paddingTop,
    paddingLeft: s.paddingLeft,
    backgroundColor: s.backgroundColor,
    borderTopWidth: s.borderTopWidth,
    borderTopStyle: s.borderTopStyle,
    borderTopColor: s.borderTopColor,
    textDecorationLine: s.textDecorationLine,
  }
})
if (!looksStyled(refOk, 'btn-solid theme-primary')) {
  console.error('Baseline button still unstyled on reference page', refOk)
  process.exit(2)
}

const allFailures = []
let scanned = 0
let pagesWithButtons = 0

for (const route of routes) {
  try {
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 120000 })
    await page.locator('.VPContent').waitFor({ state: 'visible', timeout: 30000 })
  } catch (err) {
    allFailures.push({ route, error: String(err), className: '(navigation)' })
    continue
  }
  scanned += 1
  const fails = await auditButtonsOnPage(page, route)
  if (fails.length) allFailures.push(...fails)
  else {
    const count = await page.$$eval(
      '.mg-guide-preview .margin-bs6-root [class*="btn-solid"], .mg-guide-preview .margin-bs6-root [class*="btn-outline"]',
      (nodes) => nodes.length,
    )
    if (count > 0) pagesWithButtons += 1
  }
}

await browser.close()

const report = {
  base,
  routesScanned: scanned,
  routesTotal: routes.length,
  pagesWithStyledButtons: pagesWithButtons,
  failures: allFailures,
  failureCount: allFailures.length,
  baseline: { route: refRoute, ...refOk },
}

console.log(JSON.stringify(report, null, 2))
process.exit(allFailures.length ? 1 : 0)