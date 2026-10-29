---
pageClass: cart-summary-guide
---
<script setup>
import CartSummaryUsageDemo from './.vitepress/theme/CartSummaryUsageDemo.vue'
</script>

# Cart summary

A cart summary explains item quantities, discounts, tax and the amount that would be due before checkout. A receipt records an already-confirmed transaction. Do not label an estimate as a paid order just because it uses receipt-shaped paper. Use this pattern when people need to review a small order; larger carts also need inventory, delivery, returns and line-item editing.

## Try quantities, promo and a local preview

<CartSummaryUsageDemo />

Set quantities from zero to five. Apply `WELCOME10` for an illustrative 10% item discount, try an unknown code, or remove the promo. Totals update from the same line items. Preview summary text reveals a read-only, selectable text version, not a payment receipt. Replay only repeats its reveal. Reset restores the original cart and clears the preview. No money is spent, clipboard written, order placed or data saved.

## How to use it

1. Keep unit price and quantity separate. Show each extended line price and calculate all totals from those same lines.
2. Use integer minor units for this USD example. Round discount first, then tax on the discounted subtotal; make the rule explicit rather than hiding a formula in the visual design.
3. Separate the code being edited from the discount actually applied. An unsubmitted draft does not change totals. Invalid submission removes the discount and explains the result.
4. Keep tax and currency policy with the host commerce system. This example's 8% rate is fictitious, not location-based tax advice or a merchant quote.
5. Distinguish reviewing a summary from committing a payment. Real checkout needs current price, stock, shipping, fees, currency, payment confirmation and a server-authoritative total.
6. Issue a paid receipt only after confirmed payment. A barcode-like decoration, animation or client-side success message proves nothing about a transaction.

## Anatomy and actual API

`CartSummaryUsageDemo.vue` has no props or emits. `items` holds id/name/unitCents/quantity, `code` is the editable draft, `applied` is the accepted local promo flag, and `message` describes the last promo action. `receiptVisible` controls the text preview; `replay` remounts that panel to repeat its CSS animation.

The computed values are:

```ts
subtotal = sum(unitCents * quantity)
discount = applied ? Math.round(subtotal * 0.10) : 0
tax = Math.round((subtotal - discount) * 0.08)
total = subtotal - discount + tax
// Initial: 12500 + 0 + 1000 = 13500 cents ($135.00)
// WELCOME10: 12500 - 1250 + 900 = 12150 cents ($121.50)
```

Prices are formatted with `Intl.NumberFormat('en-US', {style:'currency', currency:'USD'})`. Quantity selects provide integer values from 0 to 5, including a zero-quantity line. All-zero quantities show an empty-cart message and disable Apply/open-preview. An already-open preview remains closable and updates to zero totals. The accepted promo stays active through quantity changes; an empty cart therefore has zero discount and tax, not negative amounts. Removing it or resetting clears it. Whitespace and case are normalized only on Apply.

```vue
<script setup>
import CartSummaryUsageDemo from './.vitepress/theme/CartSummaryUsageDemo.vue'
</script>
<template><CartSummaryUsageDemo /></template>
```

Suggested production data, not an installed package API:

```ts
type CartLine = { id: string; name: string; unitMinor: number; quantity: number }
type Quote = {
  currency: string
  lines: CartLine[]
  subtotalMinor: number
  discountMinor: number
  taxMinor: number
  shippingMinor: number
  totalMinor: number
  expiresAt: string
}
// Validate on the server. Currency minor-unit rules are not universally two decimals.
```

There are no requests, listeners, timers or subscriptions in this Vue example. No cleanup beyond Vue unmount is needed. Text is rendered through Vue interpolation and a textarea value, not inserted as HTML. The preview is live, not an immutable transaction snapshot. There is deliberately no Pay or Copy action.

## States and responsibilities

| Part/state | Behavior |
|---|---|
| Line items | Native labeled quantity selects, unit and extended prices. |
| Promo draft/applied/invalid | Draft does not apply itself; status explains submission, remove clears code and flag. |
| Totals | One computed chain, discount before illustrative tax, no independent hard-coded total. |
| Empty cart | All-zero rows stay available for recovery; Apply/open-preview disabled, existing preview can close. |
| Preview | Read-only summary text, explicit not-paid label, live totals and replay. |
| Reset | Initial 1/2/1 quantities, no promo or preview. |

## Source coverage and limits

| Source | Actual implementation |
|---|---|
| [Felix](/felix/cart-summary) | Static light/cream/dark receipt variants and pre-payment cart specimen using csx classes. |
| [Lumen](/lumen/cart-summary) | Same structural family with Lumen tokens. |
| [Scopecraft](/scopecraft/cart-summary) | Same receipt/cart family with its own theme. |
| [Lustro](/lustro/cart-summary) | Same receipt/cart family; also used on its landing page. |
| [Pulsefit](/pulsefit/cart-summary) | Same structural family with Pulsefit tokens. |
| Shared cartmotion.ts/cartsum.css | DOM animation and Replay click listener, themed paper/serrated edge/decorative bar styling. Not a checkout or copy controller. |

The source uses styled spans for Replay, Copy receipt, Apply and Pay; only Replay gets a click handler from `mountCartMotion`. It is not a keyboard-native button. Copy/Apply/Pay do not implement their labels. The initial light-paper example's $125 subtotal, $12.50 discount, $9 tax and $121.50 total agree, but the cream/dark specimens omit some item/discount rows while repeating those totals. They are visual specimens, not a reliable ledger or shared cart state. Decorative bars do not encode a verified order number. Source headings and prose do not establish a real payment, merchant identity or an installed component API.

The existing shared enhancer reveals paper with a 2.2s clip/y animation, staggers rows, grows bars and counts totals over 1.2s. It skips starting when reduced motion is already on. It marks roots with data-mo and attaches Replay listeners, but exposes no returned teardown for animations/listeners or reactive motion-preference change handling. That is a source limitation, not behavior to copy into a production payment flow. This guide adds a separate original controller without changing those source specimens.

## Motion, accessibility and checks

This example reveals the preview with a 240ms fade and 6px movement. Reduced motion removes animation. Totals are never animated through misleading intermediate dollar amounts. Replay does not claim to print, process or confirm anything. Native form submission supports Enter, labels identify controls, Apply status is live, preview has expanded/controls state, and the summary text can be selected with the keyboard. Mobile layout stacks items and summary; reference maps stack too.

Check initial and discounted arithmetic, invalid/removal behavior, unsubmitted code, quantity recalculation, all-zero and recovery, preview text matching displayed totals, close while empty, replay, reset, Enter submission, reduced motion, native keyboard selects and mobile overflow. Production also needs server quote reconciliation, currency/tax rounding, stock, shipping/fee changes, payment failure/retry/idempotency and receipt authenticity tests. No screen-reader or payment-provider integration is claimed by these local checks.

<style>
@media(max-width:700px){.cart-summary-guide .vp-doc table,.cart-summary-guide .vp-doc tbody,.cart-summary-guide .vp-doc tr,.cart-summary-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.cart-summary-guide .vp-doc thead{display:none}.cart-summary-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.cart-summary-guide .vp-doc td{overflow-wrap:anywhere}.cart-summary-guide .vp-doc tr{margin-bottom:12px}}
</style>
