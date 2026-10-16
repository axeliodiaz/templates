const { chromium } = require('playwright')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/pulsefit-bs6')
fs.mkdirSync(out, { recursive: true })

;(async () => {
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--port', '4360', '--host', '127.0.0.1'], {
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

    await page.goto('http://127.0.0.1:4360/pulsefit-template/index.html', { waitUntil: 'networkidle' })
    await page.waitForSelector('.btn-solid.theme-primary')
    const bsLink = await page.evaluate(() => !!document.querySelector('link[href*="bootstrap@6.0.0-alpha.1"]'))
    if (!bsLink) throw new Error('Bootstrap 6 CSS not loaded on pulsefit template')
    await page.getByRole('button', { name: 'Book class' }).click()
    await page.waitForTimeout(400)
    await page.screenshot({ path: path.join(out, 'index-desktop.png') })

    await page.goto('http://127.0.0.1:4360/pulsefit-template/components.html#buttons-variants', { waitUntil: 'networkidle' })
    const btnCount = await page.locator('button.btn-solid.theme-primary').count()
    if (btnCount < 1) throw new Error('Expected Bootstrap buttons in components gallery')
    await page.screenshot({ path: path.join(out, 'components-desktop.png') })

    await page.goto('http://127.0.0.1:4360/lustro/components-more', { waitUntil: 'networkidle' })
    const lustroBs = await page.evaluate(() => !!document.querySelector('link[href*="bootstrap@6.0.0-alpha.1"]'))
    if (lustroBs) throw new Error('Bootstrap 6 leaked into Lustro components-more shell')

    await page.goto('http://127.0.0.1:4360/pulsefit/charts', { waitUntil: 'networkidle' })
    await page.waitForTimeout(600)
    const chartCards = await page.locator('.vp-doc svg').count()
    if (chartCards < 3) throw new Error('Pulsefit charts page missing SVG charts')
    await page.screenshot({ path: path.join(out, 'charts-desktop.png') })

    if (errors.length) throw new Error(errors.join('; '))
    console.log('PASS pulsefit-bs6: template, gallery, lustro isolation, charts')
  } finally {
    await browser.close()
    server.kill()
  }
})().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
