#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const pages = {
  'margin/guides/quickstart.md': {
    title: 'Quickstart',
    area: 'guides',
    slug: 'quickstart',
    body: `Use this page to drop Margin's scoped Bootstrap 6 kit into a static page or app shell.

## CSS

The site ships scoped Bootstrap 6 CSS as \`batch2-bs6.bootstrap.css\` plus Margin overrides in \`margin-bs6.css\` (see the repo \`.vitepress/theme/\`). For a standalone export, bundle those files with your markup — do not paste the full Lustro catalog.

## Root surface

Wrap every interactive example in:

\`\`\`html
<div class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin">
  <!-- content -->
</div>
\`\`\`

Optional dark tokens: add \`lab-dark\` on the same root (or use the doc **Dark preview** toggle to inspect contrast).

## Starter template

A minimal HTML document loads the kit root and one primary control:

<MarginBs6Doc area="guides" slug="quickstart" label="First controls" />

## Light / dark

Toggle **Dark preview** on any Margin doc page to preview \`.lab-dark\` token values. In product chrome, keep theme state on \`.margin.lab-dark\` for analytics (see [Color modes](/margin/customize/color-modes)).

## Next steps

- [Introduction](/margin/getting-started/) — how Margin maps Bootstrap IA
- [Components](/margin/components/button) — catalog demos with copyable markup
- [Customize color](/margin/customize/color) — AA token swatches`,
  },
  'margin/guides/migration.md': {
    title: 'Migration',
    area: 'guides',
    slug: 'migration',
    body: `Legacy paths redirect in \`vercel.json\`.

## Path changes

| Old (v5-style) | New (v6) |
| --- | --- |
| \`/margin/components/buttons\` | \`/margin/components/button\` |
| \`/margin/foundations/*\` | \`/margin/customize/*\` or \`/margin/getting-started/*\` |

## Markup

Replace unscoped Bootstrap with:

\`\`\`html
<div class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin lab-dark">
  <button type="button" class="btn-solid theme-primary">Action</button>
</div>
\`\`\`

Use \`btn-solid\` / \`btn-outline\` with \`theme-primary\` or \`theme-secondary\` — not unstyled \`.btn\` alone.

<MarginBs6Doc area="guides" slug="migration" label="Migration" />`,
  },
  'margin/guides/contribute.md': {
    title: 'Contribute',
    area: 'guides',
    slug: 'contribute',
    body: `## Regenerate the Margin BS6 tree

\`\`\`bash
node scripts/scaffold-margin-bs6-ia.mjs
node scripts/patch-margin-sidebar.mjs
node scripts/build-margin-bs6-catalog.mjs
node scripts/build-margin-bs6-copy.mjs
\`\`\`

## Guardrails

- \`node scripts/check-merge-markers.mjs\` runs at the start of \`npm run build\` — never commit conflict markers.
- Run \`npm run test:margin-projects:a11y\` when touching \`margin.css\` or dashboard tokens.

## Copy blocks

Per-page markup is generated in \`margin-bs6-copy.ts\` from catalog demos and \`margin-bs6-prose.ts\`.

<MarginBs6Doc area="guides" slug="contribute" label="Contribute" />`,
  },
}

const gettingStarted = {
  introduction: `Margin docs follow [Bootstrap 6.0](https://getbootstrap.com/docs/6.0/) section names with the \`#6389ea\` accent and AA analytics palette. Interactive previews stay inside \`.lab\` so VitePress prose never leaks Lustro styles.

## What you get

- **Components** — live catalog with copyable HTML per component page
- **Forms / Content** — scoped demos mapped from BS6
- **Customize** — \`.lab\` token swatches
- **Patterns** — \`mg-*\` analytics modules on [/margin/analytics](/margin/analytics)

<MarginBs6Doc area="getting-started" slug="introduction" label="Introduction" />`,
  approach: `Margin keeps Bootstrap markup and layers design tokens:

1. **Bootstrap 6** — scoped via \`@scope (.b2-bs6)\` in \`batch2-bs6.bootstrap.css\`
2. **Lab tokens** — \`--bg\`, \`--surface\`, \`--ink\`, \`--line\`, \`--soft\`, accent \`#6389ea\`
3. **Dashboard** — \`.margin\` analytics shell on [/margin/analytics](/margin/analytics)

Do not fork component class names — adapt tokens and previews instead.

<MarginBs6Doc area="getting-started" slug="approach" label="Approach" />`,
  accessibility: `Pair color with text labels, keep focus visible, and respect \`prefers-reduced-motion\` (see \`margin-bs6.css\`).

<MarginBs6Doc area="getting-started" slug="accessibility" label="Focus example" />`,
  'browsers-devices': `Previews target evergreen desktop and mobile browsers supported by Bootstrap 6. Touch targets on analytics use 40px min height below 700px width in \`margin.css\`.

<MarginBs6Doc area="getting-started" slug="browsers-devices" label="Browsers and devices" />`,
  'css-variables': `Lab tokens map into \`--b2-*\` Bootstrap variables inside \`.b2-margin\`:

\`\`\`css
.lab {
  --bg: #f5f5f7;
  --surface: #fff;
  --ink: #22252b;
  --accent: #6389ea;
}
\`\`\`

<MarginBs6Doc area="getting-started" slug="css-variables" label="CSS variables" />`,
  javascript: `Use \`bootstrap.bundle.min.js\` behaviors (collapse, tooltips) only inside \`.margin-bs6-root\`. \`margin-bs6-live.ts\` initializes tooltips for catalog pages.

<MarginBs6Doc area="getting-started" slug="javascript" label="Collapse plugin" />`,
  ai: `When prompting agents:

- Cite concrete paths, e.g. \`/margin/components/button\`
- Require \`class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin"\` on examples
- Run a11y matrix after palette edits

<MarginBs6Doc area="getting-started" slug="ai" label="AI assistant tips" />`,
}

const customize = {
  overview: `See [Sass](/margin/customize/sass), [Color](/margin/customize/color), and [CSS variables](/margin/customize/css-variables) for token sources. Margin never replaces Bootstrap APIs — it scopes them under \`.lab\`.

<MarginBs6Doc area="customize" slug="overview" label="Overview" />`,
  sass: `Sass entry points live in the Bootstrap 6 build pipeline (\`scripts/build-batch2-bs6.mjs\`, \`scripts/build-margin-bs6-catalog.mjs\`). Commit generated CSS; do not hand-edit \`batch2-bs6.bootstrap.css\`.

<MarginBs6Doc area="customize" slug="sass" label="Sass" />`,
  'color-modes': `Use \`.lab-dark\` on the kit root or \`.margin.lab-dark\` on dashboards. Token pairs are documented on [Color](/margin/customize/color).

<MarginBs6Doc area="customize" slug="color-modes" label="Color modes" />`,
  theme: `Primary accent \`#6389ea\` with on-accent ink \`#0f1528\` for AA buttons.

<MarginBs6Doc area="customize" slug="theme" label="Theme" />`,
  components: `Component surfaces inherit \`--surface\`, \`--line\`, and accent from \`.lab\`. Catalog sections set \`kit-margin\` variables in \`margin-bs6.css\`.

<MarginBs6Doc area="customize" slug="components" label="Components" />`,
  'css-variables': `Expose lab tokens to Bootstrap:

\`\`\`css
.b2-margin { --b2-accent: #6389ea; --b2-on: #0f1528; }
\`\`\`

<MarginBs6Doc area="customize" slug="css-variables" label="CSS variables" />`,
  options: `Batch2 options tune radius, focus ring width, and motion under \`b2-margin\`.

<MarginBs6Doc area="customize" slug="options" label="Options" />`,
  optimize: `Production builds ship the full theme CSS; doc pages embed single catalog sections via \`MarginBs6Catalog embedded\`.

<MarginBs6Doc area="customize" slug="optimize" label="Optimize" />`,
  rtl: `Set \`dir="rtl"\` on a kit root; Bootstrap logical utilities mirror automatically.

<MarginBs6Doc area="customize" slug="rtl" label="RTL" />`,
  transitions: `Keep transitions tied to state changes; disable when \`prefers-reduced-motion: reduce\`.

<MarginBs6Doc area="customize" slug="transitions" label="Transitions" />`,
}

function md(title, area, slug, body, isIndex = false) {
  const s = slug === 'introduction' && isIndex ? 'introduction' : slug
  return `---
pageClass: margin-scoped-guide
---
<script setup>
import MarginBs6Doc from '../../.vitepress/theme/MarginBs6Doc.vue'
</script>

# ${title}

${body}
`
}

for (const [file, cfg] of Object.entries(pages)) {
  fs.writeFileSync(path.join(root, file), md(cfg.title, cfg.area, cfg.slug, cfg.body))
}

fs.writeFileSync(
  path.join(root, 'margin/getting-started/index.md'),
  md('Introduction', 'getting-started', 'introduction', gettingStarted.introduction, true),
)
for (const [slug, body] of Object.entries(gettingStarted)) {
  if (slug === 'introduction') continue
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  fs.writeFileSync(path.join(root, `margin/getting-started/${slug}.md`), md(title, 'getting-started', slug, body))
}

for (const [slug, body] of Object.entries(customize)) {
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  fs.writeFileSync(path.join(root, `margin/customize/${slug}.md`), md(title, 'customize', slug, body))
}

console.log('Scaffolded Margin prose docs')