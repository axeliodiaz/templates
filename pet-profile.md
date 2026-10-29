---
pageClass: pet-profile-guide
---
<script setup>
import PetProfileUsageDemo from './.vitepress/theme/PetProfileUsageDemo.vue'
</script>

# Pet profile and cards

A pet profile card identifies one pet and summarizes a small amount of context. Use it to choose the right pet before showing details or care records. A name, portrait, age or status badge is not a verified identity, diagnosis or permission to access that pet's records. Stable IDs and the owner's authorized account matter more than visual resemblance.

## Try selection, species and name filtering

<PetProfileUsageDemo />

Select Kiara, Miso or Pip with the native card button to update the local detail panel. Filter by species or a case-insensitive trimmed name. Filtering never silently selects another pet; the current details remain, with an explanation when the selected card is filtered out. Zero matches gives recovery text. Reset restores all three cards and Kiara. No pet profile, care record, account, notification or booking changes.

## How to use it

1. Give each pet a stable identifier separate from its display name. Names are neither unique nor an account boundary.
2. Keep the card compact: identity, species/breed/age text and one clear status summary. Detailed care chronology belongs in a [care timeline](/care-timeline), not a crowded card.
3. Use a real link for navigation or a native button for a local selection. This example's button updates an adjacent panel and uses pressed state, not fake whole-card click behavior.
4. Keep filtering separate from selection and authorization. Hiding a card should not change the selected pet or grant access to a different one.
5. Label health/care status with its actual source and freshness in real products. A static green or overdue badge is not evidence that a vaccine is valid or care is needed.
6. Handle unavailable photos with a useful fallback. Here a decorative initial supports visible identity text; no outside image or pet photo is downloaded.
7. Compute age from a validated birth date only when the date and calculation boundary are known. This specimen uses static age text and does not claim to keep it current.

## Anatomy and actual API

`PetProfileUsageDemo.vue` has no props or emits. Fixed `pets` hold id/name/species/description/status/note/initial; `query`, `species` and `selected` are refs. `visible` filters the fixed list; `current` looks up the selected stable ID. Each local selection button has aria-pressed and controls the instance-scoped detail ID from `useId()`. This is a group of independent native buttons, not an ARIA tab list, radio group or grid widget.

```ts
type SamplePet = {
  id: string
  name: string
  species: string
  description: string // static breed/age wording
  status: string      // fictitious display text, not calculated health status
  note: string
  initial: string
}
// Local fixture shape, not an installed package API or clinical record schema.
```

```vue
<script setup>
import PetProfileUsageDemo from './.vitepress/theme/PetProfileUsageDemo.vue'
</script>
<template><PetProfileUsageDemo /></template>
```

Selection does not move focus unexpectedly; it remains on the button. A concise live status names the selected pet and match count. When the active card is filtered out, no remaining button falsely claims pressed state, while the detail panel states why it remains. All selections come from the fixed ID set; a real host must validate missing/deleted/unauthorized IDs rather than relying on this fixture's guaranteed lookup. No timers, subscriptions, listeners, requests or saved preferences exist, so no external cleanup is needed.

## States and layout

| Part/state | Behavior |
|---|---|
| Avatar/title | Decorative initial plus visible name; no color-only identity. |
| Context/status | Static specimen species/breed/age and explicit care-status text. |
| Selected card | One pressed button when selected ID is visible; shared details show that same ID. |
| Filtered selection | Selected details preserved and explained; no silent selection fallback. |
| No matches | Recovery instruction, not loss/deletion of the fixture. |
| Reset | Empty name, all species and Kiara selection. |
| Narrow view | Cards stack; details and source map wrap without horizontal scrolling. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Pawprint Pet profile and cards](/pawprint/components#pet-profile-and-cards) | Three static pp-card/pp-pet specimens: emoji avatar, name, breed/age and one badge. No selection, navigation, identity lookup, pet-data props or care-status calculation. |
| Pawprint pawprint.css | Shared card hover lift/shadow, avatar rotate/scale, yellow/blue/sage rings. The global reduced-motion rule removes transitions/animations, but it does not remove the hover transform itself. |
| [Pawprint form specimens](/pawprint/components#forms) | Separate static name/species/weight/date inputs; not bound to these cards or to a save API. |
| [Care timeline guide](/care-timeline) | Related care-entry/status workflow, intentionally separate from profile identity and card selection. |

Source prose mentions hover/focus/active/disabled states across the design language; the static profile card itself is not a native control and does not acquire keyboard behavior from that prose. The supplied ages and vaccine/overdue labels are illustrative, not refreshed records. This guide adds an original neutral controller using fictitious examples, without copying external portraits, creating real pet records or changing Pawprint specimens.

## Motion, accessibility and checks

Changed local details reveal with a 180ms fade and 4px vertical movement. Reduced motion removes it. Filtering and selection are immediate; no animation delays identity/status updates. Decorative initials are hidden from assistive technology, article names and visible headings identify pets, native labeled search/select/buttons support keyboard use, and statuses remain text. No profile editing, card drag, modal focus trap or screen-reader certification is claimed.

Check each selection against detail ID/name/status, exactly one pressed button when visible, trimmed/case-insensitive name filter, combined species/name filtering, zero matches and recovery, selected-outside-filter explanation, reset, Enter/Space activation, instance-scoped controls IDs, reduced motion, narrow card/detail/map readability and console errors. Real hosts additionally need ownership/permission checks, duplicate names, missing/deleted records, photo failures, date/age freshness and medical-source verification.

<style>
@media(max-width:700px){.pet-profile-guide .vp-doc table,.pet-profile-guide .vp-doc tbody,.pet-profile-guide .vp-doc tr,.pet-profile-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.pet-profile-guide .vp-doc thead{display:none}.pet-profile-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.pet-profile-guide .vp-doc td{overflow-wrap:anywhere}.pet-profile-guide .vp-doc tr{margin-bottom:12px}}
</style>
