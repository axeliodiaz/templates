const { chromium } = require('playwright')
const { spawn } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')

;(async () => {
  const preview = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--port', '4361', '--host', '127.0.0.1'], {
    stdio: 'ignore',
  })
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ['--no-sandbox'],
  })
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))

    await page.goto('http://127.0.0.1:4361/lumen-template/bootstrap-set.html', { waitUntil: 'networkidle' })
    const primary = page.locator('.btn-solid.theme-primary').first()
    await primary.waitFor({ state: 'visible' })
    await primary.hover()
    await page.waitForTimeout(150)
    const transition = await primary.evaluate((el) => getComputedStyle(el).transitionDuration)
    if (transition === '0s') throw new Error('Expected BS6 button transition on hover')

    await page.goto('http://127.0.0.1:4361/lumen/components-more', { waitUntil: 'networkidle' })
    const frame = page.frameLocator('iframe[title="Lumen Bootstrap 6 component gallery"]')
    await frame.locator('.btn-solid.theme-primary').first().waitFor({ state: 'visible' })

    await page.goto('http://127.0.0.1:4361/lumen/charts', { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    const chartAnims = await page.evaluate(() => document.getAnimations().length)
    if (chartAnims < 1) throw new Error('Expected chart animations on /lumen/charts, got ' + chartAnims)

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.waitForTimeout(200)
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)
    if (running > 2) throw new Error('Too many animations under reduced motion: ' + running)

    if (errors.length) throw new Error(errors.join('; '))
    console.log('PASS lumen-bs6 gallery, iframe embed, chart motion, reduced motion')
  } finally {
    await browser.close()
    preview.kill()
  }
})().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
