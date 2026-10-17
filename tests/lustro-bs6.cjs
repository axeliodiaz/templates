// Smoke test: Lustro Bootstrap 6 standalone pages (requires Playwright chromium).
const { spawn } = require('child_process')
const path = require('path')
const { chromium } = require('playwright')

async function waitForPreview(port) {
  const http = require('http')
  for (let i = 0; i < 40; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
          res.resume()
          resolve()
        })
        req.on('error', reject)
      })
      return
    } catch {
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  throw new Error('preview server did not start')
}

;(async () => {
  const server = spawn(path.join(__dirname, '../node_modules/.bin/vitepress'), [
    'preview',
    path.join(__dirname, '..'),
    '--port',
    '4321',
    '--host',
    '127.0.0.1',
  ], { stdio: 'ignore' })
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ['--no-sandbox'],
  })
  try {
    await waitForPreview(4321)
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    for (const route of ['/lustro-template/index.html', '/lustro-template/components-more.html']) {
      await page.goto(`http://127.0.0.1:4321${route}`, { waitUntil: 'networkidle' })
      const hasRoot = await page.locator('.lustro-bs6-root').count()
      if (!hasRoot) throw new Error(`Missing .lustro-bs6-root on ${route}`)
      const bsBtn = await page.locator('.btn-solid.theme-primary').first().count()
      if (!bsBtn) throw new Error(`Missing BS6 primary button on ${route}`)
    }
    await page.goto('http://127.0.0.1:4321/lustro/components-more', { waitUntil: 'networkidle' })
    await page.screenshot({ path: '/tmp/lustro-bs6-components-more-iframe.png', fullPage: false })
    const iframe = page.frameLocator('iframe[title="Lustro Bootstrap 6 component set"]')
    await iframe.locator('.lustro-bs6-root').waitFor({ timeout: 15000 })
    await page.goto('http://127.0.0.1:4321/lustro-template/components-more.html', { waitUntil: 'networkidle' })
    await page.screenshot({ path: '/tmp/lustro-bs6-standalone-after.png', fullPage: false })
    if (errors.length) throw new Error(errors.join('; '))
    console.log('lustro-bs6: ok (screenshots in /tmp/lustro-bs6-*)')
  } finally {
    await browser.close()
    server.kill()
  }
})().catch((e) => {
  console.error(e)
  process.exit(1)
})
