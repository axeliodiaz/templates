// Smoke test for the Felix decision tree: queue, hover, commit, keyboard,
// other…, empty state, reduced motion, and responsive screenshots.
const { chromium } = require('playwright')
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const PORT = 4329
const BASE = `http://127.0.0.1:${PORT}`
const OUT = process.env.DT_SHOTS || '/opt/cursor/artifacts'

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function waitForServer() {
  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE + '/felix/decision-tree')
      if (res.ok || res.status === 304) return
    } catch {}
    await sleep(250)
  }
  throw new Error('preview did not start')
}

function assert(cond, message) {
  if (!cond) throw new Error(message)
}

async function shot(target, name) {
  fs.mkdirSync(OUT, { recursive: true })
  const file = path.join(OUT, name)
  await target.screenshot({ path: file })
  console.log('screenshot', file)
}

async function frameTree(page) {
  await page.evaluate(() => {
    const el = document.querySelector('.dt')
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo(0, Math.max(0, top))
  })
  await sleep(80)
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const server = spawn(
    path.join(__dirname, '../node_modules/.bin/vitepress'),
    ['preview', path.join(__dirname, '..'), '--port', String(PORT), '--host', '127.0.0.1'],
    { stdio: 'ignore' }
  )
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  })
  try {
    await waitForServer()
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    const errors = []
    page.on('pageerror', err => errors.push(err.message))
    await page.addInitScript(() => localStorage.setItem('felix-theme', 'light'))
    await page.goto(BASE + '/felix/decision-tree', { waitUntil: 'networkidle' })
    await page.locator('.dt').first().waitFor()
    await frameTree(page)

    const first = page.locator('.dt').first()
    const lightBg = await first.evaluate(el => getComputedStyle(el).backgroundColor)
    assert(lightBg === 'rgb(254, 252, 249)', 'expected Felix light background, got ' + lightBg)
    await first.locator('[data-dt-heading]').getByText('3 waiting').waitFor()
    assert((await first.locator('[data-dt-fraction]').innerText()).includes('1 of 3'), 'fraction')
    assert(await first.locator('.dt-edge').count() > 0, 'edges')
    assert(await first.locator('[data-id="status"]').isVisible(), 'agent pick children')
    const clipped = await first.locator('[data-id="status"]').evaluate(el => {
      const vp = el.closest('.dt-viewport').getBoundingClientRect()
      const box = el.getBoundingClientRect()
      return box.right > vp.right + 4 || box.left < vp.left - 4
    })
    assert(!clipped, 'agent pick children are clipped on desktop')
    await shot(first, 'decision_tree_desktop_1440.png')

    await page.setViewportSize({ width: 820, height: 1100 })
    await sleep(150)
    await frameTree(page)
    await shot(first, 'decision_tree_tablet_820.png')

    await page.setViewportSize({ width: 390, height: 844 })
    await sleep(200)
    await frameTree(page)
    const stacked = await first.locator('.dt-columns').evaluate(el => getComputedStyle(el).flexDirection)
    assert(stacked === 'column', 'mobile should stack, got ' + stacked)
    await shot(first, 'decision_tree_mobile_390.png')

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.locator('.fx-theme-toggle').click()
    await sleep(200)
    await frameTree(page)
    const darkBg = await first.evaluate(el => getComputedStyle(el).backgroundColor)
    assert(darkBg === 'rgb(8, 36, 34)', 'expected Felix dark background, got ' + darkBg)
    await shot(first, 'decision_tree_desktop_dark_1440.png')
    await page.locator('.fx-theme-toggle').click()
    await sleep(100)

    await frameTree(page)
    const hotfix = first.locator('[data-id="hotfix"]')
    await hotfix.hover()
    await sleep(200)
    assert((await first.locator('[data-id="rollback"]').getAttribute('class')).includes('is-dim'), 'siblings dim')
    assert(await first.locator('[data-id="wait"]').isVisible(), 'hotfix children')
    await first.locator('[data-id="rollback"] .dt-hit').click()
    await sleep(250)
    assert((await hotfix.getAttribute('class')).includes('is-out'), 'siblings fade out')
    assert(await first.locator('[data-id="status"]').isVisible(), 'next column')
    await page.keyboard.press('1')
    await first.locator('.dt-approved-title', { hasText: 'Approved · running' }).waitFor()
    await shot(first, 'decision_tree_approved.png')
    await first.locator('.dt-q', { hasText: 'Acme wants 25%' }).waitFor({ timeout: 4000 })
    assert((await first.locator('[data-dt-waiting]').innerText()).includes('2 waiting'), 'queue advanced')
    assert((await page.locator('[data-dt-log]').first().innerText()).includes('Next:'), 'advance callback')

    await page.keyboard.press('1')
    await first.locator('[data-id="csm"]').waitFor({ state: 'visible' })
    assert((await first.locator('[data-id="hold"]').getAttribute('class') || '').includes('is-committed'), 'number key commits')
    await page.keyboard.press('Escape')
    await sleep(150)
    assert(!((await first.locator('[data-id="hold"]').getAttribute('class')) || '').includes('is-committed'), 'esc undoes the commit')

    await first.locator('[data-id="other-sales"]').hover()
    await first.locator('[data-id="other-sales"] input').fill('Hold the price')
    await first.locator('[data-id="other-sales"] .dt-send').click()
    await first.locator('.dt-approved-title', { hasText: 'Sent to the Sales agent' }).waitFor()
    await first.locator('.dt-q', { hasText: 'AWS spend jumped' }).waitFor({ timeout: 5000 })

    await first.locator('[data-id="stop"] .dt-hit').click()
    await first.locator('[data-id="eleven"] .dt-hit').click()
    await first.getByRole('heading', { name: 'All decided' }).waitFor({ timeout: 4000 })
    assert((await first.locator('[data-dt-heading]').innerText()).includes('3 of 3 decided'), 'finished header')
    await frameTree(page)
    await shot(first, 'decision_tree_empty.png')

    const reduced = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    await reduced.emulateMedia({ reducedMotion: 'reduce' })
    await reduced.addInitScript(() => localStorage.setItem('felix-theme', 'light'))
    const reducedErrors = []
    reduced.on('pageerror', err => reducedErrors.push(err.message))
    await reduced.goto(BASE + '/felix/decision-tree', { waitUntil: 'networkidle' })
    await reduced.locator('.dt').first().locator('[data-id="rollback"] .dt-hit').click()
    await sleep(250)
    const running = await reduced.evaluate(() =>
      document.getAnimations().filter(a => a.playState === 'running').map(a => a.animationName || a.constructor.name)
    )
    assert(running.length === 0, 'reduced motion still running: ' + running.join(','))
    await reduced.keyboard.press('2')
    await reduced.locator('.dt').first().locator('.dt-approved-title', { hasText: 'Approved · running' }).waitFor()
    await reduced.close()

    assert(!errors.length, errors.join('; '))
    assert(!reducedErrors.length, reducedErrors.join('; '))
    console.log('decision-tree PASS')
  } finally {
    await browser.close()
    server.kill()
  }
})().catch(err => {
  console.error(err)
  process.exitCode = 1
})
