---
pageClass: toasts-guide
---
<script setup>
import ToastUsageDemo from './.vitepress/theme/ToastUsageDemo.vue'
</script>

# Toasts

A toast is short, non-blocking feedback after an action. Use it for a brief confirmation, not the only copy of an important error, deadline or required next step. Persistent events belong in a notification inbox; field errors belong beside the field. Do not steal focus when a toast arrives.

## Try stacking, dismissal and auto-hide

<ToastUsageDemo />

Each addition gets its own increasing ID. Success, Info and Warning use explicit text labels as well as the same accent boundary. New toasts stay until dismissed by default. Enable auto-hide before adding one to give that toast a six-second timer. Changing the checkbox does not change existing items. Hover or focus pauses its timer; leaving starts a fresh six seconds, not the remaining duration. Clear removes all items and timers but does not reset IDs or the checkbox. All messages are fictitious and local.

## How to use it

1. Announce a real result, not an optimistic save that may still fail. This sample never saves anything remotely.
2. Use independent IDs and timer handles. A new arrival must not overwrite an earlier message or its timer.
3. Use role=status for ordinary polite feedback. Reserve role=alert for genuinely urgent interruption, not every red message.
4. Give dismiss buttons useful names. Keep the incoming toast from taking focus. When a focused dismiss button disappears, choose a safe focus destination.
5. Keep time-sensitive or actionable information available elsewhere. Auto-hide must not be the only way to read required content.
6. Let long stacks scroll without covering primary actions. This demo stays in document flow, not a portal over the page.

## Anatomy and actual API

`ToastUsageDemo.vue` has no props or emits. `items` contains `{ id: number, kind: string, message: string, auto: boolean }`. `autohide` starts false; `nextId` starts zero. `add(kind)` snapshots the checkbox and appends a message. `resume(item)` creates a fresh six-second timeout only for auto items. `pause(id)` clears that handle. `dismiss(id,event)` removes one item and returns focus to Add success toast when its dismiss button held focus. `clear()` removes all items and timers; unmount calls clear too.

```vue
<script setup>
import ToastUsageDemo from './.vitepress/theme/ToastUsageDemo.vue'
</script>
<template><ToastUsageDemo /></template>
```

The text within each article has role=status and aria-atomic=true; dismiss controls are outside that status node. No network, persistence, undo action, queue cap or global provider is implemented. A host could add `{ id, severity, title, message, durationMs, action }` to its own notification service. Those are suggested integration fields, not verified package exports.

## States and variants

| State | Actual behavior |
|---|---|
| Empty | Local empty text, no pending toast timers. |
| Success/info/warning | Named text labels; no urgency or action inferred from color. |
| Persistent | Default; manual dismissal only. |
| Auto-hide | Per-item six-second timer; hover/focus pauses, leaving restarts full duration. |
| Stacked | Arrival order, scrollable stack up to 420px tall. No eviction or deduplication. |
| Dismissed/cleared | Immediate removal; matching/all timers cleared. No exit animation. |
| Error/action/undo | Not simulated here. Keep recovery persistent and ground actual action success separately. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#toasts), [Components](/components#toasts), [Lustro guide](/lustro/guide-components#toasts) | Local independent IDs and timers, six-second expiry including errors, manual dismiss, cleanup on unmount. Error uses alert, others status. No pause-on-hover/focus in that source. |
| [Lustro expanded](/lustro/components-more#toasts), [Felix expanded](/felix/components-more#toasts), [Scopecraft expanded](/scopecraft/components-more#toasts) | Static specimens plus bsx-live controls: five kinds, six positions and auto-hide switch. Created DOM toasts expire after four seconds when enabled, then remove after a 200ms exit. The span with role=button used to close is not equivalent to a native keyboard button. |
| [Lumen expanded](/lumen/components-more#toasts) | Separate linked Bootstrap gallery. Do not infer the guide's timers or API from its specimen labels. |
| [Felix molecule](/felix/components/molecules#toast) | Two hidden DOM messages, only one visible at once; enhancer hides after 2200ms. Repeated clicks do not create an independent stack. Package prose names Toaster/toast from @felix/ui, not proof of installed exports. |
| Studio catalogs | One notice string, replaced by each arrival, role=status and manual dismiss. No auto-hide in the local toast function. |
| [Bastion](/bastion/components#toasts) | Local array, IDs and four-second expiry, status per item. The displayed stack has no manual dismiss button. |
| [Pulsefit HTML](/pulsefit-template/components.html#toasts) | Two fixed HTML toasts: success uses status, error alert. Page script imports Bootstrap 6.0.0-alpha.1 Toast from a CDN and calls show() on existing nodes, not this Vue controller or an independent-ID queue. |

These sources have different timing, stacking and accessibility contracts. Documentation does not silently change their behavior.

## Motion, accessibility and integration

New guide items fade and move 5px over 160ms. Reduced motion removes entry animation. Dismissal is immediate. There is no focus trap, Escape dismissal or auto-focus. Native buttons support Enter/Space; the checkbox uses native keyboard behavior. Timer pause helps reading, but persistence is safer for required information. Test with target assistive technology: DOM role inspection alone does not prove announcements in every screen reader.

Test independent stacking/timers, manual dismissal, clear, pause/resume, focus return, long content, scroll height, narrow layouts and navigation away. When integrating requests, cancel stale operations, dedupe repeated events deliberately, sanitize messages and keep actionable errors inline. Do not include private details in a global toast that may be visible during screen sharing.

<style>
@media(max-width:700px){.toasts-guide .vp-doc table,.toasts-guide .vp-doc tbody,.toasts-guide .vp-doc tr,.toasts-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.toasts-guide .vp-doc thead{display:none}.toasts-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.toasts-guide .vp-doc td{overflow-wrap:anywhere}.toasts-guide .vp-doc tr{margin-bottom:12px}}
</style>
