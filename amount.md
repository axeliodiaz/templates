---
pageClass: amount-guide
---
<script setup>
import AmountUsageDemo from './.vitepress/theme/AmountUsageDemo.vue'
</script>

# Amount

An amount emphasizes a numeric value with its currency. Use it for a hero balance, quote or transfer summary only when the value comes from the relevant source. Formatting does not verify a balance, exchange rate, fee or payment result.

## Try minor units, locale and currency

<AmountUsageDemo />

The demo starts at 20000 minor units, interpreted as USD 200.00. Buttons change the integer by 2500, clamped between zero and 1000000. USD uses divisor 100; CLP uses divisor 1. Switching currency reinterprets the integer and explicitly does not perform an exchange. Locale changes only display formatting. Reset restores the initial value, USD and en-US.

## How to use it

1. Keep the numeric value separate from its formatted string. Do not parse a localized display string back into a payment amount.
2. Specify currency and unit scale explicitly. Do not assume every currency has two fractional digits.
3. Format with Intl.NumberFormat for the intended locale and currency; show the currency code when a symbol alone could be ambiguous.
4. Use integer minor units or the host's decimal-money type for accounting. This demo's small bounded integers are illustrative, not a full financial arithmetic library.
5. Keep formatting changes separate from currency conversion. A real conversion needs a verified rate, direction, fees and quote validity.
6. Animate presentation only; never delay the authoritative value or make a rolling number imply a payment is processing.

## Anatomy and actual API

`AmountUsageDemo.vue` has no props or emits. `minor` starts 20000; currency is limited to USD/CLP and locale to en-US/es-CL. Computed scale is 100 or 1; formatted uses Intl.NumberFormat on minor/scale. `change(delta)` clamps the integer to the demo bounds. `reset()` restores all fields. No timers, requests, subscriptions or global listeners need cleanup.

```vue
<script setup>
import AmountUsageDemo from './.vitepress/theme/AmountUsageDemo.vue'
</script>
<template><AmountUsageDemo /></template>
```

Suggested host model, not an exported package API:

```ts
type DisplayAmount = {
  minorUnits: number // safe bounded integer, or host decimal representation
  currency: string
  minorUnitScale: number // verified for this currency/source
  locale: string
}
```

For large amounts, preserve precision with your accounting representation rather than unsafe JavaScript integers. Decide explicitly how to show negative values, unavailable/stale balances and rounding. Never turn a missing value into zero by default. This teaching demo supports only nonnegative bounded USD/CLP interpretations, not arbitrary currency metadata.

## States and variants

| State | Actual behavior |
|---|---|
| Initial | 20000 minor units as USD, en-US display. |
| Adjusted | Add/subtract 2500, immediate value/status update. |
| Zero/maximum | Clamp at endpoints and disable the matching action. |
| Locale changed | Same integer/currency, localized punctuation and ordering. |
| Currency changed | Same integer, different divisor and code; no exchange. |
| Loading/error/negative | Not simulated; do not infer a real zero or balance. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Amount](/felix/components/atoms#amount) | Static lg/md amount specimens. Enhancer reads data-amount-value, changes it by ±25 with a zero floor, and replaces markup with en-US integer formatting plus fixed .00 and USD. Only the first amount updates. |

Felix prose describes value/currency/locale/size/animated props and rolling changed digits. The actual enhancer does not implement that package API or per-digit rolling. This guide uses explicit whole-value entrance motion and real Intl formatting; it does not claim a rolling-number engine or fixed-width formatting across every locale.

## Motion, accessibility and checks

A changed formatted value fades and moves 3px over 180ms. Reduced motion removes the effect; the number still updates immediately. Tabular numerals improve alignment but do not guarantee identical width when digit count or currency changes. The separate polite status reports the local value and code. Native selects/buttons retain keyboard behavior and visible focus.

Test both currencies and locales, value/divisor interpretation, increment/decrement, lower/upper clamps, reset, currency code visibility, reduced motion and narrow wrapping. Verify negative, missing, stale and precision-sensitive values separately in a real host. No demo interaction moves funds or verifies a financial claim.

<style>
@media(max-width:700px){.amount-guide .vp-doc table,.amount-guide .vp-doc tbody,.amount-guide .vp-doc tr,.amount-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.amount-guide .vp-doc thead{display:none}.amount-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.amount-guide .vp-doc td{overflow-wrap:anywhere}.amount-guide .vp-doc tr{margin-bottom:12px}}
</style>
