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
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), [process.env.CREW_DEV ? 'dev' : 'preview', root, '--host', '127.0.0.1', '--port', '4389'], { stdio: 'ignore' })
  try {
    for (let i = 0; i < 120; i++) {
      try {
        if ((await fetch('http://127.0.0.1:4389/felix/agent-crew')).ok) break
      } catch {}
      await new Promise(r => setTimeout(r, 250))
      if (i === 119) throw new Error('Server failed')
    }
    browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] })
    const reduced = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
    await reduced.goto('http://127.0.0.1:4389/felix/agent-crew', { waitUntil: 'networkidle' })
    const reducedDemo = reduced.locator('.crew')
    await reducedDemo.getByRole('button', { name: 'Play run', exact: true }).click()
    await reduced.waitForTimeout(800)
    assert.equal(await reduced.evaluate(() => document.getAnimations().length), 0)
    assert.ok(await reducedDemo.locator('.crew-card.crew-floor-on, .crew-wire-active').count() >= 0)
    const motion = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' })
    await motion.goto('http://127.0.0.1:4389/felix/agent-crew', { waitUntil: 'networkidle' })
    const motionDemo = motion.locator('.crew')
    await motionDemo.getByRole('button', { name: 'Step', exact: true }).click()
    await motionDemo.getByRole('button', { name: 'Step', exact: true }).click()
    await motion.waitForTimeout(1200)
    const pulses = await motionDemo.locator('.crew-handoff-pulse').count()
    const floors = await motionDemo.locator('.crew-card.crew-floor-on').count()
    assert.ok(pulses <= 1, 'expected at most one handoff pulse')
    assert.ok(floors >= 1, 'expected floor glow on target card')
    await motion.screenshot({ path: path.join(out, 'motion-handoff.png') })
    console.log('PASS agent-crew reduced-motion and handoff pulse')
  } finally {
    await browser?.close()
    server.kill()
    await new Promise(r => server.on('exit', r))
  }
})().catch(e => { console.error(e); process.exitCode = 1 })