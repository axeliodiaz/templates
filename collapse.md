---
pageClass: collapse-guide
---
<script setup>
import CollapseUsageDemo from './.vitepress/theme/CollapseUsageDemo.vue'
</script>

# Collapse

Collapse reveals a secondary block without leaving the page. Use it for delivery notes, optional explanations or supporting detail. Keep essential terms and errors visible. For several related heading sections, use an [accordion](/accordion). Collapse is not a modal: it does not trap focus or require Escape to close.

## Try triggers, direction and multiple targets

<CollapseUsageDemo />

Delivery and Returns start closed and toggle independently. Toggle both opens all if any are closed, otherwise closes all. Its expanded attribute is true only when both are open; a partial state is described by the visible status and individual triggers. Horizontal changes layout and entrance direction, not state. It wraps to fit narrow screens. Reset closes both and restores vertical. All content is fictitious and local.

## How to use it

1. Choose a meaningful native button or details/summary, not a styled span alone.
2. Give every target a stable ID. A button's aria-controls lists the IDs it changes; aria-expanded must follow the chosen open policy.
3. Keep closed content out of keyboard navigation. This guide uses hidden and keeps the DOM mounted. Do not override hidden with a display rule.
4. Keep focus on the trigger when toggling. If external state closes a panel containing focus, move focus to its controlling button before hiding it.
5. Keep long text readable. Horizontal reveal must not force the viewport wider or clip required content.
6. Remove decorative movement under reduced motion without delaying the final open state.

## Anatomy and actual API

`CollapseUsageDemo.vue` has no props or emits. `targets` contains `{ id, label, body }` for delivery and returns. `opened` starts as an empty string array. `direction` starts vertical. `toggle(id)` adds/removes one ID; `toggleBoth()` opens all unless every target is open; `reset()` restores defaults. Native buttons control labelled sections with hidden. No requests, storage, timers or listeners are used, so there is no unmount cleanup.

```vue
<script setup>
import CollapseUsageDemo from './.vitepress/theme/CollapseUsageDemo.vue'
</script>
<template><CollapseUsageDemo /></template>
```

Suggested host data is `{ targets: { id: string, label: string, content: string }[], openIds: string[], direction: 'vertical' | 'horizontal' }`. This is integration advice, not an installed component API. Generate instance-scoped IDs for multiple copies. Keep async data and unsaved values separate from visibility; validate target IDs when data changes.

## States and variants

| State | Behavior |
|---|---|
| Closed | hidden section, expanded false on its individual trigger. |
| Open | Mounted content visible, expanded true. |
| Partial multi-target | Only some open; Toggle both opens all. |
| Vertical | Stacked panels, 4px vertical entrance. |
| Horizontal | Wrapping side-by-side panels where space permits, 6px horizontal entrance. This is not animated width. |
| Loading/error/disabled | Not simulated. Add reachable feedback and recovery without hiding focused controls. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#collapse), [Components](/components#collapse), [Lustro guide](/lustro/guide-components#collapse) | Native details/summary for one delivery block, initially closed. No separate button controller or horizontal mode. |
| [Lustro expanded](/lustro/components-more#collapse), [Felix expanded](/felix/components-more#collapse), [Scopecraft expanded](/scopecraft/components-more#collapse) | Styled span triggers plus .cl block and native details. Shared bsx-live click enhancement toggles .cl.open; Toggle both synchronizes .cl and details using .cl as the source state. Styled spans are not equivalent to this guide's native keyboard buttons or expanded/controls relationships. |
| [Lumen expanded](/lumen/components-more#collapse) | Separate gallery implementation linked from the page. Its markup uses native buttons and details; do not infer this guide's state model from matching labels. |
| [Felix molecule](/felix/components/molecules#collapse) | Native details/summary initially open. Package prose names Collapse, CollapseTrigger, CollapseContent and open/onOpenChange from @felix/ui, but the preview does not prove installed exports. |

Horizontal and button-driven multiple targets are demonstrated here without claiming every catalog already exposes those variants. Source differences are intentional documentation, not silent fixes to existing specimens.

## Motion and accessibility

Open content fades and moves over 160ms; trigger background changes over 140ms. Reduced motion disables both. Layout reaches its final size immediately; there is no measured-height or width animation. Native Enter/Space toggles and Tab visits buttons in DOM order. No arrow-key navigation, focus trap, Escape dismissal or auto-focus is implemented or needed for this simple disclosure.

Test closed, each open, partial, both open and both closed; test reset, direction switch, keyboard activation, focus retention, target IDs, reduced motion, long content and narrow wrapping. Do not put essential form errors only inside a closed block. Sanitize external content and cancel stale loads when integrating server data.

<style>
@media(max-width:700px){.collapse-guide .vp-doc table,.collapse-guide .vp-doc tbody,.collapse-guide .vp-doc tr,.collapse-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.collapse-guide .vp-doc thead{display:none}.collapse-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.collapse-guide .vp-doc td{overflow-wrap:anywhere}.collapse-guide .vp-doc tr{margin-bottom:12px}}
</style>
