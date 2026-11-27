const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const assert = require('node:assert/strict')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const PORT = 4393

;(async () => {
  let browser
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--host', '127.0.0.1', '--port', String(PORT)], { stdio: 'ignore' })
  try {
    for (let i = 0; i < 180; i++) {
      try {
        if ((await fetch(`http://127.0.0.1:${PORT}/agent-toasts`)).ok) break
      } catch {}
      await new Promise(r => setTimeout(r, 300))
    }
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
    const context = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await context.newPage({ viewport: { width: 1720, height: 900 } })
    await page.goto(`http://127.0.0.1:${PORT}/agent-toasts`, { waitUntil: 'networkidle' })
    await page.locator('.atoast.is-reduced, .atoast').first().evaluate((el, on) => el.classList.add('is-reduced'), true)
    await page.getByRole('button', { name: 'Play sequence', exact: true }).click()
    await page.waitForTimeout(4000)
    const itemTransition = await page.locator('.atoast__item').first().evaluate(el => getComputedStyle(el).transitionDuration)
    assert.ok(itemTransition === '0s' || itemTransition === '0ms' || !itemTransition)
    const titleAnim = await page.locator('.atoast__title').first().evaluate(el => getComputedStyle(el).animationName)
    assert.equal(titleAnim, 'none')
    console.log('PASS agent-toasts reduced motion')
  } finally {
    await browser?.close()
    server.kill()
  }
})().catch(e => { console.error(e); process.exitCode = 1 })