---
pageClass: hover-card-guide
---
<script setup>
import HoverCardUsageDemo from './.vitepress/theme/HoverCardUsageDemo.vue'
</script>

# Hover card

A hover card previews optional rich context about a person or item without leaving the current page. It can hold a name, short description and supporting metadata. Keep essential information visible. Use a deliberate popover or full detail page for actions and longer tasks; a hover preview should not become a hidden form.

## Try a delayed profile preview

Hover Sample person context for 300ms, or Tab to it for immediate context. Moving into the card keeps it open; leaving has a 180ms grace period. Escape dismisses without moving focus and suppresses reopening until both focus and pointer leave. Choose a preferred side to check placement. A native disclosure offers the same profile without hover. Everything is fictitious; no profile, presence or account is fetched.

<HoverCardUsageDemo />

## How to use it

1. **Keep context optional.** A name and the main action must work without opening the card. Do not hide required instructions, prices or availability behind hover.
2. **Delay pointer previews, not keyboard access.** A short pointer delay avoids accidental openings. Focus should show context immediately. Cancel pending timers when users leave.
3. **Allow entry into the card.** Keep the card visible while the trigger or card is hovered, or the trigger retains focus. A small exit grace bridges the gap.
4. **Keep dismissal stable.** Escape hides without moving focus. Do not immediately reopen under the same stationary pointer.
5. **Provide a touch path.** This guide has a separate native disclosure. If users need actions, use a deliberate popover rather than forcing hover mechanics onto touch.
6. **Check placement and privacy.** Clamp/flip at viewport edges, preserve readable wrapping, and show only information the current audience may see.

## Anatomy

| Part | Purpose |
|---|---|
| Trigger | Named focusable button; no business action. |
| Preview | Noninteractive note with fictitious profile text. |
| Description link | aria-describedby associates the visible preview. |
| Timing | 300ms pointer entry, immediate focus, 180ms exit grace. |
| Disclosure | Same optional profile content without hover. |

## Actual data and API

`HoverCardUsageDemo.vue` has no props or emits. `placement` defaults to `'bottom'` and offers top/bottom/start/end. Start/end are physical left/right in this LTR example, not a general RTL API. `hovered`, `focused`, `ready` and `dismissed` derive `open`; `actual` records the chosen side. `trigger`, `tip` and `position` are local element refs and fixed coordinates.

`enter()` sets pointer presence and schedules readiness after 300ms. `focus()` cancels the entry timer and opens immediately. `leave()` cancels pending entry and starts a 180ms exit timer. `reset()` clears readiness/dismissal only when neither input remains active. Escape sets dismissal. The measured positioner tries the preferred and opposite sides, uses top/bottom when neither horizontal side fits, and clamps to a 12px viewport margin. Resize/scroll remeasure. Unmount removes listeners and both timers. No network, persistence, profile lookup or presence subscription exists.

```vue
<script setup>
import HoverCardUsageDemo from './.vitepress/theme/HoverCardUsageDemo.vue'
</script>
<template><HoverCardUsageDemo /></template>
```

A host could provide `{ id: string, name: string, summary: string, metadata: string[] }`. That is suggested data, not a shipped prop interface. Generate unique IDs before mounting multiple copies. If adding links, rethink focus and dismissal with a deliberate nonmodal popover instead of merely inserting Tab stops into this preview.

## States and variants

- **Idle/pending/open:** pointer delay avoids incidental previews; focus opens immediately.
- **Pointer on card:** remains open, no interactive controls inside.
- **Dismissed:** Escape suppression lasts until focus and pointer both leave.
- **Placement:** four preferences with viewport fallback; narrow screens may use a different side.
- **Touch:** native disclosure, no required long press.
- **Missing/loading/error data:** not simulated. Keep the base control usable and avoid a misleading empty or stale identity preview.
- **Rich actions or editable content:** not implemented; choose a popover or full detail surface.

## Source coverage

| Source | Actual behavior and limits |
|---|---|
| [Lustro UI kit](/ui-kit#hover-card) | ComponentCatalog uses native details/summary for Dana Lee's sample coach profile. This is a deliberate disclosure, not a timed hover controller. It works without a mouse. |
| [Felix molecule](/felix/components/molecules#hovercard) | Button inside .fx-hover-wrap with a rich .fx-hover profile. CSS hides the card at rest and shows it on hover/focus-within. The wrapper can receive focus through its button; no description relationship is declared. No JS entry/exit delay or Escape state is defined for this card. |
| Components / Lustro guide | The task inventory names these routes, but the current Markdown source has no dedicated hover-card section or anchor. Do not invent links to missing coverage. This guide supplies a documented local example without claiming those pages already implement it. |

Felix prose names HoverCard, HoverCardTrigger and HoverCardContent from `@felix/ui`. These are design-source usage names, not verified installed exports here. The actual repository preview is DOM/CSS. Do not infer props, timing or accessibility guarantees from a package name in prose. The guide example is separate and does not silently change the existing catalog.

## Motion and accessibility

The guide uses a 140ms opacity/3px entrance. Reduced motion removes the entrance but preserves the pointer timing that prevents accidental previews. Focus does not wait for that delay. A visible focus ring stays on the trigger; the preview is a noninteractive note, not a modal or menu. It does not trap or receive focus.

Test short hover cancellation, sustained hover, pointer movement into the card, focus entry, Escape suppression, reopening after complete exit and the touch disclosure. Check all placements, viewport bounds, scroll/resize, description IDs and visible text at mobile widths. Test the target screen reader/browser combination; DOM association alone is not a guarantee of announcement timing.

## Integration notes

Keep identity and preview data in sync; cancel stale loads before showing a new person. Treat availability and metadata as sample text unless backed by live data. Sanitize external content, scope IDs and remove timers/listeners on unmount. All names and status-like text in this guide are fictitious, not claims about real people.

<style>
@media(max-width:700px){.hover-card-guide .vp-doc table,.hover-card-guide .vp-doc tbody,.hover-card-guide .vp-doc tr,.hover-card-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.hover-card-guide .vp-doc thead{display:none}.hover-card-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.hover-card-guide .vp-doc td{overflow-wrap:anywhere}.hover-card-guide .vp-doc tr{margin-bottom:12px}}
</style>
