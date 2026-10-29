---
pageClass: range-band-guide
---
<script setup>
import RangeBandUsageDemo from './.vitepress/theme/RangeBandUsageDemo.vue'
</script>

# Range band chart

A range band fills the interval between lower and upper bounds across an ordered axis. Use it for observed minimum/maximum, allowed operating ranges or another explicitly defined interval. Name what the bounds mean. A shaded band is not automatically a confidence interval, forecast or probability distribution. Use a single area for magnitude above a baseline, a stream for additive categories or separate lines for independent series.

## Try bounds, fill and exact values

<RangeBandUsageDemo />

Choose A/B or Zero center, select a month and hide/show fill. Solid upper and dashed lower boundaries remain when fill is off. The mark follows the selected upper bound; the live readout and native table expose both bounds. Zero center produces lower0/upper15, not a missing interval or a band with zero width. Loading/Empty withhold graph/table and make no request. Ready restores retained choices; Reset returns A, January, fill shown and ready. No records change.

## How to use it

1. Define the interval before drawing it. This example uses synthetic center±15, clipped to0–100. It is not observed min/max or a statistical estimate.
2. Align lower/upper values to the same ordered observation. Jan–Jun are six equally spaced fixtures, not parsed dates or elapsed-time intervals.
3. Require lower≤upper. Swapped bounds should be rejected or corrected by a documented rule, not silently painted as an ordinary band.
4. Use common units and scale. Both boundaries here share a fixed0–100 vertical domain. Band thickness is interval width, not a third additive quantity.
5. Keep both boundaries identifiable. Solid/dashed lines, labels and exact table values work without relying on color or hover.
6. Preserve missingness. A missing bound does not mean zero. A production adapter must define gaps instead of bridging incomplete intervals.
7. Explain interpolation. Straight segments between fixed observations are a visual choice, not measurements or probabilities between them. The catalogue uses cubic boundary curves instead.

## Anatomy and actual API

`RangeBandUsageDemo.vue` has no props or emits. Refs are `dataset`, `filled`, `selected` and `state`. Computed `primary` chooses centers A35/48/41/61/56/74, B42/36/55/48/72/64 or six zeros. `lower=max(center−15,0)` and `upper=min(center+15,100)`. The fixed fixtures stay within the intended domain. There is no arbitrary-data input validation.

X is40+48i and Y is170−1.4v in a320×210 SVG. The filled path follows upper bounds forward, then lower bounds backward, closing at the initial upper point. It does not return to a zero baseline unless lower actually equals zero. Independent polylines use the same arrays. Fill toggle removes only the band interior; both boundaries, mark, table and readout remain. The selected dot is on upper, not the interval midpoint.

```vue
<script setup>
import RangeBandUsageDemo from './.vitepress/theme/RangeBandUsageDemo.vue'
</script>
<template><RangeBandUsageDemo /></template>
```

A production host might use this data shape; it is not an implemented prop API:

```ts
type RangePoint = {
  timestamp: string
  lower: number | null
  upper: number | null
}
type RangeSeries = {
  unit: string
  boundsMeaning: string
  observations: RangePoint[]
}
```

Validate finite values, bound order, units, timestamp ordering/duplicates and missing pairs. If the interval is statistical, preserve its level, method and source; do not label any min/max band as95% confidence. If clipping is allowed, tell readers it occurred. This controller's clipping is only a documented fixture rule, not a safe universal ingestion policy.

Native month buttons select on focus or activation and expose pressed state. Dataset/state changes keep selected index and fill choice. Mark/readout/table all derive from bounds, not unrelated secondary data. No timers, listeners, subscriptions or external animation handles require manual cleanup. There is no custom arrow-key widget or business mutation.

## Source coverage and actual gallery behavior

| Source | Actual behavior and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix gallery](/felix/components/charts) | ChartGallery Min/max range band uses clipped synthetic bounds around primary fixtures and cubic paths. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Theme wrappers for the shared gallery, not separate range data APIs. |
| [Area chart](/area-chart), [Stream chart](/stream-chart) | Baseline magnitude and additive band thickness are distinct encodings, not interchangeable names for a range. |

ChartGallery declares only `language` String default lustro and renders the whole gallery. It has no range-only, series-data, bounds-meaning, selection or confidence-level prop and no selection emit. Dataset A/B and Ready/Loading/Empty affect all cards. The range card has no fill toggle. Its lower is max(primary−15,0), upper is min(primary+15,96), so its cap differs from this example's100. None of the A/B fixtures reach either upper cap, but a general adapter must not treat them as identical policies.

Source X is34+48i, Y is166−1.5v. Its filled band follows an upper cubic spline then a reversed lower spline and closes. Upper/lower edge paths and an upper-bound interactive dot use those bounds. Its range-specific readout reports min/max directly, unlike the default readout used by some other gallery cards. Dot focus/mouseenter and six month readout buttons select the card index; no mouseleave reset occurs. The names min/max describe generated fixture bounds, not measurements from a feed.

Global loading/empty are manual states, not requests; Show sample data returns the gallery to ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount; CSS path transitions are separate. The new isolated controller uses straight segments and a native exact table instead of claiming a reusable statistical service from the source specimen.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Six clipped synthetic intervals on the same scale. |
| Zero center | Lower0/upper15 at every month; valid interval, not empty. |
| Fill off | Both boundary lines, mark/readout/table retained. |
| Selected month | One pressed button, upper-bound mark and both values in text. |
| Loading/empty/reset | Values withheld or restored; reset A/January/fill/ready. |

SVG entrance fades over200ms on dataset/fill remount. Reduced motion removes it; readouts do not count through invented values. The SVG description points to both bounds in the exact table. Solid/dashed lines supplement color. Buttons, checkbox and selects are native keyboard controls; decorative dots add no tab stops. Three narrow data columns fit mobile widths while prose source maps stack. This is not screen-reader certification.

Check every A/B/zero interval against table/readout/upper mark, lower≤upper, exact path vertices and reversal/closure, both outlines retained with fill off, focus/Enter/Space, retained selection, state recovery/reset, reduced motion, axis/table/source-map readability, body links, overflow and console errors. A live feed needs negative/nonfinite data, swapped/missing bounds, zero-width ranges, clipped extremes, duplicate/uneven dates and stale/error cases too.

<style>
@media(max-width:700px){.range-band-guide .vp-doc table:not(.range-data),.range-band-guide .vp-doc table:not(.range-data) tbody,.range-band-guide .vp-doc table:not(.range-data) tr,.range-band-guide .vp-doc table:not(.range-data) td{display:block;width:100%;box-sizing:border-box}.range-band-guide .vp-doc table:not(.range-data) thead{display:none}.range-band-guide .vp-doc table:not(.range-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.range-band-guide .vp-doc table:not(.range-data) td{overflow-wrap:anywhere}.range-band-guide .vp-doc table:not(.range-data) tr{margin-bottom:12px}}
</style>
