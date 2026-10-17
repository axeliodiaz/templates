const { spawn } = require('node:child_process')
const path = require('node:path')
const { chromium } = require('playwright')

const root = path.join(__dirname, '..')
const previewBin = path.join(root, 'node_modules/.bin/vitepress')
const port = 4318
const base = `http://127.0.0.1:${port}`

;(async () => {
  const server = spawn(previewBin, ['preview', root, '--port', String(port), '--host', '127.0.0.1'], {
    stdio: 'ignore',
  })
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ['--no-sandbox'],
  })
  try {
    await new Promise((r) => setTimeout(r, 2500))
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    for (const route of ['/pulsefit-template/index.html', '/pulsefit-template/components.html']) {
      await page.goto(base + route, { waitUntil: 'networkidle' })
      if (errors.length) throw new Error(`Console errors on ${route}: ${errors.join('; ')}`)
      const hasBs = await page.evaluate(() => !!document.querySelector('.btn-solid, .navbar, .pf-gallery'))
      if (!hasBs) throw new Error(`Missing Bootstrap markup on ${route}`)
    }
    await page.goto(base + '/pulsefit/components-more', { waitUntil: 'networkidle' })
    const frame = page.frameLocator('iframe[title="PulseFit Bootstrap 6 component gallery"]')
    await frame.locator('.btn-solid.theme-primary').first().waitFor({ timeout: 10000 })
    console.log('pulsefit-bs6: ok')
  } finally {
    await browser.close()
    server.kill('SIGTERM')
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
