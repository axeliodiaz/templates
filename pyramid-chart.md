---
pageClass: pyramid-chart-guide
---
<script setup>
import PyramidChartUsageDemo from './.vitepress/theme/PyramidChartUsageDemo.vue'
</script>

# Pyramid chart

A tier pyramid arranges ordered levels from narrow top to wide base. First decide whether width is a measured quantity or only a hierarchy cue. This guide uses equal-height centered bars whose full width encodes capacity on one fixed scale. It is not a filled triangular area model, a population pyramid with two signed sides, or a funnel with sequential conversion. Prefer [bars](/bar-chart) for precise comparison; use a plain hierarchy list if tiers are only ordinal.

## Try ordered quantitative tiers

<PyramidChartUsageDemo />

Switch A/B, Equal tiers and All zero, then select Tier 4–1. A capacities 24/50/75/100; B 10/35/65/90. Both use the same 0–100 domain and width scale, not a new maximum per dataset. Equal tiers yields four equal rectangles, not a forced pyramid. Zero omits bars and marks the center without inventing width. Loading/Empty withhold SVG/table; Ready restores choices. Reset returns A/Tier 4/ready. Nothing runs or persists.

## How to use it

1. Define the quantitative meaning before shaping tiers. Here full width is capacity units. Tier number is an order label, not the value.
2. Use one common fixed scale and equal heights. Width is 2.4×value; centered edges are 160±width/2. The center is an alignment line, not the zero baseline of two separate measures.
3. Preserve tier identity and meaningful order. Do not sort capacities merely to manufacture a pyramid silhouette. Non-monotonic data may not look pyramidal; choose bars rather than distort values.
4. Do not infer containment or conversion. These fixtures are independent tier capacities, not overlapping customer populations or a stepwise funnel. A total/share or conversion denominator would need a different data contract.
5. Keep zero visible as a known value without giving it area. Equal tiers must stay equal. Missing records belong in a separate state.
6. Label exact units and expose a table. Centered bars do not share a left baseline, so small differences are harder to compare than aligned bars.
7. Avoid tapered slices for linear width claims. A trapezoid's area depends on both boundaries and height; it needs a separately defined encoding, not cosmetic tapering of these values.

## Anatomy and actual API

`PyramidChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and root element. Fixed order Tier 4/3/2/1. A 24/50/75/100, B 10/35/65/90, ties 40/40/40/40, zero 0/0/0/0. These synthetic capacities do not sum to a meaningful whole.

The 320×250 SVG centers bars at x 160. Full width=2.4v, x=160−1.2v, y=28+44i, height 28. Thus each bar is symmetric and has equal height; full width 240 represents 100, not each half. Vertical guides at 40/160/280 show bounds/center, not percentage ticks. Exact labels sit above bars; a zero vertical presence marker has no quantitative width. Selection changes opacity/outline, not geometry. Corners are square so nominal rectangle area remains proportional to width at constant height.

```vue
<script setup>
import PyramidChartUsageDemo from './.vitepress/theme/PyramidChartUsageDemo.vue'
</script>
<template><PyramidChartUsageDemo /></template>
```

Possible host data, not implemented props:

```ts
type CapacityTier = { id: string; label: string; capacity: number | null; rank: number }
type CapacityScale = { minimum: 0; maximum: number; unit: string }
```

Validate unique IDs, stable rank, finite nonnegative capacities, a positive domain maximum, and an explicit overflow/missing-value policy. This controller only has bounded 0–100 fixtures; it does not silently clamp live values or infer a maximum. Arbitrary tiers, negative/signed population pyramids, nested populations, non-monotonic adapters, conversion calculations and asynchronous requests/errors are not implemented.

Native buttons select on focus/activation with one pressed state. Fixed tier index persists through dataset/state changes. Status and table use the same capacities/width formula; full SVG width is shown to one decimal. State changes never rescale or reorder. No request, timer or stored data edit exists.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Tier pyramid specimen, hardcoded centered rounded rectangles. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not separate tier/capacity APIs. |
| [Bar chart](/bar-chart), [Treemap](/treemap) | Aligned quantitative ranking or additive hierarchy area, different tasks. |

ChartGallery declares only `language` String default lustro and renders all cards. No pyramid-only, tiers, values, scale, selected-tier or conversion prop and no selection emit exists. Global A/B does not change the pyramid. Ready/Loading/Empty is global demonstration state; Show sample data restores ready.

Native pyramid shares a branch with funnel, but pyramid rect width is 48+50i, x 160−(24+25i), y 18+40i, height 28 and rounded corners 10. Widths 48/98/148/198 do not use the displayed value array 24/50/75/100 as a formula; only the first equals 2×value exactly. The four text labels are Tier 4/3/2/1. Readout says Tier 4..1 and 24/50/75/100 units, while focusable group aria-labels say Stage 1..4 and percent. Those units/percent/rank distinctions are inconsistent; do not promote them into a data model or infer percentages of a whole.

Native focus/mouseenter groups and focus/click Item 1–4 buttons select a persistent readout. No mouseleave reset, source denominator, arbitrary tier adapter, exact scale/axis, total or conversion calculation exists. The funnel sibling uses left-aligned widths from another fixed array and is not a toggle mode on the pyramid.

This guide's consistent capacity units, computed fixed-domain widths, equal/zero fixtures, exact table and symmetry rules are original additions. Shared Motion mounts on gallery cards, refreshes after dataset/state and destroys on unmount. Vue/SVG specimens and theme wrappers do not imply an installed third-party chart package.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Same fixed scale; labels, widths and table update together. |
| Equal/zero | Equal values stay equal; zero has no filled bar. |
| Selected tier | One pressed button and outlined opaque bar; geometry unchanged. |
| Loading/empty/reset | Withhold/recover SVG/table; reset A/Tier 4/ready. |

Shared Motion fades bars on entry/refresh through explicit fade markers, avoiding growth that implies intermediate capacities. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Exact labels/table, outline and native keyboard/touch buttons supplement color. No hover is required. This is not screen-reader certification.

Check A/B/ties/zero exact capacities, x/y/width/height and center symmetry, fixed-domain comparison, zero omission/markers, selection without geometry changes, state retention/recovery/reset, focus/Enter/Space, reduced motion/unmount, chart/table/source-map desktop/mobile pixels, filesystem body routes, overflow and console errors. Live adapters also need missing/nonfinite/negative/overflow data, duplicate IDs, long labels, many tiers, non-monotonic values and stale/error states.

<style>
@media(max-width:700px){.pyramid-chart-guide .vp-doc table:not(.pyusage-data),.pyramid-chart-guide .vp-doc table:not(.pyusage-data) tbody,.pyramid-chart-guide .vp-doc table:not(.pyusage-data) tr,.pyramid-chart-guide .vp-doc table:not(.pyusage-data) td{display:block;width:100%;box-sizing:border-box}.pyramid-chart-guide .vp-doc table:not(.pyusage-data) thead{display:none}.pyramid-chart-guide .vp-doc table:not(.pyusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.pyramid-chart-guide .vp-doc table:not(.pyusage-data) td{overflow-wrap:anywhere}.pyramid-chart-guide .vp-doc table:not(.pyusage-data) tr{margin-bottom:12px}}
</style>
