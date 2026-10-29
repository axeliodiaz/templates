---
pageClass: logo-guide
---
<script setup>
import LogoUsageDemo from './.vitepress/theme/LogoUsageDemo.vue'
</script>

# Logo

A logo identifies a product or organization. It is not automatically a button or a home link. Use an authorized asset, preserve its proportions and choose the wordmark or symbol that remains recognizable at the available size. A familiar mark does not establish affiliation, ownership or permission to reuse it.

## Try form, size and link semantics

<LogoUsageDemo />

Choose wordmark, symbol or circular symbol at 32/40/56px. The original fictitious Sample mark can be a real local anchor or a non-interactive named image. Activate the linked version to reach Local example home and increment a local count. Reset restores the initial controls and count. Nothing leaves this page or uses Felix's brand assets.

## How to use it

1. Use a brand asset only with permission and follow that brand's usage rules. Do not infer a reuse license from a gallery preview.
2. Preserve intrinsic aspect ratio. Set a dimension and let the other scale naturally; do not stretch a wordmark into a square.
3. Choose semantics from behavior. Use an anchor with a real destination for navigation, not a clickable span or a button masquerading as a link.
4. Name a linked logo by destination, such as Product home. Give an informative non-interactive mark a suitable text alternative, and hide it only when the same nearby text already provides that meaning.
5. Test recognition, contrast and clear space at the smallest size. A compact symbol may work better than an unreadable full wordmark, but only when the audience can identify it.
6. Keep branding separate from loading or confirmation. A logo appearing does not prove a login, payment or remote service succeeded.

## Anatomy and actual API

`LogoUsageDemo.vue` has no props or emits. Local refs are `form` (wordmark/symbol/circular), `height` (32/40/56), `linked` and `arrivals`. Reset restores wordmark/40/linked/zero. The same presentation sits inside a dynamic anchor or span. The anchor points to the actual local #sample-logo-home target and counts activation; the span has role=img and a brand name. The inner art is aria-hidden to avoid duplicate names.

The mark is original styled text, not an external SVG/image asset. Symbols use a square aspect ratio; the wordmark uses natural text width. No timers, requests, subscriptions or global listeners need cleanup. Reset changes local state, not browser history or URL fragments from prior anchor navigation.

```vue
<script setup>
import LogoUsageDemo from './.vitepress/theme/LogoUsageDemo.vue'
</script>
<template><LogoUsageDemo /></template>
```

Suggested production data, not a package contract:

```ts
type BrandMark = {
  assetUrl: string
  alternativeText: string
  intrinsicWidth: number
  intrinsicHeight: number
  destination?: string
  authorizedUse: boolean
}
```

A production integration must supply authorized assets, actual dimensions and a verified destination. Decorative assets next to identical text should not repeat that name. A named image and a link are different contracts, not interchangeable CSS variants.

## States and variants

| Variant/state | Behavior |
|---|---|
| Wordmark | Original Sample text at a height-proportional font size. |
| Symbol/circular | Original s in a square/circular frame, not a source asset. |
| 32/40/56px | Local container heights, not a package size prop claim. |
| Linked | Native anchor, named Sample example home, keyboard reachable. |
| Non-interactive | Named role=img span, no link or click consequence. |
| Reset | Restores initial controls/count; does not erase prior fragment history. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Logo](/felix/components/atoms#logo) | Static fx-logo text and empty fx-logo-symbol/fx-logo-circle spans. CSS supplies a generated f for symbols. These are not imported image assets, home links or click handlers; standalone symbol spans do not include an explicit accessible name. |
| [Felix CoinLoader](/felix/components/atoms#coinloader) | Separate decorative waiting visual. Logo identity and loading lifecycle are different responsibilities. |

Felix prose names @felix/ui and type values logotype/symbol/symbol-circular, with height styling. Those are design-source usage claims, not verified installed exports here. This guide's form values and Sample art are an isolated original teaching API, not a Felix asset copy or package adapter.

## Motion, accessibility and checks

Only linked presentation lifts 2px on hover with a 150ms transition. Reduced motion removes the transition and transform; semantics and local navigation still work. No logo spins or pulses automatically. Focus indication belongs to the anchor, not to the decorative art. The non-interactive mark is not a keyboard stop.

Test every form/height, preserved proportions, link versus image roles, exact accessible name, real local destination, Enter activation, reset and reduced motion. Check mobile wrapping and image/asset failures when integrating a real file. A failed asset must not erase a linked logo's destination name. Verify permission and current brand rules separately before publishing actual third-party assets.

<style>
@media(max-width:700px){.logo-guide .vp-doc table,.logo-guide .vp-doc tbody,.logo-guide .vp-doc tr,.logo-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.logo-guide .vp-doc thead{display:none}.logo-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.logo-guide .vp-doc td{overflow-wrap:anywhere}.logo-guide .vp-doc tr{margin-bottom:12px}}
</style>
