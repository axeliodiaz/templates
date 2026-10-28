---
pageClass: tooltip-guide
---
<script setup>
import TooltipUsageDemo from './.vitepress/theme/TooltipUsageDemo.vue'
</script>

# Tooltips

A tooltip is short, optional text associated with a control. It does not contain buttons, links or fields. Use a popover for interactive detail, visible help for required instructions, and a visible label for the control's name. A tooltip must never be the only way to learn a price, error or consequence.

## Try hover, focus and Escape

Choose a preferred placement, then hover or Tab to Sample workspace help. The tooltip stays open while the trigger has focus or the pointer is over the trigger or tooltip. Escape hides it without moving focus. It stays dismissed until both pointer and focus leave, then a new visit can open it. Moving across the small gap has a 120ms grace period. The button does not perform an action. Touch users can expand the visible optional-help disclosure instead.

<TooltipUsageDemo />

## How to use it

1. **Name the control first.** Keep its accessible name useful without the tooltip. Associate optional text with aria-describedby, not aria-label replacing its name.
2. **Support focus and hover.** Keyboard users must receive the same help. Tooltip content is not a Tab stop; focus stays on the trigger.
3. **Keep content reachable.** Allow the pointer to enter the tooltip, and keep it present while either trigger focus or pointer presence needs it.
4. **Dismiss without movement.** Escape should hide help without moving focus or activating the control. Avoid reopening immediately while the same hover/focus remains.
5. **Use placement as a preference.** Check viewport and scroll containers. Flip or clamp instead of clipping; do not mistake CSS arrow direction for an actual positioning engine.
6. **Offer a touch path.** Required help stays visible. Optional help can have a separate disclosure. Do not depend on a long press or a browser-specific synthesized hover.

## Anatomy

| Part | Purpose |
|---|---|
| Trigger | Native button with its own readable name. |
| Description | Short plain text, role=tooltip and a unique ID. |
| Relationship | Trigger aria-describedby points to visible help. |
| Placement | Preferred top/bottom/start/end, then viewport fallback. |
| Optional disclosure | Separate native details for users without hover. |

## Actual data and API

`TooltipUsageDemo.vue` has no props or emits. `placement` starts at `'top'`; the select offers `'top'`, `'bottom'`, `'start'` and `'end'`. Start/end are physical left/right in this LTR demo, not an RTL-aware library contract. `hovered`, `focused` and `dismissed` derive `open`. `actual` records the chosen side; `position` holds fixed left/top pixels. `trigger` and `tip` are element refs.

`enter()` cancels the exit timer; `leave()` starts its 120ms grace. `focus()` opens, `blur()` releases focus, and `reset()` clears dismissal only when both inputs are inactive. A window key handler sets dismissal on Escape. `locate()` measures after Vue updates, tries the opposite side if the preferred side does not fit, moves a horizontal tooltip above/below when neither side fits, then clamps to a 12px viewport margin. It runs on opening, placement change, resize and capture-phase scroll. Unmount clears the timer and all window listeners. No server, storage, tracking or workspace mutation is involved.

```vue
<script setup>
import TooltipUsageDemo from './.vitepress/theme/TooltipUsageDemo.vue'
</script>
<template><TooltipUsageDemo /></template>
```

The ID is specific to this one guide example. Generate per-instance IDs before reusing several copies. A possible host shape is `{ id: string, text: string, placement: 'top' | 'bottom' | 'start' | 'end' }`; this is proposed integration data, not a shared installed component API. This simple example handles viewport edges, not every transformed ancestor, zoom mode or nested overlay. Test those contexts or use the application's positioning library.

## States and variants

- **Idle:** tooltip hidden, no visible description relationship.
- **Pointer or keyboard focus:** short help appears, no focus transfer.
- **Pointer over help:** remains visible; the content is not interactive.
- **Dismissed:** Escape hides until both input conditions clear.
- **Placement:** four preferences; fallback may change the actual side, especially on mobile.
- **Touch:** separate disclosure, not a click-toggle tooltip.
- **Disabled trigger:** native disabled controls do not receive focus. Put important reasons in visible adjacent text rather than relying on their tooltip.
- **Loading/error/interactive content:** not implemented and generally not tooltip responsibilities.

## Template coverage and real behavior

| Source | What actually exists |
|---|---|
| [Lustro UI kit](/ui-kit#tooltips) | ComponentCatalog uses a native button, aria-describedby and role=tooltip. CSS hover/focus-within controls visibility; 160ms motion has a reduced-motion override. No Escape state or viewport positioning engine. |
| [Components](/components#tooltips), [Lustro guide](/lustro/guide-components#tooltips) | Button and described tooltip with hover/focus-within CSS, top placement, 180ms opacity/transform and reduced motion. Not the guide controller above. |
| [Lustro expanded](/lustro/components-more#tooltips), [Felix expanded](/felix/components-more#tooltips), [Scopecraft expanded](/scopecraft/components-more#tooltips) | Already-visible styled spans with top/bottom/left/right arrows. The shared bsx click handler toggles a dim class; it does not create focus triggers, described relationships or a floating Tooltip instance. |
| [Lumen expanded](/lumen/components-more#tooltips) | The page embeds its Bootstrap gallery. That gallery's tooltip section currently renders styled span specimens, not initialized tooltip triggers. The Bootstrap version named by the page does not prove this section uses its JS Tooltip. |
| [Felix molecule](/felix/components/molecules#tooltip) | A span with data-tip, shown by a CSS pseudo-element on hover/focus. The span is not natively focusable and has no role/description relationship. Package names in prose are design-source examples, not verified installed exports. |
| StudioCatalog | A button with a theme-scoped described tooltip, shown by hover or focus. Fixed CSS offsets, not collision-aware placement. No Escape handler for that tooltip. |

Felix prose names Tooltip, TooltipProvider, TooltipTrigger and TooltipContent from `@felix/ui`. Do not copy that as a working import contract for this repository. Likewise, do not infer behavior of an unrelated Bootstrap catalog from the `.tip` specimens. The source pages above and this guide are separate implementations with different completeness.

## Motion and accessibility

This guide uses a 140ms opacity/3px entrance; reduced motion removes that entrance, including the shared tooltip animation. No delay gates keyboard access. The 120ms pointer grace is interaction timing, not animation. Text remains readable while the pointer crosses into it, and Escape does not blur the trigger.

Verify the description ID, accessible name, focus visibility, hover persistence, Escape suppression, reopening after exit, all placement preferences, resize/scroll, and touch disclosure. Check actual tooltip pixels at narrow widths and near viewport edges. Avoid placing a tooltip inside an ancestor that clips it, and test screen-reader announcement timing in the target application. Automated DOM checks do not certify every screen reader.

## Integration notes

Keep tooltip text plain and brief. Sanitize externally supplied text, preserve theme contrast, scope IDs per instance and remove listeners/timers on unmount. A tooltip must not submit a form or hide an important action. If the content needs focus, actions or longer reading, use a popover instead. All examples here are fictitious and local.

<style>
@media(max-width:700px){.tooltip-guide .vp-doc table,.tooltip-guide .vp-doc tbody,.tooltip-guide .vp-doc tr,.tooltip-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.tooltip-guide .vp-doc thead{display:none}.tooltip-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.tooltip-guide .vp-doc td{overflow-wrap:anywhere}.tooltip-guide .vp-doc tr{margin-bottom:12px}}
</style>
