#!/usr/bin/env node
import fs from 'node:fs'
import { MARGIN_BS6_IA } from './margin-bs6-ia.mjs'

const genericSrc = fs.readFileSync('.vitepress/theme/margin-bs6-generic-demos.ts', 'utf8')
const proseSrc = fs.readFileSync('.vitepress/theme/margin-bs6-prose.ts', 'utf8')

function hasBuiltin(routeKey) {
  return genericSrc.includes(`'${routeKey}':`)
}

function hasUtil(slug) {
  const esc = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`(?:'${esc}'|${esc}): \``).test(genericSrc)
}

function hasProsePreview(routeKey) {
  return proseSrc.includes(`'${routeKey}':`)
}

const PROSE = new Set(['getting-started', 'guides', 'customize'])
const emptyGeneric = []
const proseNoPreview = []
const unstyledButtons = []

const btnRe = /class="[^"]*\bbtn\b(?!\-\w)[^"]*"/g
for (const m of genericSrc.matchAll(btnRe)) {
  if (!m[0].includes('btn-solid') && !m[0].includes('btn-outline')) unstyledButtons.push({ source: 'generic-demos', match: m[0] })
}
for (const m of proseSrc.matchAll(btnRe)) {
  if (!m[0].includes('btn-solid') && !m[0].includes('btn-outline')) unstyledButtons.push({ source: 'prose', match: m[0] })
}

for (const [key, block] of Object.entries(MARGIN_BS6_IA)) {
  const area = key === 'gettingStarted' ? 'getting-started' : key
  if (['components', 'forms', 'content'].includes(area)) continue
  for (const [slug] of block.pages) {
    const rk = `${area}/${slug}`
    if (area === 'customize' && (slug === 'color' || slug === 'color-modes')) continue
    if (PROSE.has(area)) {
      if (!hasProsePreview(rk)) proseNoPreview.push(rk)
      continue
    }
    if (!hasBuiltin(rk) && !(area === 'utilities' && hasUtil(slug))) emptyGeneric.push(rk)
  }
}

console.log(
  JSON.stringify(
    {
      emptyGenericFallback: emptyGeneric,
      proseTextOnlyNoLivePreview: proseNoPreview,
      unstyledBtnClasses: unstyledButtons,
      summary: {
        emptyGenericCount: emptyGeneric.length,
        proseNoPreviewCount: proseNoPreview.length,
        unstyledBtnCount: unstyledButtons.length,
      },
    },
    null,
    2,
  ),
)