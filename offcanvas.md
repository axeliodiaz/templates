---
pageClass: offcanvas-guide
---
<script setup>
import OffcanvasUsageDemo from './.vitepress/theme/OffcanvasUsageDemo.vue'
</script>

# Offcanvas

Offcanvas moves secondary content to a viewport edge. Use it for compact navigation, filters or details that should keep the current page visible. Choose an inline region when people need to compare or edit both surfaces at once. Offcanvas describes placement, not a universal focus or state API.

## Try every edge

Choose start, end, top or bottom and open the fictitious panel. Close, Escape and optional backdrop dismissal work. This guide uses native modal dialog behavior: the background remains visible but inert. Switching the backdrop option changes outside-click dismissal, not whether the background can receive focus. Nothing is sent or saved.

<OffcanvasUsageDemo />

## How to use it

1. **Pick the edge for the task.** Start often holds navigation; end holds detail. Top/bottom need height limits for short viewports.
2. **Choose modality deliberately.** This guide calls `showModal()`. A nonmodal inspector needs a different focus and background-interaction policy; do not add aria-modal and leave the page interactive.
3. **Provide a visible title and close control.** Focus starts on Close, a safe action. Keep Close reachable when the panel scrolls or the keyboard opens.
4. **Set dismissal rules before adding a form.** Backdrop clicks dismiss only when the option is on. Unsaved work needs a discard/recovery policy, not accidental loss.
5. **Restore focus.** Closing focuses the opening button. Route changes close the panel during unmount.
6. **Keep the task bounded.** Long or multi-step flows may deserve their own page. Never claim that opening details executed an action.

## Anatomy

| Part | Role |
|---|---|
| Trigger | Button opens the selected local placement. |
| Edge container | Native dialog positioned against a viewport edge. |
| Title and description | Accessible name and short explanation. |
| Close | Enabled, visible safe dismissal target. |
| Backdrop | Inert background overlay with optional outside-click dismissal. |
| Content | Scrollable independent secondary surface. |

## Actual data and API

`OffcanvasUsageDemo.vue` is a no-props, no-emits local demo. `placement` starts as `'end'`, accepts start/end/top/bottom, and supplies the dialog class. `backdrop` starts `true` and governs outside clicks. `panel` and `opener` are element refs. `result` is a fictitious local status string.

`show()` calls `panel.showModal()`. `close()` closes and updates the status. A Tab edge handler keeps focus on the single enabled Close control. The close event restores opener focus. Escape uses the native cancel default. The outside handler checks the target plus the content rectangle, so a click inside padding is not mistaken for a backdrop click. On unmount the native dialog closes. No storage, router, server or Bootstrap controller is required by this particular demo.

```vue
<script setup>
import OffcanvasUsageDemo from './.vitepress/theme/OffcanvasUsageDemo.vue'
</script>
<template><OffcanvasUsageDemo /></template>
```

For application state, a possible host shape is `{ open: boolean, placement: 'start' | 'end' | 'top' | 'bottom', recordId: string | null }`. That is an integration suggestion, not a catalog prop contract. Replace fixed IDs if mounting multiple instances, and use logical inline edges in an RTL product. This guide's start/end classes demonstrate left/right in the current LTR document.

## States and variants

- **Closed/open:** native showModal blocks background interaction and handles Escape. Close restores focus.
- **Start/end:** full viewport height, width at most 400px and never wider than the viewport.
- **Top/bottom:** full width, content height capped at 65dvh with internal scrolling.
- **Backdrop dismissal on/off:** off keeps the panel open after outside clicks; Close and Escape still work.
- **Scrollable:** content stays within the viewport. Real forms must preserve values across recoverable errors.
- **Loading/error/empty:** replace the content with truthful status and recovery without hiding Close. Not simulated by this sample.
- **Nonmodal/push layout:** separate patterns, not implemented here. A pushed layout must be tested for width and background navigation.

## Template map

| Surface | Actual behavior |
|---|---|
| Lustro UI kit | [Catalog](/ui-kit#offcanvas) uses native dialog-based offcanvas with opener focus restoration. The reusable controller is local to ComponentCatalog, not an installed package API. |
| Lustro base guide | [Guide](/lustro/guide-components#offcanvas), [components](/components#offcanvas): button/backdrop plus positioned aside. Escape is on the aside, but initial focus/containment are not supplied. Do not call that complete modal behavior. |
| Expanded sets | [Lustro](/lustro/components-more#offcanvas), [Felix](/felix/components-more#offcanvas), [Scopecraft](/scopecraft/components-more#offcanvas): static start/end visual specimens with div/span close glyphs, not live close buttons. |
| Lumen | [Expanded gallery](/lumen/components-more#offcanvas) links into its standalone Bootstrap gallery. The document anchor is navigation context, not shared Vue state. |
| PulseFit standalone | [Offcanvas](/pulsefit-template/components.html#offcanvas): native drawer with its own open/close DOM handlers and Escape behavior. No common Vue props. |

## Motion, keyboard and accessibility

This guide enters from its chosen edge by 8px over 180ms. Reduced motion removes the arrival animation, leaving focus and dismissal intact. Top/bottom motion uses the vertical axis; start/end use the horizontal axis. Do not delay focus until the animation ends.

Test keyboard opening, initial safe focus, Tab/Shift+Tab, Escape, explicit Close, inside-padding clicks and both backdrop settings. Verify zoom, viewport edges, safe areas and scrollable long content. Screen readers need a named dialog; a visual scrim alone does not make the background inert. Do not hide the only close target offscreen.

## Integration notes

Keep native dialog and framework offcanvas controllers separate: choose one owner for opening, focus and dismissal. If using Bootstrap's own controller, follow its installed version's actual markup and events instead of treating this no-dependency demo as that API. Clean up listeners and close on route changes. All examples are fictitious; production actions need validated state and confirmed results.

<style>
@media(max-width:700px){.offcanvas-guide .vp-doc table,.offcanvas-guide .vp-doc tbody,.offcanvas-guide .vp-doc tr,.offcanvas-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.offcanvas-guide .vp-doc thead{display:none}.offcanvas-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.offcanvas-guide .vp-doc td{overflow-wrap:anywhere}.offcanvas-guide .vp-doc tr{margin-bottom:12px}}
</style>
