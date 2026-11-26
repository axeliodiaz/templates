const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/agent-toasts')
fs.mkdirSync(out, { recursive: true })
const PORT = 4392

const own = {
  Felix: '.fx-theme-toggle',
  Lumen: '.lmn-theme-toggle',
  Scopecraft: '.sc-theme-toggle',
  PulseFit: '.pf-theme-toggle',
  Pawprint: '.pp-theme-toggle',
  Lustro: '.lu-theme-toggle',
}
const localDarkBtn = ['Meadow', 'Sentinel', 'Brief']

async function populateStack(page) {
  await page.getByRole('button', { name: 'Clear', exact: true }).click()
  await page.getByRole('button', { name: 'Play sequence', exact: true }).click()
  await page.waitForFunction(() => document.querySelectorAll('.atoast__item').length >= 6, null, { timeout: 12000 })
}

;(async () => {
  let browser
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--host', '127.0.0.1', '--port', String(PORT)], { stdio: ['ignore', 'pipe', 'pipe'] })
  const log = fs.createWriteStream(path.join(out, 'server.log'))
  server.stdout.pipe(log)
  server.stderr.pipe(log)
  try {
    for (let i = 0; i < 240; i++) {
      try {
        if ((await fetch(`http://127.0.0.1:${PORT}/agent-toasts`)).ok) break
      } catch {}
      await new Promise(r => setTimeout(r, 250))
      if (i === 239) throw new Error('Server failed — run npm run build first')
    }
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
    const page = await browser.newPage({ viewport: { width: 1720, height: 1100 } })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))

    await page.goto(`http://127.0.0.1:${PORT}/agent-toasts`, { waitUntil: 'networkidle' })
    await page.addStyleTag({ content: '.VPNav,.VPLocalNav{visibility:hidden!important}' })
    const host = page.locator('.atoast').first()
    await host.waitFor()

    const stage = page.locator('.atoast__stage')
  await stage.scrollIntoViewIfNeeded()
    const stageBox = await stage.boundingBox()
    assert.ok(stageBox && stageBox.height >= 500 && stageBox.height <= 540, `stage height ${stageBox?.height}`)

    await populateStack(page)
    const regionStyle = await page.locator('.atoast__region').evaluate(el => {
      const s = getComputedStyle(el)
      return { position: s.position, bottom: s.bottom }
    })
    assert.equal(regionStyle.position, 'absolute')

    const cardStyle = await page.locator('.atoast__card').first().evaluate(el => {
      const s = getComputedStyle(el)
      return { display: s.display, backgroundColor: s.backgroundColor, minHeight: s.minHeight }
    })
    assert.notEqual(cardStyle.backgroundColor, 'rgba(0, 0, 0, 0)')
    assert.ok(parseFloat(cardStyle.minHeight) >= 60)

    const stageRect = await stage.boundingBox()
    const cardsInside = await page.evaluate(() => {
      const stage = document.querySelector('.atoast__stage')
      const sb = stage.getBoundingClientRect()
      return [...document.querySelectorAll('.atoast__card')].every(c => {
        const r = c.getBoundingClientRect()
        return r.bottom <= sb.bottom + 2 && r.top >= sb.top - 2 && r.right <= sb.right + 2 && r.left >= sb.left - 2
      })
    })
    assert.ok(cardsInside, 'all toast cards must stay inside stage frame')

    await page.getByRole('button', { name: 'Expanded', exact: true }).click()
    await page.waitForTimeout(250)
    const listClass = await page.locator('.atoast__list').getAttribute('class')
    assert.match(listClass, /atoast__list--expanded/)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(250)
    assert.equal(await page.getByRole('button', { name: 'Expanded', exact: true }).getAttribute('aria-pressed'), 'false')

    await page.getByRole('button', { name: 'Clear', exact: true }).click()
    await page.getByRole('button', { name: 'Deploy', exact: true }).click()
    await page.waitForTimeout(400)
    await page.locator('.atoast__item').last().getByRole('button', { name: 'Retry', exact: true }).click()
    await page.waitForFunction(() => document.body.innerText.includes('Deploying'), null, { timeout: 8000 })

    await page.getByRole('button', { name: 'Auto-hide', exact: true }).click()
    assert.equal(await page.getByRole('button', { name: 'Auto-hide', exact: true }).getAttribute('aria-pressed'), 'false')
    await page.waitForTimeout(800)
    const countPaused = await page.locator('.atoast__item').count()
    assert.ok(countPaused >= 1, 'auto-hide off should keep stack')
    await page.getByRole('button', { name: 'Auto-hide', exact: true }).click()

    const inventory = JSON.parse(fs.readFileSync(path.join(root, '.vitepress/theme/agent-toasts/inventory.json')))
    assert.equal(inventory.length, 22)

    for (const item of inventory) {
      await page.setViewportSize({ width: 1720, height: 1100 })
      const res = await page.goto(`http://127.0.0.1:${PORT}${item.route}`, { waitUntil: 'networkidle' })
      assert.ok(res?.ok(), item.route)
      await page.addStyleTag({ content: '.VPNav,.VPLocalNav{visibility:hidden!important}' })
      const pageHost = page.locator('.atoast')
      await pageHost.waitFor()
      const variants =
        item.variants.includes('Light + dark') || item.variants.includes('Light + local dark')
          ? ['light', 'dark']
          : [item.variants.includes('Dark only') ? 'dark' : 'light']

      for (const variant of variants) {
        if (localDarkBtn.includes(item.name)) {
          const wantDark = variant === 'dark'
          const btn = pageHost.getByRole('button', { name: wantDark ? 'Dark mode' : 'Light mode', exact: true })
          if (await btn.count()) await btn.click()
        } else if (variants.length === 2) {
          const sel = own[item.name] || '.tpl-theme-toggle'
          const btn = page.locator(sel)
          if (await btn.count()) {
            await btn.waitFor()
            const want = variant === 'dark' ? 'light' : 'dark'
            const label = await btn.getAttribute('aria-label')
            if (label === `Switch to ${want} mode`) await btn.click()
          }
        }

        await populateStack(page)

        for (const width of [1720, 390, 320]) {
          await page.setViewportSize({ width, height: width <= 390 ? 844 : 1100 })
          await pageHost.scrollIntoViewIfNeeded()
          await page.evaluate(() => (document.documentElement.style.fontSize = ''))
          if (width === 320) await page.addStyleTag({ content: 'html{font-size:200%!important}' })
          if (width === 1720) {
            const vizSize = await page.locator('.atoast__viz').first().evaluate(el => {
              const s = getComputedStyle(el)
              return { width: s.width, height: s.height }
            })
            assert.equal(vizSize.width, '56px')
            assert.equal(vizSize.height, '32px')
          }
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${item.name} overflow ${variant} ${width}`)
          await pageHost.screenshot({ path: path.join(out, `${item.name.toLowerCase().replace(/\s+/g, '-')}-${variant}-${width}.png`) })
        }
        await page.getByRole('button', { name: 'Clear', exact: true }).click()
      }
    }

    assert.deepEqual(errors, [])
    console.log('PASS agent-toasts layout, theme controls, and populated screenshots')
  } finally {
    await browser?.close()
    server.kill()
    await new Promise(r => server.on('exit', r))
    log.end()
  }
})().catch(e => {
  console.error(e)
  process.exitCode = 1
})