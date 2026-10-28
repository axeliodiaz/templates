const { chromium } = require('playwright')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')
const http = require('http')

const root = path.resolve(__dirname, '..')
const out = path.join(root, '.artifacts/relay')
const artifacts = '/opt/cursor/artifacts'
fs.mkdirSync(out, { recursive: true })
fs.mkdirSync(artifacts, { recursive: true })

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
if (pkg.dependencies.bootstrap !== '6.0.0-alpha.1') throw new Error('bootstrap pin ' + pkg.dependencies.bootstrap)

const css = fs.readFileSync(path.join(root, '.vitepress/theme/relay-bs6.bootstrap.css'), 'utf8')
if (!css.includes('@scope (.relay-bs6)')) throw new Error('relay scope missing')
if (css.includes('@scope (.b2-bs6)')) throw new Error('relay css picked up catalog scope')
const batch = fs.readFileSync(path.join(root, '.vitepress/theme/batch2-bs6.bootstrap.css'), 'utf8')
if (!batch.includes('@scope (.b2-bs6)')) throw new Error('catalog scope missing')
if (batch.includes('@scope (.relay-bs6)')) throw new Error('catalog css picked up relay scope')

const port = process.env.RELAY_PORT || '4362'
const chrome = process.env.CHROME_PATH || process.env.CHROME_BIN || '/usr/bin/google-chrome'

;(async () => {
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--port', port, '--host', '127.0.0.1'], { stdio: 'ignore' })
  await new Promise((resolve, reject) => {
    const started = Date.now()
    const probe = () => {
      const req = http.get({ host: '127.0.0.1', port, path: '/relay/' }, (res) => {
        res.resume()
        resolve()
      })
      req.on('error', () => {
        if (Date.now() - started > 20000) reject(new Error('preview did not start'))
        else setTimeout(probe, 200)
      })
    }
    probe()
  })
  const browser = await chromium.launch({ executablePath: fs.existsSync(chrome) ? chrome : undefined, args: ['--no-sandbox'] })
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    const base = `http://127.0.0.1:${port}`

    for (const slug of ['', 'foundations', 'tokens', 'motion', 'components', 'charts', 'layouts', 'overview']) {
      const response = await page.goto(`${base}/relay/${slug}`, { waitUntil: 'networkidle' })
      if (!response || response.status() >= 400 || (await page.title()).includes('404')) throw new Error('404 ' + slug)
    }

    await page.locator('.relay').scrollIntoViewIfNeeded()
    await page.waitForTimeout(900)
    const edges = await page.locator('.rl-edge').count()
    if (edges < 7) throw new Error('edges ' + edges)
    if (await page.locator('.rl-spark-line').count() !== 3) throw new Error('sparklines')
    if (!(await page.locator('.rl-side').isVisible())) throw new Error('desktop rail')
    if (await page.locator('.rl-menu').isVisible()) throw new Error('menu on desktop')
    await page.locator('.relay').screenshot({ path: path.join(artifacts, 'relay_desktop_1440.png') })
    await page.screenshot({ path: path.join(out, 'desktop-page.png') })

    await page.setViewportSize({ width: 820, height: 1100 })
    await page.waitForTimeout(400)
    if (await page.locator('.rl-side').isVisible()) throw new Error('rail at 820')
    if (await page.locator('.rl-edge:visible').count()) throw new Error('edges at 820')
    if (!(await page.locator('.rl-links').isVisible())) throw new Error('link sentence')
    await page.locator('.relay').screenshot({ path: path.join(artifacts, 'relay_tablet_820.png') })
    await page.getByRole('button', { name: 'Open navigation' }).click()
    await page.waitForTimeout(250)
    const drawer = page.locator('#relay-nav-drawer')
    if (!(await drawer.isVisible())) throw new Error('drawer')
    await drawer.getByRole('button', { name: 'Agents', exact: true }).click()
    await page.waitForTimeout(200)
    if (await page.locator('dialog[open]').count()) throw new Error('drawer stayed open')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.waitForTimeout(400)
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) throw new Error('overflow')
    await page.locator('.rl-activity').scrollIntoViewIfNeeded()
    if (!(await page.locator('.rl-feed-row').first().isVisible())) throw new Error('feed')
    await page.locator('.relay').screenshot({ path: path.join(artifacts, 'relay_mobile_390.png') })
    await page.screenshot({ path: path.join(out, 'mobile-page.png'), fullPage: true })

    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.waitForTimeout(400)
    await page.locator('.rl-approvals').getByRole('button', { name: /Approve/ }).first().click()
    await page.waitForTimeout(900)
    const feedText = await page.locator('.rl-activity').innerText()
    if (!feedText.includes('approved Code Agent')) throw new Error('approve feed')
    const pending = await page.locator('.rl-approvals').innerText()
    if (!pending.includes('Ops Agent') || pending.includes('database migration')) throw new Error('approval left: ' + pending.slice(0, 180))

    await page.getByLabel('Ask your agents').click()
    await page.getByRole('option', { name: 'Summarize the sample schema' }).click()
    await page.waitForTimeout(200)
    if (!(await page.locator('.rl-activity').innerText()).includes('asked: Summarize the sample schema')) throw new Error('ask')

    await page.getByRole('button', { name: 'About this sample' }).click()
    await page.waitForTimeout(200)
    if (!(await page.getByRole('dialog', { name: 'Sample control room' }).isVisible())) throw new Error('help')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(200)
    if (await page.locator('dialog[open]').count()) throw new Error('escape')

    await page.locator('.rl-side').getByRole('button', { name: 'MCP Servers' }).click()
    await page.getByRole('button', { name: 'Pause sample' }).first().click()
    if (!(await page.locator('.rl-side').innerText()).includes('1 sample server paused')) throw new Error('pause')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload({ waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    const running = await page.evaluate(() => document.getAnimations().filter((animation) => animation.playState === 'running').length)
    if (running) throw new Error('reduced motion ' + running)
    const calls = await page.locator('.rl-metric').first().innerText()
    if (!calls.includes('1,284')) throw new Error('count ' + calls)

    if (errors.length) throw new Error(errors.join('; '))
    console.log('PASS Relay desktop/tablet/mobile, approve, ask, drawer, pause, reduced motion')
  } finally {
    await browser.close()
    server.kill()
  }
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
