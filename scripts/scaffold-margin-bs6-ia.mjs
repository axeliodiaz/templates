#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { MARGIN_BS6_IA } from './margin-bs6-ia.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function pageMd(area, slug, title, isIndex) {
  if (area === 'customize' && slug === 'color') {
    return `---
pageClass: margin-scoped-guide
---
<script setup>
import MarginBs6Doc from '../../.vitepress/theme/MarginBs6Doc.vue'
</script>

# ${title}

Canonical \`.lab\` tokens with accent \`#6389ea\`. Swatches use automatic foreground text for WCAG AA.

<MarginBs6Doc area="customize" slug="color" label="${title}" />

\`\`\`css
.lab{--bg:#f5f5f7;--surface:#fff;--ink:#22252b;--muted:#676e7b;--line:#e0e3e9;--soft:#eceef5;}
.lab-dark{--bg:#181b22;--surface:#242833;--ink:#f1f3f8;--muted:#aab3c3;--line:#404757;--soft:#303747;}
\`\`\`
`
  }
  const heading = isIndex ? `# ${title}\n\nIndex for Bootstrap v6 **${title}** docs on Margin tokens.` : `# ${title}`
  return `---
pageClass: margin-scoped-guide
---
<script setup>
import MarginBs6Doc from '../../.vitepress/theme/MarginBs6Doc.vue'
</script>

${heading}

Mirrors [Bootstrap v6.0 · ${title}](https://getbootstrap.com/docs/6.0/${area}/${slug === 'introduction' ? '' : slug}/) with Margin \`.lab\` / \`b2-margin\` styling.

<MarginBs6Doc area="${area === 'gettingStarted' ? 'getting-started' : area}" slug="${slug}" label="${title}" />

\`\`\`html
<div class="lab b2-bs6 b2-margin">
  <!-- ${area}/${slug} -->
</div>
\`\`\`
`
}

for (const [key, block] of Object.entries(MARGIN_BS6_IA)) {
  const area = key === 'gettingStarted' ? 'getting-started' : key
  const dir = path.join(root, 'margin', area)
  fs.mkdirSync(dir, { recursive: true })
  for (const row of block.pages) {
    const [slug, title, isIndex] = row
    const fileSlug = isIndex ? 'index' : slug
    fs.writeFileSync(path.join(dir, `${fileSlug}.md`), pageMd(area, slug, title, isIndex))
    if (isIndex && slug !== 'introduction' && slug !== 'index') {
      fs.writeFileSync(path.join(dir, `${slug}.md`), pageMd(area, slug, title, false))
    }
  }
}

// product sections indexes
for (const [dir, title, blurb] of [
  ['patterns', 'Patterns', 'Analytics visualization patterns (`mg-*`).'],
  ['modules', 'Modules', 'Dashboard chrome and observation modules.'],
]) {
  fs.mkdirSync(path.join(root, 'margin', dir), { recursive: true })
  fs.writeFileSync(
    path.join(root, 'margin', dir, 'index.md'),
    `---\npageClass: margin-scoped-guide\n---\n\n# ${title}\n\n${blurb}\n`
  )
}

console.log('Scaffolded Bootstrap v6-aligned Margin doc tree')