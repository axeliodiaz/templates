#!/usr/bin/env node
import { chromium } from 'playwright'
import path from 'node:path'

const base = (process.argv.find((a, i) => process.argv[i - 1] === '--base') ?? process.env.MARGIN_AUDIT_BASE ?? 'https://templates.axeldiaz.com').replace(/\/$/, '')
const out = '/opt/cursor/artifacts'

const contentPaths = [
  '/margin/content/reboot',
  '/margin/content/typography',
  '/margin/content/images',
  '/margin/content/tables',
  '/margin/content/prose',
]
const formsPaths = ['/margin/forms/overview', '/margin/forms/input-group']

const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] })

async function capture(pagePath, name, viewport, colorScheme, darkPreview) {
  const page = await browser.newPage({ viewport, colorScheme })
  await page.goto(`${base}${pagePath}`, { waitUntil: 'domcontentloaded', timeout: 120000 })
  await page.locator('.mg-guide-preview').first().waitFor({ state: 'visible', timeout: 60000 })
  if (darkPreview) {
    const btn = page.getByRole('button', { name: /Dark preview/i })
    if (await btn.isVisible()) await btn.click()
    await page.waitForTimeout(600)
  }
  const preview = page.locator('.mg-guide-preview').first()
  await preview.screenshot({ path: path.join(out, `${name}.png`) })
  const corner = await page.evaluate(() => {
    const root = document.querySelector('.mg-guide-preview .margin-bs6-root,.mg-guide-preview .kit-margin')
    const inner = root?.querySelector('.l-demo,.mg-content-block,.kit-section')
    const rs = root ? getComputedStyle(root) : null
    const is = inner ? getComputedStyle(inner) : null
    return {
      rootBg: rs?.backgroundColor,
      rootBr: rs?.borderRadius,
      innerBg: is?.backgroundColor,
      innerBr: is?.borderRadius,
      labDark: root?.classList.contains('lab-dark'),
      previewDark: document.querySelector('.mg-guide-preview')?.classList.contains('lab-dark'),
    }
  })
  console.log(name, corner)
  await page.close()
}

for (const p of contentPaths) {
  const slug = p.split('/').pop()
  await capture(p, `margin-content-${slug}-1024-light`, { width: 1280, height: 900 }, 'light', false)
  await capture(p, `margin-content-${slug}-1024-dark`, { width: 1280, height: 900 }, 'dark', false)
  await capture(p, `margin-content-${slug}-1024-preview-dark`, { width: 1280, height: 900 }, 'light', true)
}
for (const p of formsPaths) {
  const slug = p.split('/').pop()
  await capture(p, `margin-forms-${slug}-1024-light`, { width: 1280, height: 900 }, 'light', false)
  await capture(p, `margin-forms-${slug}-1024-dark`, { width: 1280, height: 900 }, 'dark', false)
  await capture(p, `margin-forms-${slug}-1024-preview-dark`, { width: 1280, height: 900 }, 'light', true)
}

await capture('/margin/content/reboot', 'margin-content-reboot-390-light', { width: 390, height: 844 }, 'light', false)
await capture('/margin/content/reboot', 'margin-content-reboot-390-preview-dark', { width: 390, height: 844 }, 'light', true)

await browser.close()
console.log('margin preview polish screenshots ok')