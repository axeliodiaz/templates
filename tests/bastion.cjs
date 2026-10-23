const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { spawn } = require('child_process')
const { chromium } = require('playwright')

const root = path.resolve(__dirname, '..')
const pkg = require(path.join(root, 'package.json'))
assert.equal(pkg.dependencies.bootstrap, '6.0.0-alpha.1', 'bootstrap pin')
assert.ok(pkg.scripts.build.includes('build:bastion-bs6'), 'build generates the scoped sheet')
assert.ok(!pkg.dependencies.bootstrap.startsWith('^') && !pkg.dependencies.bootstrap.includes('next'), 'exact pin')

const css = fs.readFileSync(path.join(root, '.vitepress/theme/bastion.css'), 'utf8')
const block = css.slice(css.indexOf('.bst-root {'), css.indexOf('\n}', css.indexOf('.bst-root {')))
const token = (name) => {
  const m = block.match(new RegExp(name + ':\\s*(#[0-9a-fA-F]{6})'))
  assert.ok(m, name)
  return m[1]
}
const lum = (h) => {
  const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const cr = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
const t = {
  bg: token('--bst-bg'),
  surface: token('--bst-surface'),
  ink: token('--bst-ink'),
  green: token('--bst-green'),
  muted: token('--bst-muted'),
  amber: token('--bst-amber'),
  hot: token('--bst-hot'),
  danger: token('--bst-danger'),
  onGreen: token('--bst-on-green'),
  onAmber: token('--bst-on-amber'),
}
for (const [fg, bg] of [
  ['ink', 'bg'], ['ink', 'surface'], ['green', 'bg'], ['green', 'surface'],
  ['muted', 'bg'], ['muted', 'surface'], ['amber', 'bg'], ['amber', 'surface'],
  ['hot', 'bg'], ['danger', 'bg'], ['onGreen', 'green'], ['onAmber', 'amber'],
]) {
  const ratio = cr(t[fg], t[bg])
  assert.ok(ratio >= 4.5, `${fg}/${bg} ${ratio.toFixed(2)}`)
}
console.log('contrast AA PASS')

const scopedPath = path.join(root, '.vitepress/theme/bastion-bs6.bootstrap.css')
assert.ok(fs.existsSync(scopedPath), 'run npm run build:bastion-bs6 first')
const scoped = fs.readFileSync(scopedPath, 'utf8')
assert.ok(scoped.includes('@scope (.bst-root)'), 'scope root')
assert.ok(!scoped.includes(':root'), 'reboot :root rewritten')
assert.ok(scoped.includes('6.0.0-alpha.1'), 'version banner')

const routes = ['bastion', 'bastion/color', 'bastion/typography', 'bastion/tokens', 'bastion/components', 'bastion/charts', 'bastion/motion', 'bastion/usage', 'bastion/dashboard']
const out = process.env.SCREENSHOT_DIR || path.join(root, '.artifacts/bastion')
fs.mkdirSync(out, { recursive: true })

;(async () => {
  const port = process.env.PORT || '4371'
  const base = process.env.BASE_URL || `http://127.0.0.1:${port}`
  let server
  if (!process.env.BASE_URL) {
    server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--port', port, '--host', '127.0.0.1'], { stdio: 'ignore' })
    const deadline = Date.now() + 20000
    let up = false
    while (Date.now() < deadline) {
      try {
        const res = await fetch(base + '/bastion')
        if (res.ok) { up = true; break }
      } catch { /* preview still booting */ }
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
    if (!up) throw new Error('preview did not start')
  }
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ['--no-sandbox'],
  })
  try {
    for (const [vw, vh, tag] of [[1440, 1000, 'desktop'], [820, 1100, 'tablet'], [390, 844, 'mobile']]) {
      const page = await browser.newPage({ viewport: { width: vw, height: vh } })
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      for (const route of routes) {
        await page.goto(base + '/' + route, { waitUntil: 'networkidle' })
        const info = await page.evaluate(() => ({
          tpl: document.documentElement.dataset.tpl,
          dark: document.documentElement.classList.contains('tpl-dark'),
          over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          h1: document.querySelector('h1')?.textContent || '',
        }))
        assert.equal(info.tpl, 'bastion', route + ' data-tpl')
        assert.equal(info.dark, true, route + ' dark shell')
        assert.ok(info.over <= 2, `${route} ${tag} overflow ${info.over}`)
        assert.ok(info.h1.length > 0, route + ' h1')
      }
      assert.deepEqual(errors, [], tag + ' page errors ' + errors.join(' | '))
      await page.goto(base + '/bastion/dashboard', { waitUntil: 'networkidle' })
      await page.locator('.bst').scrollIntoViewIfNeeded()
      await page.waitForTimeout(600)
      await page.screenshot({ path: path.join(out, `dashboard-${tag}.png`), fullPage: false })
      await page.close()
      console.log(tag, 'routes PASS')
    }

    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(base + '/bastion/dashboard', { waitUntil: 'networkidle' })
    const probe = await page.locator('.bst-root .btn-outline').first().evaluate((el) => ({
      gap: getComputedStyle(el).getPropertyValue('--bs-btn-gap').trim(),
      blue: getComputedStyle(el).getPropertyValue('--bs-blue-500').trim(),
    }))
    assert.ok(probe.gap, 'BS6 button token')
    assert.match(probe.blue, /240deg/, 'BS6 palette token inherited inside .bst-root')
    const shell = await page.evaluate(() => ({
      navBlue: getComputedStyle(document.querySelector('.VPNav')).getPropertyValue('--bs-blue-500').trim(),
      htmlBlue: getComputedStyle(document.documentElement).getPropertyValue('--bs-blue-500').trim(),
      navBastion: getComputedStyle(document.querySelector('.VPNav')).getPropertyValue('--bst-green').trim(),
      rootBastion: getComputedStyle(document.querySelector('.bst-root')).getPropertyValue('--bst-green').trim(),
    }))
    assert.equal(shell.navBastion, '', 'Bastion token leaked onto the shell')
    assert.equal(shell.rootBastion.toLowerCase(), '#62f56a')
    assert.doesNotMatch(shell.htmlBlue, /240deg/, 'Bastion scoped blue overwrote the document')
    assert.notEqual(shell.navBlue, probe.blue, 'shell and Bastion root share one Bootstrap origin')
    await page.getByRole('combobox', { name: 'REGION', exact: true }).selectOption('eu-central-1')
    await page.locator('.bst-map').getByText('6ms', { exact: true }).waitFor()
    await page.getByRole('button', { name: 'Pause tail' }).click()
    assert.equal(await page.getByRole('button', { name: 'Resume tail' }).getAttribute('aria-pressed'), 'true')
    await page.getByRole('button', { name: /VIEW INCIDENT/ }).click()
    await page.locator('dialog[open]').waitFor()
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('dialog[open]').count(), 0, 'Escape closes incident')
    await page.getByRole('button', { name: /DISMISS/ }).click()
    await page.getByRole('status').waitFor()
    assert.match(await page.getByRole('status').innerText(), /dismissed locally/i)
    await page.reload({ waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /APPROVE/ }).click()
    await page.getByText('4/4').waitFor()
    assert.match(await page.getByRole('status').innerText(), /4\/4/)

    await page.goto(base + '/bastion/components', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: 'Show toast' }).click()
    await page.getByText('Changes saved locally').waitFor()
    await page.getByRole('button', { name: 'Open dialog' }).click()
    await page.locator('dialog[open]').waitFor()
    await page.keyboard.press('Escape')
    assert.equal(await page.locator('dialog[open]').count(), 0)
    await page.getByPlaceholder('buttons, dialog, meter').fill('zzzz-no-match')
    await page.getByText(/No component matches/).waitFor()
    await page.getByRole('button', { name: 'Clear search' }).click()

    await page.goto(base + '/bastion/charts', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: '7d', exact: true }).click()
    assert.equal(await page.getByRole('button', { name: '7d', exact: true }).getAttribute('aria-pressed'), 'true')

    await page.goto(base + '/scopecraft', { waitUntil: 'networkidle' })
    assert.equal(await page.locator('.bst-root').count(), 0, 'Bastion root absent on Scopecraft')
    const other = await page.locator('.VPNav').evaluate((el) => getComputedStyle(el).getPropertyValue('--bst-green').trim())
    assert.equal(other, '', 'Bastion tokens stay off Scopecraft')

    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
    await reduced.goto(base + '/bastion/dashboard', { waitUntil: 'networkidle' })
    await reduced.waitForTimeout(400)
    const running = await reduced.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)
    assert.equal(running, 0, 'reduced motion running animations ' + running)
    await reduced.screenshot({ path: path.join(out, 'dashboard-mobile-reduced.png') })
    assert.deepEqual(errors, [], errors.join(' | '))
    console.log('interactions PASS')
  } finally {
    await browser.close()
    server?.kill()
  }
})().catch((error) => {
  console.error(error)
  process.exit(1)
})
