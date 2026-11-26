---
aside: false
pageClass: ticket-page
---
<script setup>
import { ref } from 'vue'
import PaymentTicket from './.vitepress/theme/payment-ticket/PaymentTicket.vue'
const demoState = ref('paid')
</script>

# Payment ticket module

<label>
  State
  <select v-model="demoState">
    <option value="paid">Paid</option>
    <option value="pending">Pending</option>
    <option value="failed">Failed</option>
    <option value="empty">Empty</option>
    <option value="invalid">Invalid</option>
  </select>
</label>

<PaymentTicket :demo-state="demoState" />

TPL-TICKET-01 is a shared Vue presentation module for synthetic payment confirmation. It is not checkout and does not process payments. Demo references, amounts, card masks and barcode decoration are original and local. No providers or networks are connected in the default demo.

## Scope

Payment ticket confirms a payment and shows a perforated comprobante with ticket number, amount, paid date, masked card row, decorative barcode and tear-off stub. It does **not** list line items (see [Cart summary](/felix/cart-summary) for itemized receipts). The barcode is not scannable.

## Catalog scope matrix {#catalog-scope-matrix}

| Template | Demo route | Variants | Adapter |
| --- | --- | --- | --- |
| See inventory in `.vitepress/theme/payment-ticket/inventory.json` | `/<template>/payment-ticket` | Per template | Host tokens via `.ticket-<id>` |

Screenshot evidence is produced by `tests/payment-ticket.cjs` for supported variants at 1720 and 390 px.

## Data contract

Source: `.vitepress/theme/payment-ticket/ticket.model.ts`. Status values: `pending`, `paid`, `failed`. Unknown numeric fields are `null` and render as `n/a`.

## Minimal consumer

```vue
<script setup lang="ts">
import PaymentTicket from './.vitepress/theme/payment-ticket/PaymentTicket.vue'
import { samplePaid } from './.vitepress/theme/payment-ticket/ticket.sample'
</script>
<template><PaymentTicket :data="samplePaid()" theme="meadow" /></template>
```

## Interaction, accessibility and motion

Demo controls (`Auto-explore`, `Replay`, `Scan`, `Tear stub`) sit inside the module toolbar. Auto-explore runs once per click (~10.2 s) and stops on any user interaction or tab hide. `prefers-reduced-motion: reduce` disables count-up, scan line motion, 3D tilt and Auto-explore.

| Reduced motion | Behavior |
| --- | --- |
| Entrance | Final static layout |
| Scan | Accent outline only |
| Tear | Vertical offset, no rotation |
| Auto-explore | Disabled with explanatory `title` |

## Reference and boundaries

Pattern reference: “Billing made fun” by Damini Maurya (@UxDamini_), https://x.com/uxdamini_/status/2125559996079309069. Original implementation; no code, fonts, icons, brand marks or sample data from the post are used.

## Verification

Run `npm run test:payment-ticket-model`, `npm run test:payment-ticket-contrast`, `npm run test:payment-ticket`, `npm run test:payment-ticket-motion`, and `npm run build`. Contrast: [measured pairs](/payment-ticket-contrastes) (`npm run test:payment-ticket-contrast`).