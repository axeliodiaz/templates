#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const components = [
  ['accordion', 'Accordion'],
  ['alerts', 'Alerts'],
  ['badge', 'Badge'],
  ['breadcrumb', 'Breadcrumb'],
  ['buttons', 'Buttons'],
  ['button-group', 'Button group'],
  ['card', 'Card'],
  ['carousel', 'Carousel'],
  ['close-button', 'Close button'],
  ['collapse', 'Collapse'],
  ['dropdowns', 'Dropdowns'],
  ['list-group', 'List group'],
  ['modal', 'Modal'],
  ['navbar', 'Navbar'],
  ['navs-tabs', 'Navs and tabs'],
  ['offcanvas', 'Offcanvas'],
  ['pagination', 'Pagination'],
  ['placeholders', 'Placeholders'],
  ['popovers', 'Popovers'],
  ['progress', 'Progress'],
  ['scrollspy', 'Scrollspy'],
  ['spinners', 'Spinners'],
  ['toasts', 'Toasts'],
  ['tooltips', 'Tooltips'],
]

const forms = [
  ['overview', 'Overview', ''],
  ['form-control', 'Form control', 'form-control'],
  ['select', 'Select', 'select'],
  ['checks-radios', 'Checks and radios', 'checks-radios'],
  ['range', 'Range', 'range'],
  ['input-group', 'Input group', 'input-group'],
  ['floating-labels', 'Floating labels', 'floating-labels'],
  ['layout', 'Layout', 'layout'],
  ['validation', 'Validation', 'validation'],
]

const content = [
  ['reboot', 'Reboot', 'reboot'],
  ['typography', 'Typography', 'typography'],
  ['images', 'Images', 'images'],
  ['tables-figures', 'Tables and figures', 'tables-figures'],
]

function compMd(slug, title) {
  return `---
pageClass: margin-scoped-guide
---
<script setup>
import MarginBs6Section from '../../.vitepress/theme/MarginBs6Section.vue'
</script>

# ${title}

Bootstrap 5.3/6-compatible **${title.toLowerCase()}** on scoped \`b2-bs6\` + Margin \`.lab\` tokens. Toggle **Dark preview** to verify AA contrast, keyboard focus, and \`prefers-reduced-motion\`.

<MarginBs6Section section="${slug}" label="${title}" />

## Markup shell

\`\`\`html
<div class="lab b2-bs6 b2-margin">
  <!-- Bootstrap component markup -->
</div>
\`\`\`

Fictitious sample data only. Wire your own API, authorization, and persistence before production.

## Accessibility

Tab through the live example. Use Enter/Space on buttons and toggles; Escape closes dialogs and offcanvas surfaces. Pair status with text, not color alone.
`
}

function formsMd(slug, title, section) {
  const sec = section || slug
  return `---
pageClass: margin-scoped-guide
---
<script setup>
import MarginFormsSection from '../../.vitepress/theme/MarginFormsSection.vue'
</script>

# ${title}

Margin forms mirror Bootstrap’s form docs with \`form-control\`, labels, validation states, and layout utilities inside \`.lab\` / \`.b2-margin\`.

<MarginFormsSection section="${sec}" label="${title}" />

\`\`\`html
<div class="lab b2-bs6 b2-margin">
  <label class="form-label" for="sample">Label</label>
  <input id="sample" class="form-control" />
</div>
\`\`\`
`
}

function contentMd(slug, title, section) {
  return `---
pageClass: margin-scoped-guide
---
<script setup>
import MarginContentSection from '../../.vitepress/theme/MarginContentSection.vue'
</script>

# ${title}

Bootstrap **Content** (${title.toLowerCase()}) with Margin palette tokens. See also [Foundations typography](/margin/foundations/typography) for product type roles (DM Sans / Space Grotesk).

<MarginContentSection section="${section}" label="${title}" />

\`\`\`html
<div class="lab b2-bs6 b2-margin margin-content-demo">
  <!-- Reboot / typography / media markup -->
</div>
\`\`\`
`
}

fs.mkdirSync(path.join(root, 'margin/forms'), { recursive: true })
fs.mkdirSync(path.join(root, 'margin/content'), { recursive: true })

for (const [slug, title] of components) {
  fs.writeFileSync(path.join(root, `margin/components/${slug}.md`), compMd(slug, title))
}

fs.writeFileSync(
  path.join(root, 'margin/forms/index.md'),
  `---
pageClass: margin-scoped-guide
---

# Forms

Bootstrap form patterns scoped to Margin. Each page includes a live preview and copyable HTML inside \`.lab b2-bs6 b2-margin\`.

See [Form control](/margin/forms/form-control) to start, or [Validation](/margin/forms/validation) for error states.
`
)

for (const [slug, title, sec] of forms) {
  if (slug === 'overview') {
    fs.writeFileSync(path.join(root, 'margin/forms/overview.md'), formsMd(slug, title, sec))
    continue
  }
  fs.writeFileSync(path.join(root, `margin/forms/${slug}.md`), formsMd(slug, title, sec))
}

fs.writeFileSync(
  path.join(root, 'margin/content/index.md'),
  `---
pageClass: margin-scoped-guide
---

# Content

Bootstrap **Content** docs for Margin: Reboot base styles, typography, images, and tables/figures — all using \`.lab\` tokens with light/dark previews.

Product-specific font stacks and dashboard scale live under [Foundations → Typography](/margin/foundations/typography); this section covers global HTML defaults and prose patterns.
`
)

for (const [slug, title, section] of content) {
  fs.writeFileSync(path.join(root, `margin/content/${slug}.md`), contentMd(slug, title, section))
}

// components index
fs.writeFileSync(
  path.join(root, 'margin/components/index.md'),
  `---
pageClass: margin-scoped-guide
---

# Components

Bootstrap 6.0.0-alpha.1 component families styled with Margin \`.lab\` tokens (\`#6389ea\` accent). Each page has a live example, copyable shell markup, and accessibility notes.

Dashboard-specific chrome (sidebar, top bar, \`mg-*\` tables) lives under [Modules](/margin/modules/). Analytics chart patterns are under [Patterns](/margin/patterns/).
`
)

console.log('Scaffolded margin component, forms, and content docs')