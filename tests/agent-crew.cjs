const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/agent-crew')
fs.mkdirSync(out, { recursive: true })

;(async () => {
  let browser
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), [process.env.CREW_DEV ? 'dev' : 'preview', root, '--host', '127.0.0.1', '--port', '4389'], { stdio: ['ignore', 'pipe', 'pipe'] })
  const log = fs.createWriteStream(path.join(out, 'server.log'))
  server.stdout.pipe(log)
  server.stderr.pipe(log)
  try {
    for (let i = 0; i < 120; i++) {
      try {
        if ((await fetch('http://127.0.0.1:4389/agent-crew')).ok) break
      } catch {}
      await new Promise(r => setTimeout(r, 250))
      if (i === 119) throw new Error('Server failed')
    }
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
    const page = await browser.newPage({ viewport: { width: 1720, height: 1100 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    await page.goto('http://127.0.0.1:4389/agent-crew', { waitUntil: 'networkidle' })
    await page.addStyleTag({ content: '.VPNav,.VPLocalNav{visibility:hidden!important}' })
    const demo = page.locator('.crew')
    await demo.scrollIntoViewIfNeeded()
    await demo.screenshot({ path: path.join(out, 'canonical-first.png') })
    assert.match(await demo.locator('.crew__notice').innerText(), /Synthetic demo/)
    assert.match(await demo.locator('.crew__counts').innerText(), /\d+ working/)
    assert.match(await demo.locator('.crew__counts').innerText(), /\d+ agents/)
    assert.equal(await demo.locator('[data-crew-card]').count(), 8)
    await demo.locator('[data-crew-card="lead"]').focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(100)
    const dialog = demo.locator('.crew-dialog')
    await dialog.waitFor({ state: 'visible' })
    assert.ok(await dialog.evaluate(el => el.getBoundingClientRect().width >= 300))
    await demo.getByRole('button', { name: 'Close details', exact: true }).click()
    await page.keyboard.press('Escape')
    assert.equal(await dialog.count(), 0)
    await demo.getByRole('button', { name: 'Step', exact: true }).click()
    await demo.getByRole('button', { name: 'Step', exact: true }).click()
    await demo.getByRole('button', { name: 'Step', exact: true }).click()
    await demo.getByRole('button', { name: 'Step', exact: true }).click()
    await page.waitForTimeout(4000)
    const live = await demo.locator('.crew-live').innerText()
    assert.match(live, /handed/i)
    for (const width of [1720, 390]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 1100 })
      await demo.scrollIntoViewIfNeeded()
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `overflow at ${width}`)
      await demo.screenshot({ path: path.join(out, `canonical-${width}.png`) })
    }
    const inventory = JSON.parse(fs.readFileSync(path.join(root, '.vitepress/theme/agent-crew/inventory.json')))
    assert.equal(inventory.length, 22)
  if (!process.env.CREW_FELIX_ONLY) {
    for (const item of inventory.filter(x => !process.env.CREW_NAMES || process.env.CREW_NAMES.split(',').includes(x.name))) {
      await page.setViewportSize({ width: 1720, height: 1100 })
      const res = await page.goto(`http://127.0.0.1:4389${item.route}`, { waitUntil: 'networkidle' })
      assert.ok(res?.ok(), `${item.name} route ${item.route} must respond 200`)
      await page.addStyleTag({ content: '.VPNav,.VPLocalNav,[class$=theme-toggle]{visibility:hidden!important}' })
      const host = page.locator('.crew')
      assert.ok(await host.count(), `${item.name} must render .crew`)
      assert.equal(await host.locator('[data-crew-card]').count(), 8, item.name)
      const variants = item.variants.includes('+') ? ['light', 'dark'] : [item.variants.includes('Dark') ? 'dark' : 'light']
      const boards = {}
      for (const variant of variants) {
        await page.evaluate(({ name, dark }) => {
          const h = document.documentElement
          for (const c of ['dark', 'felix-dark', 'tpl-dark', 'lmn-dark', 'sc-dark', 'pf-dark', 'pp-dark', 'lu-light']) h.classList.remove(c)
          const family = { Felix: 'felix-dark', Lumen: 'lmn-dark', Scopecraft: 'sc-dark', PulseFit: 'pf-dark', Pawprint: 'pp-dark' }[name]
          if (dark) {
            h.classList.add('dark')
            if (family) h.classList.add(family)
            else h.classList.add('tpl-dark')
          }
          if (name === 'Lustro' && !dark) h.classList.add('lu-light')
        }, { name: item.name, dark: variant === 'dark' })
        if (['Meadow', 'Sentinel', 'Brief'].includes(item.name)) {
          const button = host.getByRole('button', { name: variant === 'dark' ? 'Dark mode' : 'Light mode', exact: true })
          if (await button.count()) await button.click()
        }
        boards[variant] = await host.evaluate(el => ({
          bg: getComputedStyle(el).backgroundColor,
          text: getComputedStyle(el).color,
          card: getComputedStyle(el.querySelector('.crew-card')).backgroundColor
        }))
        for (const width of [1720, 390]) {
          await page.setViewportSize({ width, height: width === 390 ? 844 : 1100 })
          await host.scrollIntoViewIfNeeded()
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${item.name} overflow ${variant} ${width}`)
          await host.screenshot({ path: path.join(out, `${item.name.toLowerCase().replace(/\s+/g, '-')}-${variant}-${width}.png`) })
        }
      }
      fs.writeFileSync(path.join(out, `${item.name.toLowerCase().replace(/\s+/g, '-')}-tokens.json`), JSON.stringify(boards))
      if (variants.length === 2) assert.notEqual(boards.light.bg, boards.dark.bg, `${item.name} variants must differ`)
    }
  }
    assert.deepEqual(errors, [])
    console.log('PASS agent-crew keyboard, dialog, variant sweep 1720/390, inventory and overflow')
  } finally {
    await browser?.close()
    server.kill()
    await new Promise(r => server.on('exit', r))
    log.end()
  }
})().catch(e => { console.error(e); process.exitCode = 1 })