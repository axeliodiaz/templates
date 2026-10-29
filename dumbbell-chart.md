---
pageClass: dumbbell-chart-guide
---
<script setup>
import DumbbellChartUsageDemo from './.vitepress/theme/DumbbellChartUsageDemo.vue'
</script>

# Dumbbell chart

A dumbbell chart compares two values for each category on one scale. A connector makes the gap visible; endpoint labels tell you what the pair means. Use it for plan/actual or before/after with consistent units. It is not an interval estimate, a time-series path or a part-to-whole chart. A line chart is better for many time observations; grouped bars emphasize magnitudes rather than paired gaps.

## Try paired values and ties

<DumbbellChartUsageDemo />

Switch A/B and select a class. Outline is planned, solid is actual, and Δ is actual minus planned. Actual can land left or right of plan. Equal endpoints preserves both markers as a ring and center dot, with a zero-length connector and exact zero difference. Loading/Empty withhold graph/table, not replace observations with zeros. Ready restores choices. Reset returns A, Ride and ready. Nothing is requested or saved.

## How to use it

1. Define the comparison and units. Both endpoints here measure attendees for the same class; they are not two unrelated measures with separate scales.
2. Use the same domain and mapping for both ends and every category. This fixture stays at0–50 through dataset changes. A nonzero domain can be valid for paired positions, but label it and avoid implying bar lengths from zero.
3. Keep endpoint identity stable when the order reverses. Planned is always outlined, actual always solid. Leftmost does not mean planned.
4. Show the signed difference in text. A gap length is unsigned; Δ supplies direction. Positive is not universally good, so this example does not label it success.
5. Handle ties without inventing a visible gap. Different marker radii preserve identity here. Missing endpoints need a separate policy, not a fabricated zero.
6. Keep category order predictable. This example never sorts. A production gap-sort must preserve selected IDs and explain the order.
7. Supply exact values and keyboard selection. Hover-only endpoints leave touch and keyboard users without the comparison.

## Anatomy and actual API

`DumbbellChartUsageDemo.vue` exposes no props or emits. Its local refs are `dataset`, `state` and `selected`. Labels are Ride/Power/Endurance/Sprint. Planned stays25/35/40/30; actual is A21/38/32/34, B27/31/43/28, or the same as planned for Equal endpoints. Deltas are computed, never separately stored.

Both endpoints use X80+4v and Y35+35i in a320×210 SVG. Ticks label0/25/50. The connector runs from planned X to actual X, even when actual is lower. The planned circle has radius7 and the actual circle radius4, drawn second. At equality both centers coincide; the ring remains visible around the filled center. Selection changes row opacity, label weight and connector width, not positions or values.

```vue
<script setup>
import DumbbellChartUsageDemo from './.vitepress/theme/DumbbellChartUsageDemo.vue'
</script>
<template><DumbbellChartUsageDemo /></template>
```

A possible host contract, not implemented props:

```ts
type Pair = { id: string; label: string; planned: number | null; actual: number | null }
type PairedSeries = { unit: string; domain: [number, number]; pairs: Pair[] }
```

Validate finite values, stable unique IDs, same units and an increasing domain containing both ends. Define out-of-domain and missing-end behavior before drawing. Do not silently clamp, swap identities or pair unrelated records by array position. Long labels, many rows and negative values need a host layout/domain policy; this fixed four-row fixture does not provide them.

Native class buttons select on focus or activation and expose pressed state. Dataset/state changes retain the selected index; this is safe only because the fixture order never changes. Readout and exact table use the same arrays as SVG. No custom arrow-key widget, timer, listener, subscription or external animation handle is created.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | ChartGallery Dumbbell plan/actual card with four synthetic classes. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Theme wrappers of the same gallery, not separate paired-data APIs. |
| [Bar chart](/bar-chart), [Range chart](/range-band-chart) | Magnitude and min/max encodings, not interchangeable endpoint meanings. |

ChartGallery declares only `language` String default lustro and renders its whole collection. It has no dumbbell-only, pairs, domain or selected-class prop and no selection emit. A/B and Ready/Loading/Empty are gallery-global. There is no sorting or endpoint toggle on this card.

Source classNames and planned/actual arrays match this guide's A/B fixtures. Its source centers use X80+4v and Y35+35i, both markers radius6, outlined planned drawn before filled actual. That means an equal-valued pair would cover the outline; the source has no tie fixture. This isolated example adds Equal endpoints, a larger planned ring, explicit computed deltas and a native exact-value table. These additions are not claims about the native card.

Source groups select on mouseenter or focus, with aria labels naming both values. Native readout buttons also select each class; the visible readout says plan/actual attendees. Selection persists until another class is picked, with no mouseleave reset. The source does not calculate or display signed Δ. All fixtures are synthetic, not fetched attendance or editable plans.

Manual loading/empty controls are not network activity. Show sample data restores global ready. Shared Motion mounts on cards, refreshes on dataset/state change and destroys on unmount; CSS transitions are separate. Wrapper theme changes do not imply a universal installed chart package or data adapter.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Same plan and scale; actual, signed gaps, marks and table update together. |
| Equal endpoints | Zero gap; ring and center dot remain distinguishable. |
| Selected class | One pressed button, heavier label/connector and exact status. |
| Loading/empty/reset | Values withheld or restored; reset A/Ride/ready. |

SVG entrance fades over200ms when the dataset remounts. Reduced motion removes it. Values do not animate through invented attendance. Outline/solid, text and signed differences avoid color-only meaning. SVG describes the encoding; native controls handle keyboard input and the table exposes exact pairs. This is not screen-reader certification.

Check A/B/equality values against the table and signed status, exact endpoint/connector coordinates, reversal, tie overlap, selection retention, focus/Enter/Space, loading/empty/recovery/reset, reduced motion, label/legend/table/source-map readability, body links, overflow and console errors. A real adapter also needs missing endpoints, nonfinite/out-of-domain values, duplicate IDs, sorting/filtering, long labels, many rows and stale/error cases.

<style>
@media(max-width:700px){.dumbbell-chart-guide .vp-doc table:not(.dbusage-data),.dumbbell-chart-guide .vp-doc table:not(.dbusage-data) tbody,.dumbbell-chart-guide .vp-doc table:not(.dbusage-data) tr,.dumbbell-chart-guide .vp-doc table:not(.dbusage-data) td{display:block;width:100%;box-sizing:border-box}.dumbbell-chart-guide .vp-doc table:not(.dbusage-data) thead{display:none}.dumbbell-chart-guide .vp-doc table:not(.dbusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.dumbbell-chart-guide .vp-doc table:not(.dbusage-data) td{overflow-wrap:anywhere}.dumbbell-chart-guide .vp-doc table:not(.dbusage-data) tr{margin-bottom:12px}}
</style>
