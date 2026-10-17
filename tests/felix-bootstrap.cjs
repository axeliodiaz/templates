#!/usr/bin/env node
/** Smoke test for Felix Bootstrap 6 standalone templates (requires build + Playwright). */
const { spawn } = require('child_process');
const path = require('path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const bin = path.join(root, 'node_modules/.bin/vitepress');

(async () => {
  const server = spawn(bin, ['preview', root, '--port', '4318', '--host', '127.0.0.1'], { stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 2500));
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    for (const route of ['/felix-template/index.html', '/felix-template/catalog.html']) {
      await page.goto(`http://127.0.0.1:4318${route}`, { waitUntil: 'networkidle' });
      const theme = await page.locator('link[href*="felix-theme.css"]').count();
      if (!theme) throw new Error(`Missing felix-theme.css on ${route}`);
      const bs = await page.locator('link[href*="bootstrap@6.0.0-alpha.1"]').count();
      if (!bs) throw new Error(`Missing Bootstrap 6 CSS on ${route}`);
    }

    await page.goto('http://127.0.0.1:4318/felix-template/index.html', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: '+$25' }).click();
    await page.getByRole('button', { name: 'Send now' }).click();
    await page.getByRole('button', { name: 'Confirm (local)' }).click();
    await page.waitForFunction(() => document.querySelector('.toast.show, .toast.showing'));
    await page.screenshot({ path: '/tmp/felix-bs6-after-send.png' });

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'networkidle' });
    const animCount = await page.evaluate(() => document.getAnimations().length);
    if (animCount > 2) throw new Error('Expected reduced motion to limit animations');

    if (errors.length) throw new Error(errors.join('; '));
    console.log('felix-bootstrap: ok');
  } finally {
    await browser.close();
    server.kill('SIGTERM');
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
