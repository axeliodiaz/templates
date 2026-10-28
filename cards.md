---
pageClass: card-guide
---
<script setup>
import CardUsageDemo from './.vitepress/theme/CardUsageDemo.vue'
</script>

# Card

A card groups a summary and its related actions into one surface. Use it when the item has a clear identity: a project, pet profile, report or product. For dense comparable rows, a table or list is usually easier to scan. A border alone does not make unrelated content a card.

## Try a summary and selected state

Open sample details changes only the local result text. Select sample toggles an explicit button's pressed state and the highlighted card's border. Neither entire card is clickable; text remains selectable and controls keep their native semantics. All data is fictitious.

<CardUsageDemo />

## How to use it

1. **Choose one subject.** Put its title first, with enough metadata to distinguish it from neighboring cards. Do not mix separate records inside one surface.
2. **Summarize, do not duplicate the detail page.** Keep the few fields needed to decide whether to open it. Put long descriptions and complete activity history in detail views.
3. **Separate hierarchy.** Header identifies the item, body explains it, footer holds related metadata and actions. Do not add all three regions when a simple title and paragraph are enough.
4. **Choose action semantics.** Use a link to navigate and a button to perform an action. Avoid wrapping an entire card in a link when it contains nested buttons or links.
5. **Lay out content, not fixed screenshots.** Let text wrap, keep cards aligned without fixed content heights, and stack horizontal layouts when they no longer fit.
6. **Define state explicitly.** A selectable card needs a real checkbox, radio or toggle button and a programmatic state; a colored border alone is not selection semantics.

## Anatomy

| Part | Purpose |
|---|---|
| Container | Groups one item, with the theme's surface, border and spacing. |
| Header / title | Names the item and sets its place in the page's heading hierarchy. |
| Metadata or status | Distinguishes the item and helps scanning without replacing the title. |
| Optional media | Gives useful visual information; include fitting alternative text or mark decorative media accordingly. |
| Body | Contains the compact explanation or key data. |
| Footer / actions | Provides a clear next action without making every pixel interactive. |
| Optional selection control | Owns selection, focus and accessible state. |

## Data shape

`CardUsageDemo.vue` has no props or emitted events. Its `selected: boolean` ref starts false and `message: string` starts with the ready text. Open sample details updates message. Select sample inverts selected, changes the border and sets `aria-pressed` on that button. There is no fetch, save, route, image loader or persistence.

A consuming application can model its records independently:

```ts
type CardSummary = {
  id: string
  title: string
  eyebrow?: string
  description: string
  status?: { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' }
  media?: { src: string; alt: string }
  detailHref?: string
  action?: { label: string; run: () => void | Promise<void> }
}
```

This is an application data model, not a shared Card prop API across catalogs. Keep selected IDs separately from records if selection belongs to the view.

## Usage

### Native Lustro card

```html
<article class="l-card">
  <span class="l-eyebrow">PROJECT · SAMPLE-024</span>
  <h3>Review design tokens</h3>
  <p>Compare the spacing and focus states.</p>
  <div class="l-card-foot">
    <span class="l-badge l-badge-warn">Needs review</span>
    <a href="/components#card">View component example</a>
  </div>
</article>
```

The heading level must fit the consuming page; h3 is not a universal requirement. This example uses a real repository URL rather than a dead `href="#"`. A product should substitute its own resolved detail route.

### Responsive card group

```html
<div class="summary-grid">
  <!-- Repeat independent article elements, each with a unique title. -->
</div>
<style>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
}
</style>
```

Do not use CSS order to create a different visual reading order from the DOM. Keep the grid meaningful when it becomes a single column. For a list of cards, a semantic list may be more appropriate than unrelated divs.

## States and listed variants

- **Basic:** a clear title and short description may be enough. Avoid an empty header or footer solely to match a template.
- **Header/footer:** separate identity, content and next action. Keep borders and padding consistent and avoid duplicate action labels without context.
- **With image:** reserve an aspect ratio to avoid layout shift; use a real useful image and appropriate alternative text. Do not assume every image needs a caption or repeat its alt as visible copy. This guide demo has no image and does not simulate image loading.
- **Horizontal:** media beside text works when both fit; stack on narrow screens. Preserve reading order and do not crop critical text into an image.
- **Highlighted:** border, background or a label can emphasize a featured item. State why it is highlighted; do not rely on color alone for an actual selection.
- **List/grid groups:** consistent spacing and item structure help comparison. A group is a layout, not automatic carousel, pagination or keyboard-grid behavior.
- **Selected:** use an explicit native control and programmatic state. The guide uses a pressed button; form selections should use checkbox/radio inputs.
- **Hover/focus:** only interactive children need focus. Avoid `tabindex="0"` on a static article just to animate it.
- **Loading/empty/error:** reserve useful structure, explain the state and provide a recovery action where needed. Do not leave a permanent skeleton or present a zero KPI as unknown data.

## Template map

| Template / surface | Source and implementation |
|---|---|
| Lustro | [UI kit](/ui-kit#card), [components](/components#card), [guide](/lustro/guide-components#card): `l-card`, eyebrow, body and `l-card-foot` with separate actions. |
| Lustro expanded | [Basic/header/footer](/lustro/components-more#cards-basic-header-and-footer), [image/horizontal/highlighted](/lustro/components-more#cards-with-image-horizontal-and-highlighted), [list/grid groups](/lustro/components-more#cards-list-and-grid-groups): visual BSX specimens. |
| Felix | [Molecules](/felix/components/molecules#card): `fx-card` and `fx-card-title`, amount and action. [Expanded cards](/felix/components-more#cards-basic-header-and-footer) cover layout variants. Do not confuse Card with the separate ChoiceCard or HoverCard patterns. |
| Lumen | [Expanded cards](/lumen/components-more#cards-basic-header-and-footer) link to the scoped Bootstrap gallery. |
| Scopecraft | [Expanded cards](/scopecraft/components-more#cards-basic-header-and-footer), including horizontal, highlighted and group layouts. |
| Pawprint | [Pet profile/cards](/pawprint/components#pet-profile-and-cards): `pp-card` containing pet identity and care status; other card surfaces hold forms and care history. |
| Relay | [Catalog](/relay/components): Studio `sk-card` / `sk-card-title`, summary amount and footer action under Relay tokens. |
| Folio | [Catalog](/folio/components): Studio card structure with Folio tokens and financial sample content. |
| Pace | [Catalog](/pace/components): Studio summary card with booking-oriented sample data and Pace styling. |
| Spark | [Catalog](/spark/components): Studio card structure under Spark tokens. |
| Bastion | [Cards](/bastion/components#cards): Bootstrap alpha `card`, `card-header`, `card-body` and scoped button classes. |
| PulseFit | [Standalone cards](/pulsefit-template/components.html#cards): bundled gallery variants, retaining its own styles and markup. |

Card/KPI catalog examples are included here for their container anatomy. KPI meaning, number formatting and trends belong to their own documentation task; this guide does not claim those have been implemented or verified as real data.

## Motion and accessibility

The selected demo card changes border color over 140ms; reduced motion removes that transition. Selection remains visible through the button's pressed state and a named result. There is no automatic movement, lift or card reordering.

Use meaningful headings and text, keep nested controls separate and preserve a logical Tab order. A static card is not a button, landmark or live region by default. Do not nest links or buttons inside an all-card link. Important status must include words and not depend on a border or image alone. Check focus outlines, long labels, zoom and narrow layouts in the actual app.

## Integration notes

Import `CardUsageDemo.vue` for this local example. It uses the existing Lustro card/button/badge classes, with scoped layout and selection styling. Other catalogs use the distinct namespaces and wrappers above, not a single installed Card package. Image, grid and horizontal variants are documented through existing specimens, not invented component props.

Render untrusted title/description strings safely as text, resolve routes from actual records and check authorization before actions. The application owns data loading, error handling, navigation and persistence. No guide action changes real data.

<style>
.card-guide .vp-doc table { width:100%; table-layout:fixed }
.card-guide .vp-doc td, .card-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .card-guide .vp-doc table, .card-guide .vp-doc tbody, .card-guide .vp-doc tr, .card-guide .vp-doc td { display:block; width:100% }
  .card-guide .vp-doc thead { display:none }
  .card-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .card-guide .vp-doc td { border:0 }
  .card-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .card-guide .vp-doc td + td { padding-top:4px }
}
</style>
