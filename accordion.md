---
pageClass: accordion-guide
---
<script setup>
import AccordionUsageDemo from './.vitepress/theme/AccordionUsageDemo.vue'
</script>

# Accordion

An accordion groups related sections under headings that expand and collapse. Use it for optional detail when scanning headings is useful. Keep required instructions and urgent errors visible. A single disclosure is usually simpler for one secondary block; use tabs when people switch between peer views rather than read expandable sections.

## Try single, multiple and flush

The sample opens Tokens initially. In single mode opening another section closes the previous one; the open section may also close so none remain. Multiple allows several open sections. Switching back to single keeps the first open ID only. Bordered and flush change appearance, not behavior. Reset restores single/bordered/Tokens. All content is fictitious and local; there is no fetch or save.

<AccordionUsageDemo />

## How to use it

1. **Keep meaningful headings.** A native button inside each heading is the control. A plus icon alone is not an accessible name.
2. **Choose the open policy.** Single, single-required and multiple are different contracts. This guide is single-collapsible or multiple, never single-required.
3. **Connect state and content.** aria-expanded lives on the trigger, aria-controls points to the panel ID, and hidden content is removed from normal interaction.
4. **Keep keyboard behavior honest.** Tab moves among native buttons; Enter/Space toggles. Arrow/Home/End shortcuts are not implemented here and are not required for this ordinary button sequence.
5. **Preserve focus.** Toggling leaves focus on the trigger. If a panel contains inputs, do not close it around active focus without a clear focus policy.
6. **Keep layout useful without motion.** Do not animate height in a way that clips long content. Reduced motion should preserve the final open state immediately.

## Anatomy and actual API

`AccordionUsageDemo.vue` has no props or emits. `items` contains `{ id, title, body }` for tokens/behavior/access. `mode` starts single, `variant` starts bordered, and `opened` is an array initially containing tokens. `toggle(id)` removes an open ID or adds it according to mode. `changeMode()` keeps only the first open ID when changing to single. Reset restores all defaults.

Each trigger has a stable guide-specific ID and points to its panel; each panel names its trigger and uses native hidden. There are no timers, listeners, server requests or persistence, so unmount needs no cleanup. Generate instance-scoped IDs before mounting multiple copies. This component does not expose an installed Accordion prop/event contract.

```vue
<script setup>
import AccordionUsageDemo from './.vitepress/theme/AccordionUsageDemo.vue'
</script>
<template><AccordionUsageDemo /></template>
```

A host model could be `{ items: { id: string, title: string, content: string }[], openIds: string[], mode: 'single' | 'multiple' }`. That is suggested integration data. Validate IDs, decide how removed/disabled items affect open state, and keep unsaved form data separate from visibility.

## States and variants

| State/variant | Meaning |
|---|---|
| Closed/open | Expanded attribute and hidden panel stay in sync. |
| Single collapsible | At most one open; zero is allowed. |
| Multiple | Several open IDs; each trigger toggles independently. |
| Bordered/flush | Outer boundary treatment only. |
| Loading/error/disabled | Not simulated. If adding them, keep labels/recovery reachable and do not collapse around focus. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Lustro UI kit](/ui-kit#accordion), [Components](/components#accordion), [Lustro guide](/lustro/guide-components#accordion) | Local single string toggles button aria-expanded and conditional paragraph content. This is not a universal installed Accordion API. |
| [Lustro expanded](/lustro/components-more#accordion), [Felix expanded](/felix/components-more#accordion), [Scopecraft expanded](/scopecraft/components-more#accordion) | Native details/summary specimens, including bordered and flush groups. Their markup has no shared name exclusivity attribute; do not infer the guide's single-open controller from the styling. |
| [Lumen expanded](/lumen/components-more#accordion) | Live specimens are in the gallery iframe, separate from this guide's state. |
| [Felix molecule](/felix/components/molecules#accordion) | Native details/summary with a data-fx accordion enhancer that closes sibling details when one opens. First sample starts open. Package prose names single/collapsible usage, not verified installed exports. |
| Studio catalogs | Catalog uses independent details/summary sections, so multiple may be open. Do not infer exclusive state from the heading Accordion. |
| [Bastion accordion](/bastion/components#accordion) | Native details bound to a local openItem with toggle handler. Review toggle-event ordering when adapting this controlled-details pattern; it is separate from this guide's button array controller. |
| [Pulsefit HTML](/pulsefit-template/components.html#accordion) | Native details specimens. A class or section name alone does not establish exclusive single-open behavior. |

Felix prose names Accordion, AccordionItem, AccordionTrigger and AccordionContent from `@felix/ui`. The repository preview is local DOM and enhancement code. Do not copy those names as proof of package exports or assume all catalogs share its options.

## Motion and accessibility

The guide fades/translates open content by 3px over 160ms and changes trigger background over 150ms. Reduced motion removes both. It does not animate height or delay expanded state. Trigger icons are decorative; button text names each section. Panels do not need a region landmark for every small paragraph, so this guide avoids landmark noise.

Test initial state, all-close, exclusive opening, multiple opening, switching policy, reset, Enter/Space, focus retention, expanded/controls/hidden relationships and narrow text wrapping. Test target assistive technology when adding rich panel content. A visual accordion alone does not provide accessible keyboard or focus behavior.

## Integration notes

Keep data, visibility and async loading separate. Cancel stale loads or ignore responses for removed items. Preserve form values independently of mounting policy and sanitize external content. Do not hide mandatory terms or errors where users must discover them. All content here is fictitious and local.

<style>
@media(max-width:700px){.accordion-guide .vp-doc table,.accordion-guide .vp-doc tbody,.accordion-guide .vp-doc tr,.accordion-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.accordion-guide .vp-doc thead{display:none}.accordion-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.accordion-guide .vp-doc td{overflow-wrap:anywhere}.accordion-guide .vp-doc tr{margin-bottom:12px}}
</style>
