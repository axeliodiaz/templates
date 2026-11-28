#!/usr/bin/env node
const url = 'https://templates.axeldiaz.com/margin/pr-lifecycle'
const res = await fetch(url)
const text = await res.text()
const ok =
  res.ok &&
  text.includes('mg-margin-pr-lifecycle') &&
  text.includes('mg-prl__track') &&
  text.includes('Pull request lifecycle')
console.log(url, res.status, ok ? 'ok' : 'BAD')
process.exit(ok ? 0 : 1)