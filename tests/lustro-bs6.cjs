const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const fs = require('fs');
const outDir = path.join(root, '.artifacts/lustro-bs6');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const server = spawn(path.join(root, 'node_modules/.bin/vitepress'), ['preview', root, '--port', '4368', '--host', '127.0.0.1'], { stdio: 'ignore' });
  const browser = await chromium.launch({
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
    args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://127.0.0.1:4368/lustro-template/index.html', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Replay', exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Show toast', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.toast.show'));
    await page.getByRole('button', { name: 'Open dialog', exact: true }).click();
    await page.waitForSelector('#detailDialog[open]');
    await page.locator('#detailDialog button.btn-solid.theme-secondary').click();
    await page.waitForTimeout(200);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Primary', exact: true }).click();
    if (errors.length) throw new Error(errors.join('\n'));
    console.log('lustro-bs6 PASS');
  } finally {
    await browser.close();
    server.kill();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
