---
pageClass: stream-chart-guide
---
<script setup>
import StreamChartUsageDemo from './.vitepress/theme/StreamChartUsageDemo.vue'
</script>

# Stream chart

A stream chart shows changing category amounts as the thickness of stacked bands around a moving baseline. It can reveal composition and broad patterns over an ordered sequence. It is poor for precise comparison of categories without a common baseline. Use a zero-based stack to read the total from top height, lines for independent trends or a table when exact values matter. A band below the visual center does not mean negative data.

## Try centered and zero-based layouts

<StreamChartUsageDemo />

Switch A/B, Centered stream/Zero-based stack and the selected month. Each band's thickness and exact values stay unchanged when the baseline moves. A vertical selection mark spans both categories. All zero is valid data with six zero rows, not Empty. Loading/Empty withhold the graph/table, retain local choices and make no request. Ready restores them; Reset returns A, centered, January and ready. No records change.

## How to use it

1. Use aligned observations and a shared unit. These six equally spaced monthly labels are fixtures, not parsed dates or unequal intervals.
2. Choose a baseline deliberately. Here centered means `lower = −total/2`; it is a simple symmetric layout, not a wiggle-optimized stream algorithm.
3. Read thickness, not absolute position. Alpha thickness is its value and Beta thickness is its value. The centered top edge is half the total, not the full total.
4. Keep category order stable. Alpha stays below Beta. Reordering can make a category appear to change when only its neighbors moved.
5. Supply exact values and totals. Buttons and the table avoid reliance on hover or color. Solid/dashed edges name both categories.
6. Keep zero separate from missing. A zero-total month has zero thickness. An unknown observation needs a gap policy, not fabricated zero.
7. Avoid unsupported negatives or normalizing by accident. This example has nonnegative absolute units, not percentages. A production negative series needs a different signed stacking policy.

## Anatomy and actual API

`StreamChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `baseline`, `selected` and `state`. Computed Alpha values are A20/28/25/39/33/46 or B26/19/35/28/43/36. Beta is A15/20/16/22/23/28 or B16/17/20/20/29/28. All zero replaces both with six zeros. Totals are the pointwise sums: A35/48/41/61/56/74 and B42/36/55/48/72/64.

Centered lower is `−total/2`; zero-stack lower is0. Middle is lower+Alpha and upper is middle+Beta. Each closed path follows its upper boundary forward and lower boundary backward. Straight segments are interpolation, not measured intermediate values. X is40+48i. Centered Y is110−v; zero-stack Y is170−v. Both use one SVG unit per data unit, so changing baseline never rescales thickness. The SVG is320×210 and these fixed fixtures fit. There is no automatic domain fitting, smoothing, percentage normalization or wiggle layout.

```vue
<script setup>
import StreamChartUsageDemo from './.vitepress/theme/StreamChartUsageDemo.vue'
</script>
<template><StreamChartUsageDemo /></template>
```

A production host might define this contract; it is not implemented props:

```ts
type StreamPoint = {
  timestamp: string
  alpha: number | null
  beta: number | null
}
type StreamSeries = {
  unit: string
  baseline: 'centered' | 'zero'
  observations: StreamPoint[]
}
```

Validate finite nonnegative values, units, ordering, duplicate timestamps and aligned missing data before stacking. Do not subtract uncertain categories from a total or treat missing categories as zero without a domain rule. A real adapter needs an explicit domain and clipping policy for values outside the plotting bounds.

Month buttons select on focus or activation and expose pressed state. Dataset, baseline and state changes retain the index. Paths, selected span, live readout and table derive from the same arrays. There are no timers, subscriptions or external animation handles to clean up, and no custom keyboard widget is claimed.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix gallery](/felix/components/charts) | ChartGallery Stream wave specimen uses overlapping spline regions, not this centered additive layout. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Theme wrappers for the shared gallery, not separate data or layout APIs. |
| [Area chart](/area-chart), [Line chart](/line-chart) | Single-baseline magnitude and independent trend families. A stream's moved baseline is a separate encoding choice. |

ChartGallery declares `language` String default lustro and renders the entire gallery. There is no stream-only, series-data, baseline, stacking or selection prop and no selection emit. Dataset A/B and Ready/Loading/Empty affect the whole gallery. The Stream wave card has no layout toggle. Its lower boundary is secondary×.25+18, middle is secondary×.65+28 and upper is primary×.8+20. Both filled regions start at the same lower boundary, so they overlap. Their thickness is not the sum of independent category values, and they are not centered around zero.

The source uses cubic splines with X34+48i and Y166−1.5v. Primary/secondary A/B fixtures are transformed into boundaries. The text readout rounds those boundary values; it does not report additive Alpha/Beta amounts or totals. Interactive upper dots sit at the transformed upper boundary, while their accessible labels name the original primary/secondary fixtures. This guide documents those distinctions rather than implying that the source implements a general stream layout. Its new local example instead stacks two explicit categories with an exact table.

Source month readout buttons and dot focus/mouseenter select an index. Selection persists until another point is picked. Global empty's Show sample data restores ready; no request runs. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount; CSS path transitions are separate. Do not infer totals, a centered algorithm or a reusable data API from the specimen title.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| Centered/zero stack | Same category thickness and order, different baseline only. |
| A/B/zero | Paths, selected span, readout and exact table update together. |
| Selected month | One pressed button and a vertical span across both bands. |
| Loading/empty | No graph/table, descriptive local status, controls available. |
| Reset | A, centered, January and ready. |

The SVG fades over200ms on dataset/baseline remount; reduced motion removes it. Readouts never count through invented values. Text explains that position below center is not negative. Solid/dashed edges supplement color and the captioned native table supplies exact values. Month buttons and selects are standard keyboard controls; paths are not extra tab stops. Four narrow table columns fit at mobile width, while prose source maps stack. This is not screen-reader certification.

Check both datasets and zero against every table/readout, pointwise totals, path vertices and shared boundaries, identical band thickness under both baselines, unchanged order, focus/Enter/Space, selected span, retained state, reset, reduced motion, narrow legend/table/source-map readability, body links, overflow and console errors. A live feed also needs gaps, negative/nonfinite values, mismatched observations, changing units and stale/error cases.

<style>
@media(max-width:700px){.stream-chart-guide .vp-doc table:not(.stream-data),.stream-chart-guide .vp-doc table:not(.stream-data) tbody,.stream-chart-guide .vp-doc table:not(.stream-data) tr,.stream-chart-guide .vp-doc table:not(.stream-data) td{display:block;width:100%;box-sizing:border-box}.stream-chart-guide .vp-doc table:not(.stream-data) thead{display:none}.stream-chart-guide .vp-doc table:not(.stream-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.stream-chart-guide .vp-doc table:not(.stream-data) td{overflow-wrap:anywhere}.stream-chart-guide .vp-doc table:not(.stream-data) tr{margin-bottom:12px}}
</style>
