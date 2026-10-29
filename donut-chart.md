---
pageClass: donut-chart-guide
---
<script setup>
import DonutChartUsageDemo from './.vitepress/theme/DonutChartUsageDemo.vue'
</script>

# Donut chart

A donut compares a few nonnegative, mutually exclusive parts of one complete total. Slice angle is each count divided by that total; the hole can show the denominator. Use straight bars for precise ranking or many similar values. Independent progress percentages belong in [radial bars](/radial-bar-chart), not slices of a shared whole. Hierarchical shares need a sunburst or treemap rather than an unexplained second ring.

## Try counts and a shared denominator

<DonutChartUsageDemo />

Switch A/B, One nonzero and All zero, then select a category. A totals 100; B totals 200, so a count of 30 means 30% in A but 15% in B. Selection only highlights a category: it does not remove other categories or change the denominator. One nonzero draws one complete circle and no zero slices. All zero shows a neutral track, total 0 and undefined shares, never a fabricated 100% split. Loading/Empty withhold graph/table; Ready restores choices. Reset returns A/Core/ready. All changes are local.

## How to use it

1. Define the whole and its unit. These are counts in exclusive Core/UI/Assets/Other categories, not overlapping tags, averages or independent target percentages.
2. Compute the denominator from the same records and filters as every slice. Display it; do not combine selected counts with an old total.
3. Keep a stable order and start angle. Here Core starts at top, categories continue clockwise and zeros consume no angle.
4. Prefer few slices with exact labels/table. Narrow slices are hard to compare; aggregate a meaningful Other category or switch to bars rather than hide categories silently.
5. Separate selection from filtering. Selecting here preserves the whole. A real filter must disclose its changed denominator and whether percentages refer to original or filtered records.
6. Treat zero total and missing data differently. Zero counts are known observations; absent records are Empty. No positive total means share is undefined, not 0% or 100%.
7. Avoid decorative gaps and rounded caps when exact angular encoding matters. This new controller uses a continuous ring with butt caps and exact circumference math.

## Anatomy and actual API

`DonutChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and the root element. A counts 40/30/20/10; B 10/20/30/140; single 0/100/0/0; zero 0/0/0/0. Categories retain the same IDs by fixed index. No data fetch, filter or persistence exists.

The 320×215 SVG has center 160,96 and radius 68, stroke 22. Circumference C=2π×68. For total T>0, category i uses fraction value[i]/T, dash length C×fraction and gap C×(1−fraction); offset is−C×sum(previous values)/T. Rotation −90° starts at top. Full share 1 uses dash C/gap 0; zeros create no segment element. Selection raises opacity/stroke to 26 but never changes centerline length or angle. The neutral track remains for zero total.

```vue
<script setup>
import DonutChartUsageDemo from './.vitepress/theme/DonutChartUsageDemo.vue'
</script>
<template><DonutChartUsageDemo /></template>
```

A possible host contract, not implemented props:

```ts
type DonutPart = { id: string; label: string; count: number | null }
type DonutModel = { unit: string; parts: DonutPart[]; selectedId: string | null }
```

Validate finite, nonnegative counts, unique IDs and category exclusivity. Reject or explicitly classify missing counts before computing the denominator; null must not quietly become zero. Guard total overflow. Percentages should be calculated from raw counts, not rounded labels; rounded labels may not add to 100. Arbitrary inputs, sorting, drilldown, hidden-category filters, signed values and asynchronous errors are not implemented here.

Buttons select on focus/activation with one pressed state. Dataset/state changes retain selected index, even if that category becomes zero. Its zero count and 0.0% remain readable when total is positive. At total zero all percentages are undefined. Table, center and status share the same computed total; displayed percentages use one decimal.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Rounded donut specimen, fixed four shares. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not independent donut APIs. |
| [Bar chart](/bar-chart), [Radial bar chart](/radial-bar-chart) | Precise magnitude comparison or independent completion, not shares of one total. |

ChartGallery declares only `language` String default lustro and renders the full collection. No donut-only, counts, categories, total or selected-category prop and no selection emit exists. A/B and Ready/Loading/Empty are gallery-global; native donut shares remain 40/30/20/10 for both datasets. Readout names are Core/UI/Assets/Other, but the separate keyboard/touch controls say Item 1–4. Focus/mouseenter on circles and focus/click on those buttons change selection, which persists without mouseleave reset.

Native circles center 160,98, radius 58 and width 21. `ringLengths` is share/100×2π×58, but actual dash length subtracts 25; gaps use 365−ringLength+25, offsets use cumulative share×365, and rotation is−90°. Rounded caps soften the ends. This is a styled, gapped specimen, not exact continuous angular coverage. The center shows selected share/name, not a total count despite the card description. No source count denominator is provided. It would be wrong to present these fixed shares as computed from the unrelated A/B primary-series sum.

This guide's count-derived denominator, B total 200, single/zero fixtures, complete-circle handling, neutral zero track, exact table and continuous butt-cap segments are original additions, not native controls. Do not claim a third-party chart package API from these Vue/SVG specimens.

Manual Loading/Empty states are demonstrations, not requests. Show sample data restores ready. Shared Motion mounts on cards, refreshes after dataset/state changes and destroys on unmount; theme wrappers only change presentation.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Counts, denominator, slice fractions and labels update together. |
| One nonzero/all zero | One complete colored circle or neutral track with undefined shares. |
| Selection | One pressed button, wider/brighter ring segment and exact count/share status. |
| Loading/empty/reset | Withhold/recover values; reset A/Core/ready. |

The shared Motion engine fades transformed/dashed circle marks on entry and refresh, honoring reduced motion. Previous animations are stopped/restored by refresh; unmount destroys observers/listeners/controls. No invented intermediate percentages or animated count-up is used. Selection remains immediate. Native controls support keyboard/touch; exact text and pressed state supplement category colors. SVG describes the encoding and the table gives exact counts plus rounded shares. This is not screen-reader certification.

Check A/B totals and recalculated percentages, every segment's radius/dash/gap/offset and common start, single full circumference, omitted zero segments, all-zero undefined shares, selection without renormalization, loading/empty/recovery/reset, focus/Enter/Space, reduced motion, cleanup, graph/table/source-map mobile readability, actual filesystem body routes, overflow and console errors. A live adapter also needs null/nonfinite/negative/overflow validation, duplicate IDs, rounded-share totals, long labels, many categories, filters and stale/error cases.

<style>
@media(max-width:700px){.donut-chart-guide .vp-doc table:not(.dusage-data),.donut-chart-guide .vp-doc table:not(.dusage-data) tbody,.donut-chart-guide .vp-doc table:not(.dusage-data) tr,.donut-chart-guide .vp-doc table:not(.dusage-data) td{display:block;width:100%;box-sizing:border-box}.donut-chart-guide .vp-doc table:not(.dusage-data) thead{display:none}.donut-chart-guide .vp-doc table:not(.dusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.donut-chart-guide .vp-doc table:not(.dusage-data) td{overflow-wrap:anywhere}.donut-chart-guide .vp-doc table:not(.dusage-data) tr{margin-bottom:12px}}
</style>
