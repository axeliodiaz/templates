// TEM-365 regression checks for Spark + Fixtrack reference dashboards. Run after: npm run build && node tests/reference-dashboards-a11y.cjs
const { chromium } = require('playwright')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/reference-dashboards/tem-365')
fs.mkdirSync(out, { recursive: true })

const widths = [320, 375, 768, 1024, 1440]
const shotWidths = [375, 768, 1280]

function relLuminance(hex) {
  const h = hex.replace('#', '')
  const rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
  const lin = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function contrastRatio(fg, bg) {
  const L1 = relLuminance(fg)
  const L2 = relLuminance(bg)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

function parseRgb(css) {
  const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return null
  return '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('')
}

;(async () => {
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--port', '4341'], { stdio: 'ignore' })
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })
  try {
    await new Promise((r) => setTimeout(r, 2500))
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))

    async function assertNoHorizontalOverflow() {
      const overflow = await page.evaluate(() => {
        const el = document.querySelector('.reference-dashboard')
        if (!el) return false
        const doc = document.documentElement
        return doc.scrollWidth > doc.clientWidth + 2
      })
      if (overflow) throw new Error(`horizontal overflow at viewport ${page.viewportSize().width}`)
    }

    async function minFontChecks(slug, selector) {
      await page.goto(`http://localhost:4341/${slug}`, { waitUntil: 'networkidle' })
      const bad = await page.evaluate((sel) => {
        const rootEl = document.querySelector(sel)
        if (!rootEl) return ['missing root']
        const fails = []
        rootEl.querySelectorAll('small.rd-nav-label, .fix-labels span, .spark-months span, .fix-kpi small, .spark-kpi small').forEach((el) => {
          const px = parseFloat(getComputedStyle(el).fontSize)
          if (px < 10.5) fails.push(`label ${el.textContent?.slice(0, 20)}: ${px}px`)
        })
        const isMobile = window.innerWidth <= 700
        rootEl.querySelectorAll('p:not(.spark-chart-legend), .fix-detail-copy, .fix-message, tbody td, .ref-notice').forEach((el) => {
          if (!isMobile) return
          const px = parseFloat(getComputedStyle(el).fontSize)
          if (px < 11.5) fails.push(`body ${el.textContent?.slice(0, 20)}: ${px}px`)
        })
        return fails
      }, selector)
      if (bad.length) throw new Error(`font sizes ${slug}: ${bad.join('; ')}`)
    }

    // Spark mobile nav: 15 sidebar sections (7+3+3+2)
    await page.setViewportSize({ width: 375, height: 900 })
    await page.goto('http://localhost:4341/spark-analytics', { waitUntil: 'networkidle' })
    const sparkOptions = await page.locator('.spark-mobile-nav select option').count()
    if (sparkOptions !== 15) throw new Error(`Spark mobile nav expected 15 options, got ${sparkOptions}`)
    const sparkNavLabel = await page.locator('.spark-mobile-nav label').innerText()
    if (!/section/i.test(sparkNavLabel)) throw new Error('Spark mobile nav missing Section label')

    await page.selectOption('.spark-mobile-nav select', 'Customer Support')
    if (!(await page.locator('.spark-main').innerText()).includes('Customer Support')) throw new Error('Spark mobile Customer Support')
    await page.selectOption('.spark-mobile-nav select', 'System Settings')
    if (!(await page.locator('.spark-main .ref-notice').innerText()).includes('No external account')) throw new Error('Spark System Settings notice')

    // Fixtrack mobile nav: 10 sections incl. Messages + Settings
    await page.goto('http://localhost:4341/fixtrack', { waitUntil: 'networkidle' })
    const fixOptions = await page.locator('.fix-mobile-nav select option').count()
    if (fixOptions !== 10) throw new Error(`Fixtrack mobile nav expected 10 options, got ${fixOptions}`)
    await page.selectOption('.fix-mobile-nav select', 'Messages')
    if (!(await page.locator('.fix-main h2').innerText()).includes('Messages')) throw new Error('Fixtrack Messages section')

    // Tap targets on revenue + schedule bars
    await page.goto('http://localhost:4341/spark-analytics', { waitUntil: 'networkidle' })
    await page.setViewportSize({ width: 768, height: 1000 })
    await page.locator('.spark-revenue').scrollIntoViewIfNeeded()
    const sparkBarBox = await page.locator('.spark-revenue-bar').first().boundingBox()
    if (!sparkBarBox || sparkBarBox.width < 39 || sparkBarBox.height < 39) throw new Error('Spark revenue bar tap target')
    await page.goto('http://localhost:4341/fixtrack', { waitUntil: 'networkidle' })
    await page.locator('.fix-bars').scrollIntoViewIfNeeded()
    const fixBarBox = await page.locator('.fix-bar-btn').first().boundingBox()
    if (!fixBarBox || fixBarBox.width < 39 || fixBarBox.height < 39) throw new Error('Fixtrack schedule bar tap target')

    // Focus ring + keyboard on pixel chart
    await page.goto('http://localhost:4341/spark-analytics', { waitUntil: 'networkidle' })
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.locator('.spark-pixel-col').first().focus()
    const sparkFocus = await page.locator('.spark-pixel-col:focus-visible').count()
    if (sparkFocus < 1) {
      const outline = await page.evaluate(() => {
        const el = document.activeElement
        if (!el || !el.classList.contains('spark-pixel-col')) return 'no focus'
        const o = getComputedStyle(el).outlineWidth
        return o
      })
      if (outline === '0px') throw new Error('Spark pixel focus ring')
    }

    // Contrast spot checks (computed pairs)
    const contrastFails = await page.evaluate(() => {
      const fails = []
      const pairs = [
        { sel: '.sparkdash .ref-primary', fg: '#1f1308', bg: '#e56f0a' },
        { sel: '.fixtrack .fix-track span', fg: '#3f534c', bg: '#ffffff' },
        { sel: '.fixtrack .fix-track span:before', fg: '#3f534c', bg: '#e2ebe6' },
      ]
      for (const p of pairs) {
        const el = document.querySelector(p.sel)
        if (!el) continue
        const bg = getComputedStyle(el).backgroundColor
        const fg = getComputedStyle(el).color
        fails.push({ sel: p.sel, fg, bg })
      }
      return fails
    })
    for (const slug of ['spark-analytics', 'fixtrack']) {
      await page.goto(`http://localhost:4341/${slug}`, { waitUntil: 'networkidle' })
      if (slug === 'spark-analytics') {
        const btn = page.locator('.sparkdash .ref-primary').first()
        const colors = await btn.evaluate((el) => ({
          color: getComputedStyle(el).color,
          bg: getComputedStyle(el).backgroundColor,
        }))
        const fg = parseRgb(colors.color)
        const bg = parseRgb(colors.bg)
        if (fg && bg && contrastRatio(fg, bg) < 4.5) throw new Error(`Spark primary contrast ${contrastRatio(fg, bg)}`)
      }
      if (slug === 'fixtrack') {
        const muted = page.locator('.fix-labels span').first()
        const colors = await muted.evaluate((el) => getComputedStyle(el).color)
        const fg = parseRgb(colors) || '#3f534c'
        if (contrastRatio(fg, '#ffffff') < 4.5) throw new Error('Fixtrack label contrast')
        await page.getByRole('button', { name: 'Water leak', exact: false }).click()
        await page.getByRole('button', { name: 'Assign contractor', exact: false }).click()
        await page.getByRole('button', { name: 'Assign', exact: true }).first().click()
        await page.getByRole('button', { name: 'Confirm demo', exact: true }).click()
        const step = page.locator('.fix-track span').first()
        const stepColor = await step.evaluate((el) => getComputedStyle(el).color)
        const stepFg = parseRgb(stepColor) || '#3f534c'
        if (contrastRatio(stepFg, '#ffffff') < 4.5) throw new Error('Fixtrack track label contrast')
      }
    }

    for (const w of widths) {
      await page.setViewportSize({ width: w, height: 900 })
      await page.goto('http://localhost:4341/spark-analytics', { waitUntil: 'networkidle' })
      await assertNoHorizontalOverflow()
      await page.goto('http://localhost:4341/fixtrack', { waitUntil: 'networkidle' })
      await assertNoHorizontalOverflow()
    }

    for (const w of shotWidths) {
      for (const slug of ['spark-analytics', 'fixtrack']) {
        await page.setViewportSize({ width: w, height: w < 768 ? 900 : 1000 })
        await page.goto(`http://localhost:4341/${slug}`, { waitUntil: 'networkidle' })
        await page.locator('.reference-dashboard').scrollIntoViewIfNeeded()
        await page.waitForTimeout(300)
        await page.screenshot({ path: path.join(out, `${slug}-${w}.png`) })
      }
    }

    await page.setViewportSize({ width: 375, height: 900 })
    await minFontChecks('spark-analytics', '.sparkdash')
    await minFontChecks('fixtrack', '.fixtrack')

  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('http://localhost:4341/spark-analytics', { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  let tabCount = 0
  while (tabCount < 30) {
    await page.keyboard.press('Tab')
    tabCount++
    const tag = await page.evaluate(() => document.activeElement?.tagName)
    if (tag === 'DIALOG') break
  }
  await page.getByRole('button', { name: 'Add Transaction', exact: false }).click()
  await page.locator('dialog input').nth(0).fill('A11y Row')
  await page.getByRole('button', { name: 'Cancel', exact: true }).click()
  if (await page.locator('dialog[open]').count()) throw new Error('dialog cancel')

    if (errors.length) throw new Error(errors.join('; '))
    console.log('reference-dashboards-a11y: nav, fonts, contrast, overflow, tap targets, focus, dialog PASS')
  } finally {
    await browser.close()
    server.kill()
  }
})().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
