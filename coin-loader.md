---
pageClass: coin-guide
---
<script setup>
import CoinLoaderUsageDemo from './.vitepress/theme/CoinLoaderUsageDemo.vue'
</script>

# CoinLoader

A coin-shaped loader is an indeterminate waiting signal with a distinctive visual identity. Use it for a waiting region that merits more presence than an inline spinner. It does not measure progress, verify a payment or prove that a transfer is running. For a real percentage use [progress](/progress); for a compact generic wait see [spinners](/spinners).

## Try a manual waiting lifecycle

<CoinLoaderUsageDemo />

Choose one of three sizes, start a local wait and explicitly finish, fail or cancel it. Retry starts another example after failure. Reset clears the wait, size and accepted-start count. No hidden timeout chooses a result; no money, request or server work is involved. The neutral token-based coin is original teaching UI, not Felix branding or a payment-service logo.

## How to use it

1. Connect visibility to an actual operation state. Remove the coin on success, failure, cancellation and cleanup, not after an arbitrary animation cycle.
2. Name the activity in nearby visible text. Keep one persistent status outside the busy region so assistive technology can hear a meaningful outcome.
3. Prevent duplicate starts while waiting. Leave a supported cancel or recovery route reachable; never leave a perpetual loader where an error should be.
4. Keep the coin indeterminate. If a host has reliable progress, replace it with a labelled determinate indicator rather than inventing percentages.
5. Use a brand only with permission. The source's Felix association does not make that identity appropriate for another product or financial operation.
6. Treat motion as decoration. Reduced motion keeps the static coin and waiting text without changing the operation lifecycle.

## Anatomy and actual API

`CoinLoaderUsageDemo.vue` has no props or emits. Local refs are `size` (sm/md/lg), `state` (idle/loading/success/error/cancelled) and `runs` (accepted starts). `busy` derives from loading; `status` maps state to truthful local text. `start()` guards duplicate calls and increments runs. `finish(outcome)` ignores calls outside loading. Reset restores idle/md/zero. There are no timers, requests, global listeners or subscriptions to clean up here.

The result region carries aria-busy while loading. A decorative aria-hidden span appears only in that state, and a separate persistent role=status paragraph announces the state. Native buttons control outcomes; the coin is neither focusable nor a progressbar. Its local diameter is 24/36/56px and its rotation period is 1.2 seconds.

```vue
<script setup>
import CoinLoaderUsageDemo from './.vitepress/theme/CoinLoaderUsageDemo.vue'
</script>
<template><CoinLoaderUsageDemo /></template>
```

Suggested integration data, not an exported package API:

```ts
type WaitingOperation = {
  requestId: string
  phase: 'idle' | 'loading' | 'success' | 'error' | 'cancelled'
  activityLabel: string
  canCancel: boolean
  error: string | null
}
```

In a real host, abort supported requests on cancel/unmount and reject stale responses by request identity. A local Cancel click does not establish that a server stopped an operation. Show completion only after the service confirms the actual result; a loader finishing is not a payment receipt.

## States and sizes

| State/variant | Behavior |
|---|---|
| Idle | No coin, start enabled, result not busy. |
| Loading | Coin and waiting text visible; start disabled, outcome buttons available. |
| Success | Coin removed; local completion text, no financial claim. |
| Error/retry | Coin removed; failure text and Retry example available. |
| Cancelled | Coin removed; cancellation text, not success. |
| Reset | Stops the local wait, restores md and clears the count. |
| sm/md/lg | 24/36/56px, presentation only; state survives size changes. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix CoinLoader](/felix/components/atoms#coinloader) | Three static aria-hidden spans: fx-coin-sm, default fx-coin and fx-coin-lg. CSS gives a radial-gradient coin, 24/36/56px sizes and fx-spin at 1.2s linear infinite. No operation controller, status label, progress value or result handler is attached to these specimens. |
| [Felix Spinner and Dots](/felix/components/atoms#spinner), [Dots](/felix/components/atoms#dots) | Separate compact/generic decorative loading specimens, not alternate states of a transaction API. |
| [Spinners guide](/spinners) | Separate general lifecycle teaching demo. This focused guide explains the coin visual and its branding boundary, not another implementation of a payment service. |

Source prose names @felix/ui, size and a descriptive label. Those are design-source usage claims, not verified installed exports in this repository. This guide does not invent a shared package adapter or claim that the static spans already expose the controller above. The source's decorative spans need host status text when used to communicate real waiting.

## Motion, accessibility and checks

Only the loading coin rotates. Removing it ends the animation without a timer; reduced motion disables rotation but preserves the shape, status and busy state. There is no percentage or spinning announcement on every revolution. Keep focus on the initiating control or a sensible recovery action; do not repeatedly move it to the loader. In a real host, test focus handling when an outcome disables the currently focused action.

Test all sizes, state-preserving size changes, duplicate starts, each terminal outcome, retry, reset while waiting, keyboard activation, persistent status outside the busy subtree, reduced motion and narrow wrapping. Test actual cancellation and stale-response handling separately when connecting a service. Never use the coin as the only sign of failure or as evidence that funds moved.

<style>
@media(max-width:700px){.coin-guide .vp-doc table,.coin-guide .vp-doc tbody,.coin-guide .vp-doc tr,.coin-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.coin-guide .vp-doc thead{display:none}.coin-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.coin-guide .vp-doc td{overflow-wrap:anywhere}.coin-guide .vp-doc tr{margin-bottom:12px}}
</style>
