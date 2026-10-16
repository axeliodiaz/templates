const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const themePath = path.join(__dirname, '..', 'public', 'felix-bootstrap', 'felix-theme.css')
const mdPath = path.join(__dirname, '..', 'felix', 'components-more.md')

test('felix BS6 theme is scoped and maps primary tokens', () => {
  const css = fs.readFileSync(themePath, 'utf8')
  assert.match(css, /\.felix-bs6\s*\{/)
  assert.match(css, /--bs-primary-base:/)
  assert.match(css, /--fx-turquoise:/)
})

test('felix components-more uses felix-bs6 wrappers', () => {
  const md = fs.readFileSync(mdPath, 'utf8')
  assert.match(md, /Bootstrap 6\.0\.0-alpha\.1/)
  assert.ok(!md.includes('class="bsx bsx-fx"'), 'legacy bsx wrapper should be migrated')
  assert.ok((md.match(/class="felix-bs6"/g) || []).length >= 40, 'expected many felix-bs6 blocks')
})
