#!/usr/bin/env node
/**
 * Margin preview audit: empty embedded demos, badge variant collapse, mirror copy text.
 */
import { chromium } from 'playwright'
import { MARGIN_BS6_IA } from './margin-bs6-ia.mjs'

const base = (process.env.MARGIN_AUDIT_BASE ?? 'http://127.0.0.1:4173').replace(/\/$/, '')

const COMPONENT_ALIASES = {
  spinners: 'spinners-loaders',
  spinner: 'spinners-loaders',
  navbar: 'navbar-and-footer',
  button: 'buttons',
  alert: 'alerts',
  dialog: 'modal',
  popover: 'popovers',
  tooltip: 'tooltips',
  placeholder: 'placeholders',
  tab: 'navs-tabs',
  nav: 'navs-tabs',
  menu: 'dropdowns',
  drawer: 'offcanvas',
}

function componentRoutes() {
  const rows = MARGIN_BS6_IA.components?.pages ?? []
  return rows
    .filter(([, , isIndex]) => !isIndex)
    .map(([slug]) => `/margin/components/${slug}`)
}

function formRoutes() {
  const rows = MARGIN_BS6_IA.forms?.pages ?? []
  return rows
    .filter(([, , isIndex]) => !isIndex)
    .map(([slug]) => (slug === 'overview' ? '/margin/forms/overview' : `/margin/forms/${slug}`))
}

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

const failures = []
const routes = [...componentRoutes(), ...formRoutes()]

for (const route of routes) {
  try {
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 120000 })
    await page.locator('.vp-doc h1').first().waitFor({ state: 'visible', timeout: 30000 })
  } catch (err) {
    failures.push({ route, kind: 'navigation', detail: String(err) })
    continue
  }

  const bodyText = await page.locator('.vp-doc').first().innerText()
  if (/Mirrors \[Bootstrap|mirror \[Bootstrap|Margin docs mirror/i.test(bodyText)) {
    failures.push({ route, kind: 'mirror-copy', detail: 'Bootstrap mirror lead still visible' })
  }

  const preview = page.locator('.mg-guide-preview .mg-guide-frame')
  const visible = await preview.isVisible().catch(() => false)
  if (!visible) {
    failures.push({ route, kind: 'empty-preview', detail: 'No mg-guide-frame' })
    continue
  }

  const interactiveCount = await preview
    .locator(
      ':is(.list-group, .chip, .alert, .card, .form-control, .btn-solid, .btn-outline, .badge, .modal, .collapse, button, a, input, select)',
    )
    .count()
  const textLen = (await preview.innerText()).replace(/\s+/g, ' ').trim().length
  if (interactiveCount < 1 && textLen < 24) {
    failures.push({ route, kind: 'empty-demo', detail: `interactive=${interactiveCount} textLen=${textLen}` })
  }

  if (route.endsWith('/badge')) {
    const bgs = await preview.locator('.badge').evaluateAll((nodes) =>
      nodes.map((n) => getComputedStyle(n).backgroundColor),
    )
    const uniq = new Set(bgs)
    if (uniq.size < 2 && bgs.length >= 2) {
      failures.push({ route, kind: 'badge-variants', detail: `collapsed to ${[...uniq].join(', ')}` })
    }
  }

  if (route.includes('/forms/')) {
    const fc = preview.locator('.form-control, .input-group, .form-floating').first()
    if (await fc.isVisible().catch(() => false)) {
      const br = await fc.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)
      const pad = await fc.evaluate((el) => parseFloat(getComputedStyle(el).paddingTop))
      if (parseFloat(br) < 2 || pad < 2) {
        failures.push({ route, kind: 'form-corners', detail: `radius=${br} pad=${pad}` })
      }
    }
  }
}

await browser.close()

const report = { base, routesScanned: routes.length, failures, failureCount: failures.length }
console.log(JSON.stringify(report, null, 2))
process.exit(failures.length ? 1 : 0)