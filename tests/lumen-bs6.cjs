const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const out = path.join(root, '.artifacts/lumen-bs6');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const preview = spawn(
    path.join(root, 'node_modules/.bin/vitepress'),
    ['preview', root, '--port', '4324', '--host', '127.0.0.1'],
    { stdio: 'ignore' }
  );
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ['--no-sandbox'],
  });
  try {
    await new Promise((r) => setTimeout(r, 2500));
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript(() => {
      window.motionCalls = [];
      const fn = Element.prototype.animate;
      Element.prototype.animate = function (k, o) {
        window.motionCalls.push({ cls: this.className, duration: o?.duration });
        return fn.call(this, k, o);
      };
    });

    await page.goto('http://127.0.0.1:4324/lumen-template/index.html', { waitUntil: 'networkidle' });
    if (!await page.locator('.lmn-bs6').count()) throw new Error('missing .lmn-bs6 scope');
    const bsLink = await page.evaluate(() => {
      const href = [...document.querySelectorAll('link[rel=stylesheet]')].map((l) => l.href).join(' ');
      return href.includes('bootstrap@6.0.0-alpha.1');
    });
    if (!bsLink) throw new Error('Bootstrap 6 stylesheet not loaded');

    await page.screenshot({ path: path.join(out, 'lumen-bs6-light.png') });
    await page.getByRole('button', { name: 'Dark mode', exact: true }).click();
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(out, 'lumen-bs6-dark.png') });

    await page.getByRole('button', { name: 'Staging', exact: true }).click();
    await page.waitForTimeout(150);
    const lat = await page.locator('[data-kpi="lat"]').textContent();
    if (!lat.includes('0.98')) throw new Error('staging KPI switch');

    await page.locator('#chartBox').hover({ position: { x: 280, y: 120 } });
    await page.waitForTimeout(100);
    if (!(await page.locator('#chartTip.show').count())) throw new Error('chart crosshair tooltip');

    await page.getByRole('button', { name: 'Show alert', exact: true }).click();
    await page.waitForSelector('.toast.show', { timeout: 3000 });
    await page.locator('#toast .btn-close').click();
    await page.waitForTimeout(150);

    await page.getByRole('button', { name: 'API keys', exact: true }).click();
    await page.waitForFunction(() => document.getElementById('keysDialog')?.open, { timeout: 3000 });
    await page.evaluate(() => document.getElementById('keysDialog')?.close());
    await page.waitForFunction(() => !document.getElementById('keysDialog')?.open, { timeout: 3000 });

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
    if (running > 2) throw new Error('reduced motion still animating: ' + running);

    await page.goto('http://127.0.0.1:4324/lumen-bootstrap', { waitUntil: 'networkidle' });
    const frame = page.frameLocator('iframe[title="Lumen Bootstrap 6 template preview"]');
    await frame.locator('.lmn-brand').waitFor({ timeout: 5000 });

    if (errors.length) throw new Error(errors.join('; '));
    console.log('lumen-bs6: ok, screenshots in', out);
  } finally {
    await browser.close();
    preview.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
