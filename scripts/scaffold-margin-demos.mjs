#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MARGIN_DEMOS } from './margin-demos-manifest.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const demosDir = path.join(root, 'margin/demos')
const agentDemosDir = path.join(root, 'margin/agent-instructions/demos')

function propAttrs(demo) {
  const lines = []
  for (const [k, v] of Object.entries(demo.props || {})) {
    lines.push(typeof v === 'string' ? `${k}="${v}"` : `:${k}="${v}"`)
  }
  return lines.join(' ')
}

function vueImport(demo) {
  const base = '../../.vitepress/theme'
  if (demo.component.startsWith('Margin')) return `import ${demo.component} from '${base}/margin-demos/${demo.component}.vue'`
  return `import ${demo.component} from '${base}/${demo.component}.vue'`
}

function pageMd(demo) {
  const attrs = propAttrs(demo)
  const tag = attrs ? `<${demo.component} ${attrs} />` : `<${demo.component} />`
  const usage = demo.usage.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  return `---
pageClass: margin-scoped-guide
---
<script setup>
${vueImport(demo)}
import MarginDemoShell from '../../.vitepress/theme/margin-demos/MarginDemoShell.vue'
const usage = '${usage}'
</script>

# ${demo.title}

Studio example from the Felix catalog, restyled with Margin tokens (\`#6389ea\`, \`#f5f5f7\`, system UI). Fictitious data only.

<MarginDemoShell :copy="usage">
  ${tag}
</MarginDemoShell>

[Demos index](/margin/demos/)
`
}

function agentStub(demo) {
  return `# ${demo.title}

Margin demos · /margin/demos/${demo.slug}

\`${demo.usage}\`

Fictitious sample data. Pair with \`MarginGuidePreview\` for light/dark at 390px.
`
}

fs.mkdirSync(demosDir, { recursive: true })
fs.mkdirSync(agentDemosDir, { recursive: true })

const indexLines = [
  '---',
  'pageClass: margin-scoped-guide',
  '---',
  '',
  '# Demos',
  '',
  'Felix dashboard and product examples restyled with Margin design tokens. Each page includes a live preview (light/dark), copyable markup, and a 390px-friendly layout inside `MarginGuidePreview`.',
  '',
  '<span id="mg-margin-demos-index" hidden aria-hidden="true"></span>',
  '',
  '## Catalog',
  '',
  ...MARGIN_DEMOS.map(
    (d) => `- [${d.title}](/margin/demos/${d.slug}) — \`${d.usage}\``,
  ),
  '',
]

fs.writeFileSync(path.join(demosDir, 'index.md'), indexLines.join('\n'))

for (const demo of MARGIN_DEMOS) {
  fs.writeFileSync(path.join(demosDir, `${demo.slug}.md`), pageMd(demo))
  fs.writeFileSync(path.join(agentDemosDir, `${demo.slug}.md`), agentStub(demo))
}

fs.writeFileSync(
  path.join(agentDemosDir, 'index.md'),
  `# Demos index\n\n${MARGIN_DEMOS.map((d) => `- [${d.title}](https://templates.axeldiaz.com/margin/demos/${d.slug}): \`${d.usage}\``).join('\n')}\n`,
)

console.log(`scaffold-margin-demos: ${MARGIN_DEMOS.length} pages`)