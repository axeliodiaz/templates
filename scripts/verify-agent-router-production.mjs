#!/usr/bin/env node
const urls = [
  'https://templates.axeldiaz.com/margin/agent-router',
  'https://templates.axeldiaz.com/margin/demos/',
]
let fail = 0
for (const url of urls) {
  const res = await fetch(url)
  const text = await res.text()
  const ok =
    res.ok &&
    (url.includes('agent-router')
      ? text.includes('mg-margin-agent-router') && text.includes('mg-ar')
      : text.includes('mg-margin-demos-index'))
  console.log(url, res.status, ok ? 'ok' : 'BAD')
  if (!ok) fail = 1
}
const home = await (await fetch('https://templates.axeldiaz.com/margin/analytics')).text()
const navOk = home.includes('Examples &amp; Demos') || home.includes('Examples & Demos')
console.log('sidebar Examples & Demos', navOk ? 'ok' : 'BAD')
if (!navOk) fail = 1
process.exit(fail)