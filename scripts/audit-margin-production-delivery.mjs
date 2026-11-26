#!/usr/bin/env node
/**
 * Production delivery audit + screenshots for Axel's Margin batch.
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { MARGIN_BS6_IA } from './margin-bs6-ia.mjs'

const base = (process.env.MARGIN_AUDIT_BASE ?? 'https://templates.axeldiaz.com').replace(/\/$/, '')
const outDir = process.env.MARGIN_ARTIFACT_DIR ?? '/opt/cursor/artifacts'
fs.mkdirSync(outDir, { recursive: true })

const results = {}

function pass(key, detail = 'ok') {
  results[key] = { pass: true, detail }
}
function fail(key, detail) {
  results[key] = { pass: false, detail }
}

function formRoutes() {
  return (MARGIN_BS6_IA.forms?.pages ?? [])
    .filter(([, , isIndex]) => !isIndex)
    .map(([slug]) => (slug === 'overview' ? '/margin/forms/overview' : `/margin/forms/${slug}`))
}

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  args: ['--no-sandbox'],
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

async function gotoRoute(route) {
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.locator('.vp-doc h1').first().waitFor({ state: 'visible', timeout: 45000 })
  await page.waitForTimeout(400)
}

// --- Forms corners ---
const formFails = []
for (const route of formRoutes()) {
  try {
    await gotoRoute(route)
    const ig = page.locator('.mg-guide-preview .input-group').first()
    if (await ig.isVisible().catch(() => false)) {
      const lastBtn = ig.locator('> button, > .btn, > .btn-outline, > .btn-solid').last()
      if (await lastBtn.isVisible().catch(() => false)) {
        const tl = await lastBtn.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)
        if (parseFloat(tl) > 0.1) {
          const tr = await lastBtn.evaluate((el) => getComputedStyle(el).borderTopRightRadius)
          if (parseFloat(tr) < 0.2) formFails.push(`${route}: trailing btn mis-joined tl=${tl} tr=${tr}`)
        }
      }
    }
    const fc = page.locator('.mg-guide-preview .form-control, .input-group').first()
    if (await fc.isVisible().catch(() => false)) {
      const br = await fc.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)
      if (parseFloat(br) < 1) formFails.push(`${route}: radius too small ${br}`)
    }
  } catch (e) {
    formFails.push(`${route}: ${e.message}`)
  }
}
formFails.length ? fail('forms_corners', formFails.slice(0, 5).join('; ')) : pass('forms_corners', `${formRoutes().length} routes`)

// --- Mirror copy ---
const mirrorHits = []
for (const route of ['/margin/', '/margin/guides/quickstart', '/margin/components/badge', '/margin/forms/overview']) {
  await gotoRoute(route.replace(/\/$/, '') || '/margin/')
  const t = await page.locator('.vp-doc').first().innerText()
  if (/Mirrors \[Bootstrap|Mirrors Bootstrap v6|mirror \[Bootstrap/i.test(t)) mirrorHits.push(route)
}
mirrorHits.length ? fail('mirror_copy', mirrorHits.join(',')) : pass('mirror_copy')

// --- Badge colors ---
await gotoRoute('/margin/components/badge')
const bgs = await page.locator('.mg-guide-preview .badge').evaluateAll((nodes) =>
  nodes.map((n) => getComputedStyle(n).backgroundColor),
)
const uniq = [...new Set(bgs.filter((b) => b && b !== 'rgba(0, 0, 0, 0)'))]
uniq.length >= 2 ? pass('badge_colors', `${uniq.length} distinct`) : fail('badge_colors', JSON.stringify(bgs.slice(0, 6)))

// --- Nav flicker (client nav between two component pages) ---
await gotoRoute('/margin/components/button')
const t0 = Date.now()
await page.locator('.VPSidebar a[href*="/margin/components/alert"]').first().click()
await page.locator('.vp-doc h1').first().waitFor({ state: 'visible' })
const dt = Date.now() - t0
const hasCatalog = await page.locator('.mg-guide-preview .list-group, .mg-guide-preview .alert').first().isVisible()
hasCatalog && dt < 8000 ? pass('nav_flicker', `nav ${dt}ms; preview visible`) : fail('nav_flicker', `dt=${dt} catalog=${hasCatalog}`)

// --- Component spot checks ---
const checks = [
  {
    key: 'alerts',
    route: '/margin/components/alert',
    sel: '.mg-guide-preview .alert .btn-close, .mg-guide-preview .alert.theme-success',
  },
  { key: 'card_buttons', route: '/margin/components/card', sel: '.mg-guide-preview .card .btn-outline, .mg-guide-preview .card-foot button' },
  { key: 'carousel', route: '/margin/components/carousel', sel: '.mg-guide-preview .carousel, .mg-guide-preview button[aria-label*="slide"]' },
  { key: 'chips', route: '/margin/components/chips', sel: '.mg-guide-preview .chip' },
  { key: 'close_button', route: '/margin/components/close-button', sel: '.mg-guide-preview .btn-close' },
  { key: 'list_group', route: '/margin/components/list-group', sel: '.mg-guide-preview .list-group-item' },
  { key: 'navs_tabs', route: '/margin/components/nav', sel: '.mg-guide-preview .nav-tabs .nav-link, .mg-guide-preview .nav-pills .nav-link' },
]
for (const c of checks) {
  try {
    await gotoRoute(c.route)
    const n = await page.locator(c.sel).count()
    n >= 1 ? pass(c.key, `matches=${n}`) : fail(c.key, 'missing demo nodes')
  } catch (e) {
    fail(c.key, e.message)
  }
}

// --- Collapse open/closed ---
await gotoRoute('/margin/components/collapse')
const toggle = page
  .locator('.mg-guide-preview .margin-bs6-root button.btn-solid.theme-primary')
  .filter({ hasText: /delivery details/i })
  .first()
await toggle.click()
await page.waitForTimeout(350)
const open = await page.locator('.mg-guide-preview .collapse.show, .mg-guide-preview .collapse[style*="height"]').count()
await toggle.click()
await page.waitForTimeout(350)
const closed = await page.locator('.mg-guide-preview .collapse.show').count()
open >= 1 && closed === 0 ? pass('collapse', 'toggle ok') : fail('collapse', `open=${open} closed=${closed}`)

// --- Modal centered (modal alias → dialog component doc) ---
await gotoRoute('/margin/components/modal')
const modalBtn = page.getByRole('button', { name: /Default modal/i })
await modalBtn.scrollIntoViewIfNeeded()
await modalBtn.click()
const dialog = page.locator('.modal.show .modal-dialog').first()
await dialog.waitFor({ state: 'visible', timeout: 15000 })
const box = await dialog.boundingBox()
const vp = page.viewportSize()
const cx = Math.abs(box.x + box.width / 2 - vp.width / 2) < vp.width * 0.1
const topOk = box.y >= 8 && box.y <= vp.height * 0.4
await page.keyboard.press('Escape')
cx && topOk ? pass('dialog_modal', `y=${Math.round(box.y)}`) : fail('dialog_modal', JSON.stringify(box))

// --- Placeholders visible + animated ---
await gotoRoute('/margin/components/placeholder')
const op = await page.locator('.mg-guide-preview .placeholder').first().evaluate((el) => parseFloat(getComputedStyle(el).opacity))
const anim = await page.locator('.mg-guide-preview .placeholder-wave, .mg-guide-preview .placeholder-glow').first().evaluate((el) => getComputedStyle(el).animationName)
op >= 0.15 && anim && anim !== 'none' ? pass('placeholders', `opacity=${op} anim=${anim}`) : fail('placeholders', `opacity=${op} anim=${anim}`)
const nPh = await page.locator('.mg-guide-preview .placeholder').count()
if (nPh < 5) fail('placeholders', `only ${nPh} placeholders`)

// --- Screenshots ---
const shotRoutes = [
  { route: '/margin/forms/input-group', name: 'forms-input-group' },
  { route: '/margin/components/alert', name: 'alerts' },
  { route: '/margin/components/badge', name: 'badge' },
  { route: '/margin/components/card', name: 'card' },
  { route: '/margin/components/carousel', name: 'carousel' },
  { route: '/margin/components/chips', name: 'chips' },
  { route: '/margin/components/close-button', name: 'close-button' },
  { route: '/margin/components/collapse', name: 'collapse' },
  { route: '/margin/components/dialog', name: 'dialog' },
  { route: '/margin/components/list-group', name: 'list-group' },
  { route: '/margin/components/nav', name: 'navs-tabs' },
  { route: '/margin/components/placeholder', name: 'placeholders' },
]
for (const s of shotRoutes) {
  await gotoRoute(s.route)
  await page.locator('.vp-doc h1').first().waitFor()
  const target = page.locator('.mg-guide-preview .margin-bs6-root, .mg-guide-preview .margin-bs6-forms').first()
  await (await target.isVisible() ? target : page.locator('.mg-guide-preview')).screenshot({
    path: path.join(outDir, `margin-prod-${s.name}-1024.png`),
  })
}

await browser.close()

const report = { base, results, passCount: Object.values(results).filter((r) => r.pass).length, failCount: Object.values(results).filter((r) => !r.pass).length }
console.log(JSON.stringify(report, null, 2))
process.exit(report.failCount ? 1 : 0)