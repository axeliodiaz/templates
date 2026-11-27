#!/usr/bin/env node
const urls = [
  'https://templates.axeldiaz.com/margin/demos/',
  'https://templates.axeldiaz.com/margin/demos/gauges',
  'https://templates.axeldiaz.com/margin/correos',
]
let fail = 0
for (const url of urls) {
  const res = await fetch(url)
  const text = await res.text()
  const ok = res.ok && (text.includes('mg-margin-demo') || text.includes('Demos') || text.includes('mm-'))
  console.log(url, res.status, ok ? 'ok' : 'BAD')
  if (!ok) fail = 1
}
const llms = await (await fetch('https://templates.axeldiaz.com/margin/llms.txt')).text()
const llOk = llms.includes('demos/') && !llms.includes('Run observation')
console.log('llms', llOk ? 'ok' : 'BAD', llms.includes('Examples') ? '(Examples)' : '')
if (!llOk) fail = 1
process.exit(fail)