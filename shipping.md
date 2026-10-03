<script setup>
import ShippingLabel from './.vitepress/theme/ShippingLabel.vue'
</script>

# Order shipping (Lustro)

A shipping-label flow inspired by [Bagus Fikri's "Order shipping process"](https://x.com/bagus_fikri/status/2106353621097222391). The reference shows an order page (Order-12567) with a "Create Shipping Label" modal on top: one card per package, a custom or carrier package choice, weight and dimensions, a price summary, a shipping date, a return address and a "Buy Shipping Label" action. This example rebuilds that structure as a reusable pattern. It is not a copy of the original product.

Dark glass panels, a soft indigo accent and Space Grotesk headings. All names, addresses, SKUs and prices are fictitious. Currency is USD.

## Create a label

Switch each package between custom and carrier, edit weight and dimensions, tick or untick the options, and watch the summary change. Buying a label only shows a confirmation here. Nothing is sent and no carrier is contacted.

<ShippingLabel language="lustro" />

## How to use it

- **Packing:** one card per package, headed by the item it holds. Custom packages take a name, type, total weight and L × W × H; carrier packages use fixed sizes at a lower rate.
- **Pricing:** each package shows its own shipping price. The summary adds them, subtracts any discount and shows one total, so the cost is clear before the purchase.
- **Dispatch:** pick the shipping date and decide whether the customer gets shipping info right away. The return address is shown read-only with an edit link.
- **Commit:** "Buy Shipping Label" stays disabled while any package has a missing weight or dimension. The reason appears as text above the buttons, not only as a color.

## Anatomy

| Part | Purpose |
|---|---|
| Order context | Dimmed order page behind the modal, so the label is clearly part of one order |
| Package card | Item, custom or carrier tab, name, type, weight, dimensions and saved-for-later option |
| Price per package | Updates as weight, size or package source changes |
| Summary | Subtotal, discount and total |
| Dispatch panel | Shipping date and customer notification |
| Return address | Where undeliverable parcels go |
| Footer actions | Cancel and Buy Shipping Label, plus a help link |

## Build notes

Keep weights in grams and sizes in millimeters in production, and convert only for display. Prices should come from the carrier's rate API, not from a client-side formula; the demo formula is only there to show live recalculation. Real products also need loading, rate-error, address-validation and label-printed states.

The shared `ShippingLabel.vue` owns this example. Supply `language="lustro"`; its scoped class tokens carry the language and the Felix dark-mode colors. Nothing here implies a carrier integration, payment, tracking number or persistence.
