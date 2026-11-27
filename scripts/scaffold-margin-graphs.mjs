#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  MARGIN_GRAPH_PAGES,
  MARGIN_GRAPH_MOTION_MD,
  MARGIN_GRAPH_ENTER_NOTES,
  MARGIN_GRAPH_GROUP_META,
} from './margin-graphs-catalog.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const graphsRoot = path.join(root, 'margin/graphs')
const agentRoot = path.join(root, 'margin/agent-instructions/graphs')

fs.mkdirSync(graphsRoot, { recursive: true })
fs.mkdirSync(agentRoot, { recursive: true })

function chartMd(page) {
  return `---
pageClass: margin-scoped-guide
---
<script setup>
import MarginGraphDoc from '../../.vitepress/theme/MarginGraphDoc.vue'
</script>

# ${page.title}

<MarginGraphDoc slug="${page.slug}" label="${page.title}" component="${page.component}" />
`
}

function agentMd(page) {
  const enterNote =
    MARGIN_GRAPH_ENTER_NOTES[page.slug] || MARGIN_GRAPH_ENTER_NOTES.default
  return `# ${page.title}

Margin graphs · \`${page.slug}\` · component \`${page.component}\`

## Preview

- Scoped \`.mg-graph-lab\` Felix JSON chart with **Replay**, **Shuffle data**, and data-state select.
- Dark preview toggle on the guide frame; motion waits until after hydration (\`mg-guide-motion\`).

## Spec

- Example key: \`${page.exampleKey}\`
- Component id: \`${page.component}\`
- Data is synthetic; wire your own API and validation in production.

${MARGIN_GRAPH_MOTION_MD.trim()}

**This chart:** ${enterNote}

## Accessibility

- SVG \`role="img"\` with title; marks are keyboard-focusable with \`role="button"\`.
- Status readout uses \`role="status"\`.
- Honor \`prefers-reduced-motion\` (instant render).

## Checklist

- [ ] Replay enter motion without flashing before hydration
- [ ] Shuffle data morphs smoothly (or instant when reduced motion)
- [ ] Loading and empty states show status text
- [ ] Dark preview maintains readable grid and labels
`
}

fs.writeFileSync(
  path.join(graphsRoot, 'index.md'),
  `---
pageClass: margin-scoped-guide
---
<script setup>
import MarginGraphOverview from '../../.vitepress/theme/MarginGraphOverview.vue'
import MarginGraphMotionProse from '../../.vitepress/theme/MarginGraphMotionProse.vue'
</script>

# Graphs

Charts use the Felix JSON spec plus Margin preview chrome. Every chart page includes live motion controls and the same motion contract documented below.

<MarginGraphOverview />

## Motion

<MarginGraphMotionProse />
`,
)

let n = 0
for (const page of MARGIN_GRAPH_PAGES) {
  fs.writeFileSync(path.join(graphsRoot, `${page.slug}.md`), chartMd(page))
  fs.writeFileSync(path.join(agentRoot, `${page.slug}.md`), agentMd(page))
  n++
}

const pagesJson = path.join(root, '.vitepress/theme/margin-graphs-pages.json')
fs.writeFileSync(
  pagesJson,
  `${JSON.stringify({ groups: MARGIN_GRAPH_GROUP_META, pages: MARGIN_GRAPH_PAGES }, null, 2)}\n`,
)

console.log(`scaffold-margin-graphs: ${n} chart pages + index`)