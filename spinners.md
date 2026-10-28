---
pageClass: spinner-guide
---
<script setup>
import SpinnerUsageDemo from './.vitepress/theme/SpinnerUsageDemo.vue'
</script>

# Spinners and loaders

A spinner says that work is in progress when no useful completion estimate exists. It does not say how long the work will take. Use determinate progress when a real percentage is available, a skeleton to reserve a predictable layout, and a clear error/retry state when waiting has failed. Do not let a loader become the permanent empty state.

## Try a manual loading lifecycle

Choose size/color and start the local sample. The loading button disables to prevent duplicate starts, while Finish, Fail and Cancel remain available. Nothing finishes on a hidden timer: choose the result explicitly. Failure enables Retry; completion, cancellation and Reset remove the spinner and clear busy state. The result region is busy while the separate live status stays readable. Local starts counts accepted starts only. No network, upload or save occurs.

<SpinnerUsageDemo />

## How to use it

1. **Attach waiting to a real operation.** Show the loader when the request starts, and remove it on success, failure, cancellation and unmount. Animation is not evidence of server activity.
2. **Keep a readable label.** Say what is loading. A decorative spinner can be aria-hidden when a nearby status announces the same state; do not make every moving icon another live region.
3. **Prevent duplicate submission without blocking recovery.** Disable the initiating action while busy, but leave cancellation or a useful escape available when supported.
4. **Separate busy content from announcements.** aria-busy belongs on the result region. Keep a meaningful status outside it so updates are not deferred with the busy subtree.
5. **Choose size and color for context.** Small fits a button; medium/large fits a region. Color does not replace loading, failed or complete text.
6. **Respect reduced motion.** Keep a static indicator and the same text when rotation stops. Do not hide the only sign of waiting.

## Anatomy and actual API

`SpinnerUsageDemo.vue` has no props or emits. `state` is idle/loading/success/error/cancelled. `size` is small/medium/large, initially medium. `tone` is neutral/accent, initially neutral. `runs` counts accepted starts. `busy` derives from loading; `message` maps the current state to visible live status.

`start()` ignores duplicate calls while busy, increments the count and enters loading. The Finish/Fail/Cancel buttons choose local outcomes; Reset chooses idle. No timer, request, subscription or persistent setting exists, so there is no pending work to cancel on unmount. In a real integration, cancel the request or ignore stale results during cleanup.

The region spinner is 16/24/36px with 2/3/4px borders; the button spinner stays small. Both are decorative aria-hidden spans. One persistent role=status paragraph with aria-atomic=true carries state text. The result div has aria-busy=true only while loading. There is no percentage and no progressbar role.

```vue
<script setup>
import SpinnerUsageDemo from './.vitepress/theme/SpinnerUsageDemo.vue'
</script>
<template><SpinnerUsageDemo /></template>
```

A host might use `{ requestId: string, state: 'idle' | 'loading' | 'success' | 'error', error: string | null }`. That is proposed integration data, not this component's prop contract. Keep request identity and cancellation separate from the icon's visual size.

## States and variants

| State/variant | Meaning |
|---|---|
| Idle | No spinner, start available. |
| Loading | Region busy, initiating button disabled, labelled status visible. |
| Success | Spinner gone; a real application needs actual result confirmation. |
| Error/retry | Spinner gone, failure text and Retry available. |
| Cancelled | Spinner gone, no claim that work completed. |
| Small/medium/large | Local visual sizes; no timing or operation difference. |
| Neutral/accent | Decorative color choice, not semantic success/failure. |
| Branded coin/growing dot | Source visual variants; they still need an accessible status and lifecycle. |

## Source coverage

| Source | Actual implementation |
|---|---|
| [Lustro UI kit](/ui-kit#spinners-loaders), [Components](/components#spinners-loaders), [Lustro guide](/lustro/guide-components#spinners-loaders) | Fixed .l-spinner with role=status and Loading label. This is a presentation specimen, not a request lifecycle. |
| [Lustro expanded](/lustro/components-more#spinners), [Felix expanded](/felix/components-more#spinners), [Scopecraft expanded](/scopecraft/components-more#spinners) | Border/growing spans in sizes and colors. Loading-button specimens are styled spans, not native buttons guarding a real submission. Do not infer status semantics from motion alone. |
| [Lumen expanded](/lumen/components-more#spinners) | Gallery iframe has similar spin/grow and loading-button specimens, not this guide's state controller. |
| [Felix Spinner](/felix/components/atoms#spinner) | aria-hidden .fx-spin spans, 14/22/32px. The actual specimens are decorative and need surrounding status text when integrated. |
| [Felix CoinLoader](/felix/components/atoms#coinloader) | aria-hidden branded coin spans, small 24/large 56px variants. Prose names size/label usage from @felix/ui; those are design-source examples, not verified installed exports here. |
| Studio catalogs | Catalog has a named role=status spinner specimen and an independent 650ms local loading-button demo with busy guard/cleanup. Extended includes another spinner specimen. Neither is proof of a real asynchronous service. |

The static gallery specimens intentionally demonstrate appearance. This guide supplies a separate truthful loading lifecycle; it does not silently change existing pages or claim their spans are full components with a shared API.

## Motion and accessibility

The guide rotates every 800ms while loading. Reduced motion stops rotation, leaving the visible ring and unchanged status text. The busy lifecycle and recovery controls do not depend on animation completion. A spinner is not a focus target; keyboard users reach the buttons and selects instead.

Test duplicate activation, every terminal state, retry, reset during waiting, busy attributes, disabled controls, persistent status and reduced motion. Test all sizes/colors on mobile without clipping and check that labels remain visible. For real operations, avoid announcing repeated identical loading messages or every polling tick; announce meaningful outcomes. Keep the status text if the visual icon fails or motion is disabled.

## Integration notes

Do not fake progress with a spinner that never ends. Set a bounded timeout/recovery path from the service contract, preserve entered data on failure and ignore stale responses after a new request or cancellation. Keep loading scopes narrow so one busy area does not block the whole application. All actions here are fictitious and local.

<style>
@media(max-width:700px){.spinner-guide .vp-doc table,.spinner-guide .vp-doc tbody,.spinner-guide .vp-doc tr,.spinner-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.spinner-guide .vp-doc thead{display:none}.spinner-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.spinner-guide .vp-doc td{overflow-wrap:anywhere}.spinner-guide .vp-doc tr{margin-bottom:12px}}
</style>
