/** Shared tokens + generators for Margin agent instruction markdown. */

export const LAB_LIGHT = {
  '--bg': '#f5f5f7',
  '--surface': '#fff',
  '--ink': '#22252b',
  '--muted': '#676e7b',
  '--line': '#e0e3e9',
  '--soft': '#eceef5',
  '--accent': '#6389ea',
}

export const LAB_DARK = {
  '--bg': '#181b22',
  '--surface': '#242833',
  '--ink': '#f1f3f8',
  '--muted': '#aab3c3',
  '--line': '#404757',
  '--soft': '#303747',
  '--accent': '#6389ea',
}

export const B2_MARGIN = {
  '--b2-accent': '#6389ea',
  '--b2-on': '#0f1528',
}

export function tokenSection() {
  return `## Tokens / CSS variables

Scoped preview shell (light):

\`\`\`css
.lab.b2-bs6.b2-margin {
  --bg: ${LAB_LIGHT['--bg']};
  --surface: ${LAB_LIGHT['--surface']};
  --ink: ${LAB_LIGHT['--ink']};
  --muted: ${LAB_LIGHT['--muted']};
  --line: ${LAB_LIGHT['--line']};
  --soft: ${LAB_LIGHT['--soft']};
  --b2-accent: ${B2_MARGIN['--b2-accent']};
  --b2-on: ${B2_MARGIN['--b2-on']};
}
\`\`\`

Dark preview (\`.lab-dark\` on root + \`.mg-guide-preview.lab-dark\`):

\`\`\`css
--bg: ${LAB_DARK['--bg']};
--surface: ${LAB_DARK['--surface']};
--ink: ${LAB_DARK['--ink']};
--muted: ${LAB_DARK['--muted']};
--line: ${LAB_DARK['--line']};
--soft: ${LAB_DARK['--soft']};
\`\`\`

Focus ring (Margin guides): \`outline: 2px solid #6389ea; outline-offset: 3px\`.`
}

export function motionSection(extra = '') {
  return `## Motion

Preview chrome crossfade: \`0.25s ease\` on \`background-color\`, \`color\`, \`border-color\` when \`.mg-guide-motion\` is active (after first paint).

${extra}

\`@media (prefers-reduced-motion: reduce)\`: transitions/animations inside \`.margin-bs6-root\` are disabled (\`margin-bs6.css\`). Preview panel collapse uses \`0.25s ease\` unless reduced motion is set.`
}

export function a11ySection(role = 'region') {
  return `## Accessibility

- Expose meaningful names on controls; do not rely on color alone.
- \`:focus-visible\`: 2px \`#6389ea\` outline, 3px offset (Margin convention).
- Pair preview chrome with light/dark toggle to verify contrast on \`--ink\` / \`--surface\`.
- Keyboard: Tab order follows DOM; interactive demos use native buttons/links with visible focus.`
}

export function verifySection(items) {
  return `## Verification checklist

${items.map((i) => `- [ ] ${i}`).join('\n')}`
}

/** @type {Record<string, (ctx: {title:string, area:string, slug:string}) => string>} */
export const OVERRIDES = {
  'getting-started/css-variables': () => `# CSS variables (redirect)

## Goal

The Getting started **CSS variables** doc was consolidated into **Customize → CSS variables**. Do not implement a separate page at \`/margin/getting-started/css-variables\`.

## Canonical references

- Doc: \`https://templates.axeldiaz.com/margin/customize/css-variables\`
- Agent instructions: \`/margin/agents/customize/css-variables.md\`

Old URLs should redirect to the Customize page (Vercel \`308\` and client router fallback on the stub).

## Verification checklist

- [ ] Sidebar lists **CSS variables** only under Customize
- [ ] \`/margin/getting-started/css-variables\` lands on Customize
- [ ] Agents use the customize agent markdown only`,
  'components/accordion': () => `# Accordion — agent instructions

## Goal

Replicate the Margin BS6 accordion demo: one expandable panel at a time, ~300ms height animation, chevron rotation, plus an always-open example row.

## Tokens / CSS variables

${tokenSection()}

Panel animation uses \`.mg-accordion-panel\` grid (\`grid-template-rows: 0fr → 1fr\`, \`0.3s ease\`) and \`.mg-accordion-chevron\` (\`transform 0.3s ease\`, \`rotate(180deg)\` when \`.is-open\`).

## Required markup

\`\`\`html
<div class="l-accordion border-bottom">
  <button type="button" class="w-100" aria-expanded="false">
    Tokens <span class="mg-accordion-chevron" aria-hidden="true">⌄</span>
  </button>
  <div class="mg-accordion-panel">
    <div class="mg-accordion-panel-inner"><p>…</p></div>
  </div>
</div>
\`\`\`

Add \`is-open\` on \`.mg-accordion-panel\` and chevron when expanded; set \`aria-expanded\` on the button.

## Variants

- Single-open (Vue state \`accordion\` string).
- Always-open row: \`.mg-accordion-panel.is-open\` without a toggle.

## States

- \`:hover\` on button: inherited from \`.l-accordion button\` (transparent background).
- \`:focus-visible\`: Margin focus ring.
- Disabled: not used on demo headers.

## Responsive / mobile

Full-width buttons (\`w-100\`); padding \`12px 2px\` on headers. Works at 390px without horizontal scroll.

${motionSection('Accordion panel: `0.3s ease` height (`margin-motion.css`). Collapse utilities elsewhere: BS6 `0.3s` / `0.35s` on `.collapse`.')}

${a11ySection()}

## Do

- Keep one panel open at a time unless demonstrating always-open.
- Animate height with grid rows; keep \`overflow: hidden\` on inner wrapper.

## Don't

- Use \`v-if\` for panel body (instant unmount breaks height transition).
- Remove \`aria-expanded\` on headers.

${verifySection([
    'Chevron rotates when open',
    'Only one panel open in default demo',
    'Always-open row stays expanded',
    'Readable in light + dark preview',
    'Reduced motion: instant open/close',
  ])}`,

  'customize/color': () => `# Color — agent instructions

## Goal

Document Margin \`.lab\` color tokens used in customize swatches and BS6 previews; accent \`#6389ea\` with AA contrast pairs.

## Tokens / CSS variables

Light \`.lab\` (canonical on this page):

| Token | Value |
|-------|-------|
| \`--bg\` | \`${LAB_LIGHT['--bg']}\` |
| \`--surface\` | \`${LAB_LIGHT['--surface']}\` |
| \`--ink\` | \`${LAB_LIGHT['--ink']}\` |
| \`--muted\` | \`${LAB_LIGHT['--muted']}\` |
| \`--line\` | \`${LAB_LIGHT['--line']}\` |
| \`--soft\` | \`${LAB_LIGHT['--soft']}\` |
| \`--accent\` | \`${LAB_LIGHT['--accent']}\` |

Dark \`.lab-dark\`:

| Token | Value |
|-------|-------|
| \`--bg\` | \`${LAB_DARK['--bg']}\` |
| \`--surface\` | \`${LAB_DARK['--surface']}\` |
| \`--ink\` | \`${LAB_DARK['--ink']}\` |
| \`--muted\` | \`${LAB_DARK['--muted']}\` |
| \`--line\` | \`${LAB_DARK['--line']}\` |
| \`--soft\` | \`${LAB_DARK['--soft']}\` |

Primary solid buttons use \`--b2-accent\` / \`--b2-on\` (\`#6389ea\` / \`#0f1528\`).

## Required markup

\`\`\`html
<div class="lab b2-bs6 b2-margin margin-bs6-root">
  <!-- swatches use .mg-swatch with --mg-swatch-fg / --mg-swatch-muted -->
</div>
\`\`\`

## Variants

- Light preview (default): \`.mg-guide-preview\` without \`.lab-dark\`.
- Dark preview: \`.mg-guide-preview.lab-dark\` + optional \`.lab-dark\` on BS6 root.

## States

- Swatch hover: border follows \`--line\`.
- Focus on toggle: \`#6389ea\` ring.

## Responsive / mobile

Swatch grid wraps; 390px: single column in \`.mg-swatch-grid\`.

${motionSection('Swatches: no required motion. Preview toggle: 0.25s crossfade.')}

${a11ySection()}

## Do

- Use token variables; never hard-code random grays in Margin docs.
- Test swatch text on \`--surface\` in both previews.

## Don't

- Invent new accent hues per component page.

${verifySection([
    'Swatches readable light + dark',
    'Accent #6389ea on primary actions',
    'Dark preview updates --surface/--ink',
  ])}`,
}

export function defaultInstruction({ title, area, slug, markup = '', notes = '' }) {
  const heading = title || slug
  return `# ${heading} — agent instructions

## Goal

Replicate the **${heading}** section on \`templates.axeldiaz.com/margin/${area}/${slug}\` using Margin scoped BS6 (\`.lab.b2-bs6.b2-margin\`) and the live preview on that page.

## Tokens / CSS variables

${tokenSection()}

## Required markup

${markup ? `\`\`\`html\n${markup}\n\`\`\`` : '_See the on-page preview and “Copy … markup” details block on the doc._'}

## Variants

See the doc preview and BS6 catalog section \`${slug}\` when \`area === 'components'\`.

## States

- Hover/focus/active: follow Bootstrap 6 \`theme-*\` utilities in the scoped preview.
- Dark mode: toggle **Dark preview** on the guide chrome (\`.mg-guide-preview.lab-dark\`).

## Responsive / mobile

Previews use \`.mg-guide-frame\` padding \`18px\`; demos use Bootstrap responsive utilities where shown on the page.

${motionSection(notes)}

${a11ySection()}

## Do

- Scope CSS under \`.margin-bs6-root\` / \`.mg-guide-preview\`.
- Match classes exactly from the copy block when present.

## Don't

- Import global Bootstrap CSS onto the VitePress shell.
- Drop Margin focus or contrast tokens.

${verifySection([
    'Matches live preview in light mode',
    'Matches live preview with Dark preview enabled',
    'Keyboard focus visible',
    '390px layout has no horizontal overflow in preview',
  ])}`
}