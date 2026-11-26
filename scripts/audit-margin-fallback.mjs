#!/usr/bin/env node
/**
 * Static route map audit (demos registered). For styled controls, run:
 *   node scripts/audit-margin-button-render.mjs
 */
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
      note: 'Use scripts/audit-margin-button-render.mjs for Playwright btn styling checks.',
      emptyGenericFallback: emptyGeneric,
      proseTextOnlyNoLivePreview: proseNoPreview,
      summary: {
        emptyGenericCount: emptyGeneric.length,
        proseNoPreviewCount: proseNoPreview.length,
      },
    },
    null,
    2,
  ),
)