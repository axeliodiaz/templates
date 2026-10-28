---
pageClass: badge-guide
---
<script setup>
import BadgeUsageDemo from './.vitepress/theme/BadgeUsageDemo.vue'
</script>

# Badge

A badge is a short, read-only label for status, metadata or a count. It helps scan a list without replacing the label or explanation that makes the information useful. A badge is not a button: if the user can act on it, build a named button or link instead.

## Try the states and counts

Change the sample status, add a fictitious unread item or clear the count. Inbox owns the action; its count is supporting text. The positioned "99+" count illustrates overflow, while Online repeats its dot's meaning in words. Nothing connects to a real inbox or changes stored data.

<BadgeUsageDemo />

## How to use it

1. **Choose the information.** A state such as Blocked or a count such as 4 should add useful context to the adjacent item. Avoid redundant badges on every row.
2. **Write the meaning.** Pair a status dot with a word. Color repeats Ready or Blocked; it must not be the only way to tell them apart.
3. **Keep it short.** Use a compact label and a stable position. Longer explanation belongs in helper text, a detail panel or an alert.
4. **Choose count behavior.** Decide what zero means, whether to cap a large count, and whether the count is total or unread. A visual `99+` should not be presented as an exact total.
5. **Keep the containing action semantic.** An Inbox button can include a badge. Do not put a second button inside it or give the decorative badge its own Tab stop.
6. **Announce changes with restraint.** Use a nearby status region for a user-triggered change. Do not turn every badge in a live-updating table into a competing live region.

## Anatomy

| Part | Purpose |
|---|---|
| Text label / count | Carries the actual meaning, including the count's unit/context. |
| Surface and border | Distinguish the label from surrounding text without competing with the main action. |
| Optional dot or icon | Reinforces state; hide it from assistive technology when redundant. |
| Parent item / control | Provides context such as the record name or Inbox action. |
| Optional positioned container | Anchors the count without clipping it or covering important text. |

## Data shape

The live guide component is `BadgeUsageDemo.vue`, with no props or emits. It uses these local refs:

```ts
// status: string = 'Draft'
// count: number = 4
// message: string = 'Fictitious sample. No external activity.'
const states = ['Draft', 'Ready', 'Running', 'Blocked']
// tone('Ready') -> 'l-badge-success'
// tone('Running') -> 'l-badge-warn'
// tone('Blocked') -> 'l-badge-error'
// tone('Draft') -> ''
```

The native select updates status. Add sample item increments count; Clear sets it to zero. Both only update a local status message. The fixed positioned `99+` is a separate specimen, not the changing unread count. No timers, persistence or network calls exist.

For an application, keep domain state distinct from visual tone:

```ts
type BadgeSpec = {
  label: string
  tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  shape?: 'pill' | 'square'
  count?: number
  countMeaning?: 'unread' | 'total'
  cap?: number // display policy, not a data mutation
}
```

This is an integration model, not a prop contract shared by every catalog. Never infer that a red badge means a failed payment or that Ready means approved unless the underlying domain state establishes it.

## Usage

### Static status in Lustro

```html
<span class="l-badge">Draft</span>
<span class="l-badge l-badge-success">Ready</span>
<span class="l-badge l-badge-warn">Running</span>
<span class="l-badge l-badge-error">Blocked</span>
```

These are non-interactive spans using existing Lustro styles. They need no role, click handler or tabindex.

### Count in a button

```html
<button type="button" class="l-btn l-secondary"
  aria-label="Inbox, 4 unread messages">
  Inbox <span class="l-badge" aria-hidden="true">4</span>
</button>
```

Update the accessible label alongside the count. The guide instead includes visually hidden descriptive text inside the button, avoiding duplicate announcements of its decorative visual count. A real application should connect the containing button to navigation or the relevant panel.

## States and variants

- **Neutral and semantic tones:** use neutral metadata, success, warning, danger or info only when the state warrants it. Explain critical problems outside a tiny badge too.
- **Pill and square:** visual variants, not different semantics. Follow the template's radius and typography.
- **Dot:** pair with text such as Online. A decorative dot is hidden from assistive technology; avoid an unlabeled color-only state.
- **In a button:** the parent owns focus and action. Counts and small labels should not obscure its verb or reduce its touch area.
- **Positioned count:** anchor to a relatively positioned parent, leave space and allow the badge to remain visible. Test overflow, zoom, translated labels and adjacent controls.
- **Zero:** the guide displays zero explicitly. If the product hides zero, keep the parent label understandable; do not announce "unread" when the value means total.
- **Large or unknown count:** cap visually if needed, with text such as "99 or more". Show an unknown state rather than silently treating missing data as zero.
- **Interactive/removable:** this is an action chip/tag pattern, not a static badge. Use native controls with clear removal names and focus behavior.
- **Hover/focus/loading:** static badges do not require button hover or focus states. Loading belongs to the region fetching their data, not a fake disabled badge.

## Template map

| Template / surface | Source and actual styles |
|---|---|
| Lustro | [UI kit](/ui-kit#badge), [components](/components#badge), [guide](/lustro/guide-components#badge): native spans with `l-badge` and success/warn/error modifiers. |
| Lustro expanded | [Variants](/lustro/components-more#badges-variants), [shapes/dot/in-button](/lustro/components-more#badges-pill-square-dot-and-in-buttons), [positioned](/lustro/components-more#badges-positioned-on-a-button): BSX `badge` with semantic, outline, square and positioned specimens. |
| Felix | [Atoms](/felix/components/atoms#badge): `fx-badge`, secondary/destructive/ghost/outline/slate modifiers. [Expanded variants](/felix/components-more#badges-variants) use the separately scoped BSX system; do not mix those class families. `@felix/ui` references describe a design source, not an installed package here. |
| Lumen | [Expanded badge sections](/lumen/components-more#badges-variants) link to the bundled Bootstrap gallery. Use that gallery's scoped native markup. |
| Scopecraft | [Expanded badges](/scopecraft/components-more#badges-variants), including shapes, dot, in-button and positioned specimens. Legacy BSX buttons may be styled spans, not actionable controls. |
| Pawprint | [Buttons and badges](/pawprint/components#buttons-and-badges): `pp-badge` with ok/info/warn/bad modifiers and supporting icons. |
| Relay | [Catalog](/relay/components): `sk-badge` plus lowercase neutral/success/warning/danger/info and outline modifiers, inside the Studio wrapper. |
| Folio | [Catalog](/folio/components): Studio badge structure under Folio tokens. |
| Pace | [Catalog](/pace/components): Studio badge structure under Pace tokens. |
| Spark | [Catalog](/spark/components): Studio badge structure under Spark tokens. |
| Bastion | [Badges](/bastion/components#badges): `badge`, optional `badge-outline`, and `theme-success`, `theme-warning` or `theme-danger`. Every specimen includes a word. |
| PulseFit | [Standalone badges](/pulsefit-template/components.html#badges): bundled gallery variants and placement examples; keep its own scoped styles. |

## Motion and accessibility

The guide transitions background color for 120ms and removes that transition with reduced motion. No pulse or movement is needed to understand a status. Counts and labels remain readable when animation is disabled.

Static badges are not focusable. Use text rather than color alone; ensure legible type and contrast in both appearances. Do not use `role="status"` on every static badge. Announce a relevant change once, through a deliberate status region, and avoid duplicate accessible counts inside a named button. Preserve the parent's focus outline and do not let positioned content cover another control.

## Integration notes

Import `BadgeUsageDemo.vue` for the exact guide example; it uses existing Lustro classes plus scoped demo-only shape/position styles. Other templates use the wrappers and modifier families above. There is no universal Badge export or identical props API in this repository.

Render text safely rather than inserting HTML from status or user labels. Validate count/state data at the application boundary. The guide only demonstrates presentation and local state; real data fetching, error handling and updates belong to the consuming application. All sample data is fictitious.

<style>
.badge-guide .vp-doc table { width:100%; table-layout:fixed }
.badge-guide .vp-doc td, .badge-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .badge-guide .vp-doc table, .badge-guide .vp-doc tbody, .badge-guide .vp-doc tr, .badge-guide .vp-doc td { display:block; width:100% }
  .badge-guide .vp-doc thead { display:none }
  .badge-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .badge-guide .vp-doc td { border:0 }
  .badge-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .badge-guide .vp-doc td + td { padding-top:4px }
}
</style>
