// TEM-365 regression checks for Spark + Fixtrack reference dashboards. Run after: npm run build && node tests/reference-dashboards-a11y.cjs
const { chromium } = require('playwright')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/reference-dashboards/tem-365')
fs.mkdirSync(path.join(out, 'after'), { recursive: true })

const widths = [320, 375, 768, 1024, 1440]
const shotWidths = [375, 768, 1280]
const MIN_READING_PX = 11
const MIN_LABEL_PX = 10.5
const LABEL_SELECTOR =
  '.rd-nav-label, .fix-kpi small, .spark-kpi small, .fix-labels span, .spark-months span, .fix-request small, .fix-schedule-unit, .fix-card-meta, .spark-table-title, .spark-status, table th, .spark-month-long, .spark-month-short'

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
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2)
      if (overflow) throw new Error(`horizontal overflow at viewport ${page.viewportSize().width}`)
    }

    async function scanVisibleTextFonts(slug, rootSel) {
      const bad = await page.evaluate(
        ({ sel, labelSel, minRead, minLabel }) => {
          const rootEl = document.querySelector(sel)
          if (!rootEl) return ['missing root ' + sel]
          const fails = []
          const vw = window.innerWidth
          const isLabel = (el) => el.matches(labelSel) || !!el.closest('.spark-months')
          const walk = (el) => {
            if (el.nodeType === Node.TEXT_NODE) {
              const text = el.textContent?.replace(/\s+/g, ' ').trim()
              if (!text) return
              const parent = el.parentElement
              if (!parent || parent.closest('[aria-hidden="true"]')) return
              const cs = getComputedStyle(parent)
              if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05) return
              const rect = parent.getBoundingClientRect()
              if (rect.width < 1 || rect.height < 1) return
              if (rect.bottom < 0 || rect.top > window.innerHeight) return
              const px = parseFloat(cs.fontSize)
              const min = isLabel(parent) ? minLabel : minRead
              if (px < min) fails.push(`${parent.tagName}.${[...parent.classList].slice(0, 2).join('.')} "${text.slice(0, 24)}": ${px}px`)
              return
            }
            el.childNodes.forEach(walk)
          }
          walk(rootEl)
          ;['.spark-profile-sub', '.fix-profile small'].forEach((q) => {
            rootEl.querySelectorAll(q).forEach((el) => {
              const px = parseFloat(getComputedStyle(el).fontSize)
              if (px < minRead) fails.push(`profile ${px}px`)
            })
          })
          if (vw <= 700) {
            ;['.spark-mobile-nav select', '.fix-mobile-nav select'].forEach((q) => {
              const el = rootEl.querySelector(q)
              if (!el) return
              const box = el.getBoundingClientRect()
              if (box.height < 39) fails.push(`${q} height ${box.height}`)
            })
          }
          return fails
        },
        { sel: rootSel, labelSel: LABEL_SELECTOR, minRead: MIN_READING_PX, minLabel: MIN_LABEL_PX },
      )
      if (bad.length) throw new Error(`fonts ${slug}@${page.viewportSize().width}: ${bad.slice(0, 8).join('; ')}${bad.length > 8 ? ` (+${bad.length - 8} more)` : ''}`)
    }

    async function assertSparkMonthTicksWithinChart() {
      const fail = await page.evaluate(() => {
        const chart = document.querySelector('.spark-chart')
        const months = document.querySelector('.spark-months')
        if (!chart || !months) return 'missing chart/months'
        const chartR = chart.getBoundingClientRect()
        const spans = [...months.querySelectorAll(':scope > span')]
        if (spans.length !== 12) return `expected 12 month ticks, got ${spans.length}`
        for (const sp of spans) {
          const r = sp.getBoundingClientRect()
          if (r.right > chartR.right + 1.5) return `tick ${sp.textContent} right ${r.right} > chart ${chartR.right}`
          if (r.left < chartR.left + 16) return `tick ${sp.textContent} left ${r.left} < chart ${chartR.left}`
          const vis = sp.querySelector('.spark-month-long, .spark-month-short') || sp
          if (parseFloat(getComputedStyle(vis).fontSize) < 10.5) return `tick font too small`
          if (r.width < 4) return `tick clipped width ${r.width}`
          if (!(sp.textContent || '').trim()) return 'tick empty label'
        }
        return null
      })
      if (fail) throw new Error(`spark month ticks @${page.viewportSize().width}: ${fail}`)
    }

    async function assertNoChildClippingOverlap(rootSel) {
      const fail = await page.evaluate((sel) => {
        const root = document.querySelector(sel)
        if (!root) return 'missing ' + sel
        const checks = ['.spark-kpi strong', '.fix-kpi strong', '.spark-months > span', '.spark-revenue-bar', '.fix-bar-btn']
        const msgs = []
        for (const q of checks) {
          root.querySelectorAll(q).forEach((el) => {
            if (el.closest('[aria-hidden="true"]')) return
            const r = el.getBoundingClientRect()
            if (r.width < 1 || r.height < 1) return
            const parent = el.parentElement
            if (!parent) return
            const pr = parent.getBoundingClientRect()
            const poverflow = getComputedStyle(parent).overflowX
            if ((poverflow === 'clip' || poverflow === 'hidden') && r.right > pr.right + 2) {
              msgs.push(`${q} overflows clipped parent by ${(r.right - pr.right).toFixed(1)}px`)
            }
          })
        }
        return msgs.slice(0, 5).join('; ') || null
      }, rootSel)
      if (fail) throw new Error(`clip/overlap @${page.viewportSize().width}: ${fail}`)
    }

    async function assertContrastPair(sel, min) {
      const colors = await page.evaluate((s) => {
        const el = document.querySelector(s)
        if (!el) return null
        let node = el
        let bg = null
        while (node && node.nodeType === 1) {
          const b = getComputedStyle(node).backgroundColor
          const m = b.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
          if (m && (!m[4] || parseFloat(m[4]) >= 0.92)) {
            bg = b
            break
          }
          node = node.parentElement
        }
        return { fg: getComputedStyle(el).color, bg }
      }, sel)
      if (!colors) throw new Error(`missing ${sel}`)
      const fg = parseRgb(colors.fg)
      const bg = parseRgb(colors.bg) || '#ffffff'
      const ratio = contrastRatio(fg, bg)
      if (ratio < min) throw new Error(`${sel} contrast ${ratio.toFixed(2)} < ${min}`)
    }

    await page.setViewportSize({ width: 375, height: 900 })
    await page.goto('http://localhost:4341/spark-analytics', { waitUntil: 'networkidle' })
    await page.evaluate(() => window.scrollTo(0, 0))
    if ((await page.locator('.spark-mobile-nav select option').count()) !== 15) throw new Error('Spark mobile nav count')
    if (!/section/i.test(await page.locator('.spark-mobile-nav label').innerText())) throw new Error('Spark mobile nav label')
    await page.selectOption('.spark-mobile-nav select', 'Customer Support')
    await page.selectOption('.spark-mobile-nav select', 'System Settings')

    await page.goto('http://localhost:4341/fixtrack', { waitUntil: 'networkidle' })
    if ((await page.locator('.fix-mobile-nav select option').count()) !== 10) throw new Error('Fixtrack mobile nav count')
    await page.selectOption('.fix-mobile-nav select', 'Messages')

    await page.goto('http://localhost:4341/spark-analytics', { waitUntil: 'networkidle' })
    await page.setViewportSize({ width: 768, height: 1000 })
    const sparkBarBox = await page.locator('.spark-revenue-bar').first().boundingBox()
    if (!sparkBarBox || sparkBarBox.width < 39 || sparkBarBox.height < 39) throw new Error('Spark revenue bar tap target')
    await page.goto('http://localhost:4341/fixtrack', { waitUntil: 'networkidle' })
    const fixBarBox = await page.locator('.fix-bar-btn').first().boundingBox()
    if (!fixBarBox || fixBarBox.width < 39 || fixBarBox.height < 39) throw new Error('Fixtrack schedule bar tap target')

    await page.goto('http://localhost:4341/spark-analytics', { waitUntil: 'networkidle' })
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.locator('.spark-pixel-col').first().focus()
    const outline = await page.evaluate(() => {
      const el = document.activeElement
      if (!el?.classList.contains('spark-pixel-col')) return '0px'
      return getComputedStyle(el).outlineWidth
    })
    if (outline === '0px') throw new Error('Spark pixel focus ring')

    for (const [slug, pairs] of [
      ['spark-analytics', ['.sparkdash .ref-primary', '.spark-kpi small', '.sparkdash h2', '.spark-profile-sub']],
      ['fixtrack', ['.fixtrack .fix-labels span', '.fixtrack .fix-kpi small', '.fixtrack h2', '.fix-profile small']],
    ]) {
      await page.goto(`http://localhost:4341/${slug}`, { waitUntil: 'networkidle' })
      for (const sel of pairs) await assertContrastPair(sel, 4.5)
    }

    await page.goto('http://localhost:4341/fixtrack', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Water leak', exact: false }).click()
    await page.getByRole('button', { name: 'Assign contractor', exact: false }).click()
    await page.getByRole('button', { name: 'Assign', exact: true }).first().click()
    await page.getByRole('button', { name: 'Confirm demo', exact: true }).click()
    await assertContrastPair('.fix-track span', 4.5)

    for (const w of widths) {
      await page.setViewportSize({ width: w, height: 900 })
      for (const [slug, rootSel] of [
        ['spark-analytics', '.sparkdash'],
        ['fixtrack', '.fixtrack'],
      ]) {
        await page.goto(`http://localhost:4341/${slug}`, { waitUntil: 'networkidle' })
        await page.evaluate(() => window.scrollTo(0, 0))
        await assertNoHorizontalOverflow()
        await scanVisibleTextFonts(slug, rootSel)
        await assertNoChildClippingOverlap(rootSel)
        if (slug === 'spark-analytics') {
          await page.locator('.spark-chart').scrollIntoViewIfNeeded()
          await assertSparkMonthTicksWithinChart()
        }
      }
    }

    for (const w of shotWidths) {
      for (const slug of ['spark-analytics', 'fixtrack']) {
        await page.setViewportSize({ width: w, height: w < 768 ? 1200 : 1000 })
        await page.goto(`http://localhost:4341/${slug}`, { waitUntil: 'networkidle' })
        await page.evaluate(() => window.scrollTo(0, 0))
        if (w <= 768) {
          await page.screenshot({
            path: path.join(out, 'after', `${slug}-${w}-top.png`),
            clip: { x: 0, y: 0, width: w, height: Math.min(520, 1200) },
          })
        }
        await page.locator('.spark-chart, .fix-bars').first().scrollIntoViewIfNeeded()
        await page.waitForTimeout(200)
        await page.screenshot({ path: path.join(out, 'after', `${slug}-${w}.png`) })
      }
    }

    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('http://localhost:4341/spark-analytics', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Add Transaction', exact: false }).click()
    await page.locator('dialog input').nth(0).fill('A11y Row')
    let cancelOutline = '0px'
    for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab')
    cancelOutline = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el.tagName !== 'BUTTON') return 'skip'
      if (!/cancel/i.test(el.textContent || '')) return 'skip'
      const o = getComputedStyle(el).outlineWidth
      return o !== '0px' && getComputedStyle(el).outlineStyle !== 'none' ? o : '0px'
    })
    if (cancelOutline !== '0px' && cancelOutline !== 'skip') break
  }
    if (cancelOutline === '0px') throw new Error('dialog cancel focus ring')
    await page.getByRole('button', { name: 'Cancel', exact: true }).click()
    if (await page.locator('dialog[open]').count()) throw new Error('dialog cancel')

    if (errors.length) throw new Error(errors.join('; '))
    console.log('reference-dashboards-a11y: nav, font scan, contrast, overflow, month ticks, clip, tap targets, focus, dialog PASS')
  } finally {
    await browser.close()
    server.kill()
  }
})().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
