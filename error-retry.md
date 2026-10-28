---
pageClass: error-retry-guide
---
<script setup>
import ErrorRetryUsageDemo from './.vitepress/theme/ErrorRetryUsageDemo.vue'
</script>

# Error and retry

An error state explains what failed and offers a safe next action. Use retry for a recoverable operation, not a validation error the person must fix or a permission denial that repeating cannot solve. Keep the failure's scope clear: a local display error is not evidence that all work was lost.

## Try failure, pending and recovery

<ErrorRetryUsageDemo />

The example starts failed. Choose whether the next simulated attempt succeeds, then Try local retry. A 700ms timer produces the chosen local outcome. The checkbox and retry button are disabled while pending, preventing duplicate attempts. Reset simulation cancels a pending timer, resets attempts to zero and restores failed. No fetch, upload or connection check occurs.

## How to use it

1. Name the failed operation and its scope. Do not promise previous changes are safe unless you have evidence of persistence.
2. Keep useful context and input visible. Do not wipe a form just because a request failed.
3. Offer a specific recovery. Retry only when the operation is safe to repeat; use idempotency for writes and purchases.
4. Model failed, pending and loaded explicitly. Disable duplicate actions while pending and announce the result without stealing focus.
5. Keep failure details useful but safe. Avoid leaking stack traces, secrets or private service responses into visible error text.
6. Cancel obsolete work and ignore stale responses. A later request must not be overwritten by an earlier result.

## Anatomy and actual API

`ErrorRetryUsageDemo.vue` has no props or emits. `state` is failed/pending/loaded, `succeeds` starts true and `attempts` starts zero. `retry()` guards pending, snapshots the chosen outcome, increments attempts and starts a 700ms timer. `reset()` clears the timer and resets state/count. The result callback clears its timer reference; onBeforeUnmount cancels any outstanding timer. The UI disables retry after loaded until reset. No backoff, auto-retry or network cancellation is claimed.

```vue
<script setup>
import ErrorRetryUsageDemo from './.vitepress/theme/ErrorRetryUsageDemo.vue'
</script>
<template><ErrorRetryUsageDemo /></template>
```

Suggested host contract, not an exported package API:

```ts
type LoadState<T> =
  | { status: 'failed'; errorCode: string; canRetry: boolean; previous?: T }
  | { status: 'pending'; requestId: string; previous?: T }
  | { status: 'loaded'; data: T }
```

A real host needs verified error classification, abort/timeout behavior, stale-response protection and a safe repeat policy. A payment or non-idempotent write cannot be retried merely because the first response was missing. Check current transaction state first.

## States and variants

| State | Actual behavior |
|---|---|
| Failed | Explanation and retry enabled, local failure status. |
| Pending | Busy panel, retry/checkbox disabled, attempt counted once. |
| Loaded | Two fictitious items; retry disabled until reset. |
| Repeated failure | Uncheck succeeds; each completed attempt returns to failed. |
| Reset during pending | Cancels timer; no delayed success overrides reset. |
| Unmount | Outstanding timer cleared. |
| Network/offline/auth | Not tested or inferred by this local timer. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#error-state), [Lustro guide](/lustro/guide-components#error-state) | Shared ComponentCatalog failed boolean toggles immediately between error and loaded copy. Role changes between alert/status; button switches Try again/Reset error. No request, pending stage or actual connection recovery. |

The source's previous-changes-safe and connection-restored copy are illustrative, not verified persistence or connectivity. This guide adds an explicit local pending simulation and cancellation so those distinctions can be tested without pretending to contact a service.

## Motion, accessibility and checks

Changed content fades and moves 3px over 180ms; reduced motion removes the effect. State updates do not wait for animation. A polite status announces pending/result and attempt count. The panel exposes aria-busy, controls retain native keyboard behavior and no automatic focus jump is added. This example avoids an assertive alert for every repeated simulated failure.

Test success and repeated failure, duplicate activation during pending, disabled controls, reset cancellation, unmount cleanup, keyboard, reduced motion and mobile wrapping. Production checks also need actual timeouts, offline/service failures, preserved input, authorization failures and retry safety. A green local simulation does not establish that a real operation recovered.

<style>
@media(max-width:700px){.error-retry-guide .vp-doc table,.error-retry-guide .vp-doc tbody,.error-retry-guide .vp-doc tr,.error-retry-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.error-retry-guide .vp-doc thead{display:none}.error-retry-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.error-retry-guide .vp-doc td{overflow-wrap:anywhere}.error-retry-guide .vp-doc tr{margin-bottom:12px}}
</style>
