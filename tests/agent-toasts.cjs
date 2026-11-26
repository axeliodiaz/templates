const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/agent-toasts')
fs.mkdirSync(out, { recursive: true })
const PORT = 4392

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
    const demo = page.locator('.atoast__stage')
    await demo.scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Play sequence', exact: true }).click()
    await page.waitForTimeout(4200)
    assert.equal(await page.locator('.atoast__item').count(), 6)
    await page.getByRole('button', { name: 'Clear', exact: true }).click()
    await page.getByRole('button', { name: 'Deploy', exact: true }).click()
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'Retry', exact: true }).click()
    await page.waitForFunction(() => document.body.innerText.includes('Deploying'), null, { timeout: 8000 })

    const inventory = JSON.parse(fs.readFileSync(path.join(root, '.vitepress/theme/agent-toasts/inventory.json')))
    assert.equal(inventory.length, 22)
    for (const item of inventory) {
      await page.setViewportSize({ width: 1720, height: 1100 })
      const res = await page.goto(`http://127.0.0.1:${PORT}${item.route}`, { waitUntil: 'networkidle' })
      assert.ok(res?.ok(), item.route)
      await page.addStyleTag({ content: '.VPNav,.VPLocalNav,[class$=theme-toggle]{visibility:hidden!important}' })
      const host = page.locator('.atoast')
      assert.ok(await host.count(), item.name)
      const allVariants = item.variants.includes('Light + dark') || item.variants.includes('local dark')
        ? ['light', 'dark']
        : [item.variants.includes('Dark only') ? 'dark' : 'light']
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
    console.log('PASS agent-toasts play sequence and variant sweep')
  } finally {
    await browser?.close()
    server.kill()
    await new Promise(r => server.on('exit', r))
    log.end()
  }
})().catch(e => { console.error(e); process.exitCode = 1 })