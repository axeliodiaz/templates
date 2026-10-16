const { chromium } = require('playwright')
const { spawn } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')

;(async () => {
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--port', '4361', '--host', '127.0.0.1'], {
    stdio: 'ignore',
  })
  await new Promise((r) => setTimeout(r, 2500))
  const browser = await chromium.launch({ args: ['--no-sandbox'] })
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    await page.goto('http://127.0.0.1:4361/scopecraft/components', { waitUntil: 'networkidle' })
    const roots = await page.locator('.sc-bs6-root').count()
    if (roots < 1) throw new Error('Missing .sc-bs6-root on catalog page')
    const btn = page.locator('.sc-bs6-root .btn-solid.theme-primary').first()
    if (!(await btn.count())) throw new Error('Missing Bootstrap 6 primary button')
    const navBg = await page.evaluate(() => getComputedStyle(document.querySelector('.VPNav')).backgroundColor)
    if (!navBg) throw new Error('VitePress nav missing')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForTimeout(200)
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)
    if (running) throw new Error('Animations still running under reduced motion: ' + running)
    console.log('scopecraft BS6 scope + reduced-motion PASS')
  } finally {
    await browser.close()
    server.kill()
  }
})().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
