---
pageClass: scrollspy-guide
---
<script setup>
import ScrollspyUsageDemo from './.vitepress/theme/ScrollspyUsageDemo.vue'
</script>

# Scrollspy

Scrollspy marks the section currently visible in a scrolling document. It helps orientation in long reference pages. It is not a tab switcher, a completion tracker or proof someone read the content. Keep all sections available and let ordinary scrolling update the indicator.

## Try actual section tracking

<ScrollspyUsageDemo />

The inner document is a 300px scrolling region. Introduction, Details and Summary stay mounted in order. Buttons scroll that region; they do not set active state directly. IntersectionObserver updates active to the section with the largest observed visible fraction; ties favor document order. Thresholds are 0, 25%, 50%, 75% and 100%, so the indicator changes at observed visibility crossings rather than every pixel. All content is fictitious and local.

## How to use it

1. Define the actual scroll root. This example observes the inner panel, not the browser viewport. A page-level implementation needs a different root and header offsets.
2. Give sections stable IDs and meaningful headings. Navigation controls identify their target with aria-controls and expose the active location with aria-current=location.
3. Choose a deterministic active rule when several sections are visible. This guide compares observed fractions and breaks ties by document order.
4. Keep keyboard scrolling available. The named region is focusable; native arrow/PageDown behavior can scroll it. Buttons remain normal Tab/Enter/Space controls.
5. Respect reduced motion for programmatic navigation. Smooth scrolling becomes immediate under the preference. Tracking remains active.
6. Disconnect observers when leaving. Rebuild observation for newly added/removed sections in a dynamic host; this guide's fixed sections do not change.

## Anatomy and actual API

`ScrollspyUsageDemo.vue` has no props or emits. `sections` contains `{ id, title, body }`; active starts intro. `root` is the scroll container. On mount, an IntersectionObserver records intersection ratios in a Map for each fixed section. The callback chooses the highest observed fraction if one is visible. `choose(id)` finds the target and scrolls the root to its offsetTop, using the current reduced-motion preference. Unmount disconnects the observer and clears the Map.

```vue
<script setup>
import ScrollspyUsageDemo from './.vitepress/theme/ScrollspyUsageDemo.vue'
</script>
<template><ScrollspyUsageDemo /></template>
```

No network, storage, timers or global key listeners exist. If IntersectionObserver is absent, a visible message explains that automatic tracking is unavailable; buttons still scroll but do not pretend to track a new active section. IDs are guide-specific and must be instance-scoped for repeated mounts. Suggested host data is `{ sections: { id, title }[], scrollRoot, headerOffset, activeId }`, not an installed Scrollspy API.

## States and limits

| State | Actual behavior |
|---|---|
| Initial | Introduction selected until observation reports visible sections. |
| Manual scroll | Observer changes active location at visibility thresholds. |
| Button navigation | Scrolls the inner root; observer, not click state, sets active. |
| Several visible | Largest observed fraction wins; document order breaks ties. |
| Reduced motion | Immediate button scrolling and no button color transition. |
| Unsupported observer | Explanatory message, scroll buttons still work, no fake tracking. |
| Dynamic content | Not simulated. Host must observe new targets, handle removals and re-evaluate offsets. |

The visible active label is ordinary text, not a live region announcing every scroll update. No history fragment, route, focus jump or form state changes occur. Essential information is not hidden behind navigation.

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#scrollspy), [Components](/components#scrollspy), [Lustro guide](/lustro/guide-components#scrollspy) | Existing specimens set menuSection on button click and render its local text. They explicitly describe this as section selection, not automatic scroll tracking, and suggest IntersectionObserver for production. |

This guide demonstrates that observer model without claiming the catalogs already observe scrolling. A highlighted button alone is not scrollspy, and a recommendation to use IntersectionObserver is not a verified backend or installed package contract.

## Motion, accessibility and integration

Programmatic scrolling is smooth unless reduced motion is requested. Button background changes over 140ms; reduced motion removes that transition. There is no animated progress line, auto-scroll timer, scroll trap or focus trap. Buttons do not move focus into headings. The region's native focus ring and label make keyboard scrolling discoverable.

Test button navigation, actual manual scrolling, active/current state, multiple visible sections, native keyboard region scrolling, reduced motion, narrow wrapping and observer cleanup. For long or nested layouts, test sticky header offsets, short last sections, resizing and async content separately. Never mark a document read or a task done solely because its section became visible.

<style>
@media(max-width:700px){.scrollspy-guide .vp-doc table,.scrollspy-guide .vp-doc tbody,.scrollspy-guide .vp-doc tr,.scrollspy-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.scrollspy-guide .vp-doc thead{display:none}.scrollspy-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.scrollspy-guide .vp-doc td{overflow-wrap:anywhere}.scrollspy-guide .vp-doc tr{margin-bottom:12px}}
</style>
