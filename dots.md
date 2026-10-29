---
pageClass: dots-guide
---
<script setup>
import DotsUsageDemo from './.vitepress/theme/DotsUsageDemo.vue'
</script>

# Dots

Three pulsing dots are a compact, indeterminate waiting indicator. Place them next to an activity label or inside a loading button when a larger [CoinLoader](/coin-loader) would be distracting. They are not a menu trigger, a typing receipt, a percentage or evidence that a remote operation is running. Use [progress](/progress) when a trustworthy completion value exists.

## Try an inline lookup

<DotsUsageDemo />

Choose a dot size, then start the fictitious lookup. The initiating button keeps readable text, shows three decorative dots and disables duplicate starts. Finish, Fail and Cancel remain separate reachable actions. Retry starts another local example after failure; Reset clears state, size and count. Nothing calls a service or finishes automatically. The example result is fictitious.

## How to use it

1. Tie the dots to a real loading state, not a click's animation alone. Remove them on every terminal path.
2. Keep readable action text inside a busy button. Never replace its accessible name with punctuation or three unnamed spans.
3. Put one live status outside the result's busy subtree. Avoid announcing each dot or each animation loop.
4. Disable duplicate initiation while leaving a supported cancellation or recovery action available elsewhere.
5. Do not use loading dots to claim another person is typing unless a trustworthy presence signal exists. Do not give them button semantics unless they actually open a menu.
6. Keep waiting understandable with animation disabled. A static group of dots and clear text are sufficient; motion must not control completion.

## Anatomy and actual API

`DotsUsageDemo.vue` has no props or emits. `size` is sm/md/lg (4/6/8px dot diameter), `state` is idle/loading/success/error/cancelled and `runs` counts accepted starts. `busy` derives from loading and `status` maps it to visible local text. `start()` ignores duplicate calls while loading; `finish(outcome)` ignores calls outside loading. `reset()` restores idle/md/zero. No timer, network request, global listener or subscription needs cleanup in this demo.

One native start button holds text and an aria-hidden span containing three decorative i elements. The result div has aria-busy while loading; the persistent role=status paragraph is its sibling, not its child. The dots have no progressbar role or numeric value. Outcome controls use native disabled state when no wait exists.

```vue
<script setup>
import DotsUsageDemo from './.vitepress/theme/DotsUsageDemo.vue'
</script>
<template><DotsUsageDemo /></template>
```

Proposed host data, not an installed package contract:

```ts
type InlineWait = {
  requestId: string
  state: 'idle' | 'loading' | 'success' | 'error' | 'cancelled'
  actionLabel: string
  result: unknown | null
  error: string | null
}
```

A service integration needs request identity, supported abort handling and stale-response rejection after retry/cancellation/unmount. Cancelling local presentation does not prove server cancellation. Keep actual result data separate from the dots' visual size and never infer success from an animation ending.

## States and variants

| State/variant | Behavior |
|---|---|
| Idle | No dots, start enabled, result not busy. |
| Loading | Readable Looking up button with three dots; duplicate start disabled. |
| Success | Dots gone, fictitious example record shown. |
| Failure/retry | Dots gone, failure text and Retry lookup available. |
| Cancelled | Dots gone, cancellation status, no result claim. |
| Reset | Idle, md size and zero accepted starts, including during waiting. |
| sm/md/lg | 4/6/8px diameter; no timing or operation difference. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Dots](/felix/components/atoms#dots) | Three static aria-hidden fx-dots specimens, each containing three i elements. CSS sets 4/6/8px sizes, 4px gap and a one-second fx-dot pulse with 0/.15/.3s delays. No click handler, result data, busy lifecycle or status announcement is attached to these spans. |
| [Felix CoinLoader](/felix/components/atoms#coinloader), [Spinner](/felix/components/atoms#spinner) | Separate loading visuals. These are not alternate states of a shared request controller. |
| [Spinners guide](/spinners) | General waiting lifecycle and source coverage. This focused example explains inline dots and stable readable button text. |

Felix prose names @felix/ui, size and an accessible label. Those are design-source usage claims, not verified installed exports here. This guide adds a separate local Vue lifecycle rather than claiming the source's decorative spans already implement one. Its token-based dots are not a pixel-equivalent package adapter.

## Motion, accessibility and checks

Only loading dots pulse opacity, with staggered starts. Reduced motion stops all pulses and makes each dot fully visible. Removing the loading subtree stops the animation; no timer survives unmount. A host should choose a sensible recovery focus target when the currently focused outcome button becomes disabled, and avoid forcing focus to a decorative indicator.

Test three dot sizes, preserved state during size changes, duplicate prevention, success/failure/cancel, retry, reset while loading, native keyboard activation, busy attributes, status placement, animation delays, reduced motion and mobile wrapping. For real services, separately test cancellation, timeout and late-response behavior. Dots must not turn failure into an indefinite silent wait.

<style>
@media(max-width:700px){.dots-guide .vp-doc table,.dots-guide .vp-doc tbody,.dots-guide .vp-doc tr,.dots-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.dots-guide .vp-doc thead{display:none}.dots-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.dots-guide .vp-doc td{overflow-wrap:anywhere}.dots-guide .vp-doc tr{margin-bottom:12px}}
</style>
