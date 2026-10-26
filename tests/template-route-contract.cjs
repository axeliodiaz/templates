const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
test('Margin navigation keeps email and analytics within its template', () => {
 const config = fs.readFileSync('.vitepress/config.mts','utf8')
 assert.match(config, /\/margin\/correos/)
 assert.match(config, /\/margin\/analytics/)
 for (const page of ['margin/correos.md','margin/analytics.md']) assert.ok(fs.existsSync(page))
 const emails=fs.readFileSync('margin/correos.md','utf8')
 for (const sample of ['Quote approved','Invoice ready','Job update']) assert.ok(emails.includes(sample))
 assert.ok(emails.includes('Fictitious'))
})
test('Lustro scoped pages coexist with legacy root links',()=>{
 for(const page of ['correos','tables','ui-kit','introduccion']){
  assert.ok(fs.existsSync(`${page}.md`))
  assert.ok(fs.existsSync(`lustro/${page}.md`))
 }
 assert.ok(fs.existsSync('lustro/guide-components.md'))
 assert.ok(fs.existsSync('components.md'))
})
