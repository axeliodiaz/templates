#!/usr/bin/env node
const paths = [
  '/margin/agent-router',
  '/margin/pr-lifecycle',
  '/margin/squash-force-push',
  '/margin/squash-force-push/submodules',
  '/margin/agent-orchestration',
  '/margin/agent-crew',
  '/margin/payment-ticket',
  '/margin/agent-toasts',
  '/margin/correos',
  '/margin/demos/',
  '/margin/demos/gauges',
]
const banned = [/Inspired by/i, /@pitus_/i, /@componest/i, /@flohoeller/i, /Pixel-close to/i, /Felix catalog/i]
let fail = 0
for (const p of paths) {
  const url = `https://templates.axeldiaz.com${p}`
  const text = await (await fetch(url)).text()
  const hit = banned.find((re) => re.test(text))
  console.log(url, hit ? `BAD (${hit})` : 'ok')
  if (hit) fail = 1
}
process.exit(fail)