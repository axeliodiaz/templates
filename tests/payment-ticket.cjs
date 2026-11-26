const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/payment-ticket')
fs.mkdirSync(out, { recursive: true })
const PORT = 4391

;(async () => {
  let browser
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--host', '127.0.0.1', '--port', String(PORT)], { stdio: ['ignore', 'pipe', 'pipe'] })
  const log = fs.createWriteStream(path.join(out, 'server.log'))
  server.stdout.pipe(log)
  server.stderr.pipe(log)
  try {
    for (let i = 0; i < 240; i++) {
      try {
        if ((await fetch(`http://127.0.0.1:${PORT}/payment-ticket`)).ok) break
      } catch {}
      await new Promise(r => setTimeout(r, 250))
      if (i === 239) throw new Error('Server failed — run npm run build first')
    }
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })
    const page = await context.newPage({ viewport: { width: 1720, height: 1100 } })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto(`http://127.0.0.1:${PORT}/payment-ticket`, { waitUntil: 'networkidle' })
    await page.addStyleTag({ content: '.VPNav,.VPLocalNav{visibility:hidden!important}' })
    const demo = page.locator('.VPDoc .ticket')
    await demo.scrollIntoViewIfNeeded()
    assert.match(await demo.locator('.ticket__notice').innerText(), /Synthetic demo/)

    const ref = demo.getByRole('button', { name: /TK-7316-2048-55/ })
    await ref.click()
    await page.waitForTimeout(300)
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'TK-7316-2048-55')
    assert.ok(await demo.locator('.ticket__chip--ok').count())

    const card = demo.locator('.ticket__method')
    await card.hover()
    assert.equal(await card.getAttribute('aria-expanded'), 'true')
    await card.click()
    await card.hover({ position: { x: 5, y: 5 } })
    await page.mouse.move(0, 0)
    assert.equal(await card.getAttribute('aria-expanded'), 'true')
    await card.click()
    assert.equal(await card.getAttribute('aria-expanded'), 'false')

    await demo.getByRole('button', { name: 'Scan', exact: true }).click()
    await page.waitForFunction(() => document.querySelector('.VPDoc .ticket__live')?.textContent?.includes('Demo scan complete'), null, { timeout: 5000 })
    await page.waitForTimeout(1300)

    await demo.getByRole('button', { name: 'Tear stub', exact: true }).click()
    await page.waitForTimeout(600)
    assert.equal(await demo.getByRole('button', { name: 'Reattach stub', exact: true }).getAttribute('aria-pressed'), 'true')

  const inventory = JSON.parse(fs.readFileSync(path.join(root, '.vitepress/theme/payment-ticket/inventory.json')))
    assert.equal(inventory.length, 22)
    for (const item of inventory) {
      await page.setViewportSize({ width: 1720, height: 1100 })
      const res = await page.goto(`http://127.0.0.1:${PORT}${item.route}`, { waitUntil: 'networkidle' })
      assert.ok(res?.ok(), item.route)
      await page.addStyleTag({ content: '.VPNav,.VPLocalNav,[class$=theme-toggle]{visibility:hidden!important}' })
      const host = page.locator('.ticket')
      assert.ok(await host.count(), item.name)
      const variants = item.variants.includes('+') ? ['light', 'dark'] : [item.variants.includes('Dark') && !item.variants.includes('+') ? 'dark' : (item.variants === 'Dark only' ? 'dark' : 'light')]
      const allVariants = item.variants.includes('Light + dark') || item.variants.includes('local dark') ? ['light', 'dark'] : variants
      for (const variant of allVariants) {
        await page.evaluate(({ name, dark }) => {
          const h = document.documentElement
          for (const c of ['dark', 'felix-dark', 'tpl-dark', 'lmn-dark', 'sc-dark', 'pf-dark', 'pp-dark', 'lu-light']) h.classList.remove(c)
          const family = { Felix: 'felix-dark', Lumen: 'lmn-dark', Scopecraft: 'sc-dark', PulseFit: 'pf-dark', Pawprint: 'pp-dark' }[name]
          if (dark) {
            h.classList.add('dark')
            if (family) h.classList.add(family)
            else if (name !== 'Trial journey') h.classList.add('tpl-dark')
          }
          if (name === 'Lustro' && !dark) h.classList.add('lu-light')
        }, { name: item.name, dark: variant === 'dark' })
        if (['Meadow', 'Sentinel', 'Brief'].includes(item.name) && variant === 'dark') {
          const button = host.getByRole('button', { name: 'Dark mode', exact: true })
          if (await button.count()) await button.click()
        }
        for (const width of [1720, 390]) {
          await page.setViewportSize({ width, height: width === 390 ? 844 : 1100 })
          await host.scrollIntoViewIfNeeded()
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${item.name} overflow ${variant} ${width}`)
          await host.screenshot({ path: path.join(out, `${item.name.toLowerCase().replace(/\s+/g, '-')}-${variant}-${width}.png`) })
        }
      }
    }
    assert.deepEqual(errors, [])
    console.log('PASS payment-ticket copy, card, scan, tear, variant sweep 1720/390')
  } finally {
    await browser?.close()
    server.kill()
    await new Promise(r => server.on('exit', r))
    log.end()
  }
})().catch(e => { console.error(e); process.exitCode = 1 })