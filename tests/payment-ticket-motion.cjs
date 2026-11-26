const { chromium } = require('playwright')
const { spawn } = require('node:child_process')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/payment-ticket')
fs.mkdirSync(out, { recursive: true })
const PORT = 4392

;(async () => {
  let browser
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--host', '127.0.0.1', '--port', String(PORT)], { stdio: 'ignore' })
  try {
    for (let i = 0; i < 240; i++) {
      try {
        if ((await fetch(`http://127.0.0.1:${PORT}/home-care/payment-ticket`)).ok) break
      } catch {}
      await new Promise(r => setTimeout(r, 250))
      if (i === 239) throw new Error('Server failed')
    }
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
    const reduced = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
    await reduced.goto(`http://127.0.0.1:${PORT}/home-care/payment-ticket`, { waitUntil: 'networkidle' })
    const reducedDemo = reduced.locator('.ticket')
    await reduced.waitForTimeout(400)
    assert.equal(await reduced.evaluate(() => document.getAnimations().length), 0)
    await reducedDemo.getByRole('button', { name: 'Scan', exact: true }).click()
    await reduced.waitForTimeout(200)
    assert.equal(await reduced.evaluate(() => document.getAnimations().length), 0)
    await reducedDemo.getByRole('button', { name: 'Tear stub', exact: true }).click()
    await reduced.waitForTimeout(100)
    assert.equal(await reduced.evaluate(() => document.getAnimations().length), 0)
    const auto = reducedDemo.getByRole('button', { name: 'Auto-explore', exact: true })
    assert.equal(await auto.isDisabled(), true)

    const motion = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' })
    await motion.goto(`http://127.0.0.1:${PORT}/bastion/payment-ticket`, { waitUntil: 'networkidle' })
    await motion.waitForTimeout(400)
    assert.equal(await motion.evaluate(() => document.getAnimations().length), 0)
    const motionDemo = motion.locator('.ticket')
    await motionDemo.getByRole('button', { name: 'Auto-explore', exact: true }).click()
    const autoMotion = motionDemo.getByRole('button', { name: 'Auto-explore', exact: true })
    await motion.waitForTimeout(2200)
    assert.equal(await autoMotion.getAttribute('aria-pressed'), 'true', 'tour must survive simulated copy')
    assert.equal(await motionDemo.locator('.ticket__chip--ok').count(), 1)
    await motion.waitForTimeout(1600)
    assert.equal(await motionDemo.locator('.ticket__method').getAttribute('aria-expanded'), 'true')
    await motion.waitForTimeout(3200)
    assert.equal(await motionDemo.getByRole('button', { name: 'Reattach stub', exact: true }).count(), 1)
    assert.equal(await motionDemo.locator('.ticket__stub .ticket__barcode').count(), 1)
    const stub = await motionDemo.locator('.ticket__stub').boundingBox()
    const toolbar = await motionDemo.locator('.ticket__bar').boundingBox()
    assert.ok(stub.y + stub.height <= toolbar.y, 'torn barcode must clear toolbar')
    await motion.waitForTimeout(4000)
    assert.equal(await autoMotion.getAttribute('aria-pressed'), 'false')
    assert.match(await motionDemo.locator('.ticket__live').innerText(), /Auto-explore finished/)
    await autoMotion.click()
    await motion.emulateMedia({ reducedMotion: 'reduce' })
    await motion.waitForTimeout(400)
    assert.equal(await autoMotion.isDisabled(), true)
    assert.equal(await autoMotion.getAttribute('aria-pressed'), 'false')
    await motion.emulateMedia({ reducedMotion: 'no-preference' })
    await motion.waitForTimeout(600)
    assert.equal(await autoMotion.isDisabled(), false)
    assert.equal(await motion.evaluate(() => document.getAnimations().length), 0)
    console.log('PASS payment-ticket reduced motion and auto-explore cleanup')
  } finally {
    await browser?.close()
    server.kill()
    await new Promise(r => server.on('exit', r))
  }
})().catch(e => { console.error(e); process.exitCode = 1 })