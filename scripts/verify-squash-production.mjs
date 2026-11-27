#!/usr/bin/env node
const urls = [
  'https://templates.axeldiaz.com/margin/squash-force-push',
  'https://templates.axeldiaz.com/margin/squash-force-push/submodules',
]
let fail = 0
for (const url of urls) {
  const res = await fetch(url)
  const text = await res.text()
  const ok =
    res.ok &&
    (text.includes('mg-sq-state-gallery') ||
      text.includes('mg-sq-checks__trigger') ||
      text.includes('mg-squash') ||
      text.includes('mg-sq-'))
  console.log(url, res.status, ok ? 'ok' : 'BAD')
  if (!ok) fail = 1
}
const llms = await (await fetch('https://templates.axeldiaz.com/margin/llms.txt')).text()
console.log('llms squash', llms.includes('squash-force-push') ? 'ok' : 'BAD')
if (!llms.includes('squash-force-push')) fail = 1
process.exit(fail)