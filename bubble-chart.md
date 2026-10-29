---
pageClass: bubble-chart-guide
---
<script setup>
import BubbleChartUsageDemo from './.vitepress/theme/BubbleChartUsageDemo.vue'
</script>

# Bubble chart

A bubble chart places paired observations on two quantitative axes and uses circle area for a third nonnegative quantity. Radius is not the quantity: doubling radius quadruples area. Use a [scatter plot](/scatter-plot) if only two measures matter, [bars](/bar-chart) for exact ranking, or a treemap for parts of one additive whole. Bubble size need not be a share of a total. Apparent association is not evidence of causation.

## Try a calibrated area scale

<BubbleChartUsageDemo />

Switch A/B and Zero and overlap, then select a record. X preparation/Y output retain fixed 0–100 domains; workload sizes use the same area scale across datasets. Zero fixture includes workload 0 at(0,0), represented by a small cross rather than a fabricated positive bubble. Items 3/4 have identical position/size but remain separate records. Loading/Empty withhold graph/table; Ready restores choices. Reset returns A/Item 1/ready. Nothing is requested or saved.

## How to use it

1. Pair all three measures by stable ID. Never sort X, Y and size independently.
2. Map area to the third quantity. Here radius=2√size, so area=4π×size in SVG units. Workload 100 has four times the area and twice the radius of 25.
3. Keep the area scale fixed across comparison datasets. Normalizing each dataset to its own largest bubble hides changes. Provide an explicit size key and exact values.
4. Define zero and missing separately. Zero size has no circle; a small cross preserves its valid X/Y observation. Missing size must not silently become zero or a minimum-radius dot.
5. Expose overlap. Large circles can hide small ones and duplicate coordinates cover records. Preserve exact position, disclose painter order and keep an external table/selector.
6. Keep selection separate from magnitude. Here outline/opacity changes, not radius or position. Decorative stroke can affect perceived area but is not workload.
7. Label axes and unit semantics. X/Y are independent linear scales; size is a third independent measure, not a denominator or conversion rate. For precise comparisons, use text or another chart.

## Anatomy and actual API

`BubbleChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and root element. IDs Item 1–6 remain paired by index. X/Y fixtures match [Scatter plot](/scatter-plot): A X 20/28/25/39/33/46, Y 35/48/41/61/56/74; B X 26/19/35/28/43/36, Y 42/36/55/48/72/64. Workload A 4/9/16/25/36/49; B 49/36/25/16/9/4. Edge pairs(0,0),(100,100),(50,50),(50,50),(0,100),(100,0) have sizes 0/100/25/25/4/1.

The 330×250 SVG maps X to 48+2.4x and Y to 200−1.6y. Plot bounds x 48–288/y 40–200; ticks 0/25/50/75/100 use those mappings. Radius=2√size with no minimum circle or per-dataset renormalization; maximum fixture 100 yields radius 20. SVG margins accommodate even boundary bubbles without clipping. Size 0 omits circle and draws a 6-unit cross at the true coordinate. Circle fill area, before decorative outline, is 4π×size. All circles render in fixed record order, so later ones may cover selected earlier ones; status/table preserve identity.

```vue
<script setup>
import BubbleChartUsageDemo from './.vitepress/theme/BubbleChartUsageDemo.vue'
</script>
<template><BubbleChartUsageDemo /></template>
```

Possible host contract, not implemented props:

```ts
type Bubble = { id: string; label: string; x: number | null; y: number | null; workload: number | null }
type BubbleScale = { xDomain: [number, number]; yDomain: [number, number]; radiusPerSqrtUnit: number }
```

Validate unique IDs, finite paired X/Y, finite nonnegative size, strictly increasing domains and explicit missing/out-of-range policies. Guard radius/area overflow and expand margins for large bubbles. This fixed controller has no arbitrary data, negative size, logarithmic area, size cap, sorting, jitter, aggregation, zoom, brush, overlap cycling or async error adapter. Do not silently clamp size or add a radius minimum that breaks proportional area.

Native buttons select on focus/activation with one pressed state; selected fixed index survives dataset/state. Table/status share the same pairs and size array. Selection preserves all records and geometry. Exact raw size is shown, not rounded radius as if it were the measure.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Bubble clusters specimen, index-sized circles. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not independent bubble scale/data APIs. |
| [Scatter plot](/scatter-plot), [Treemap](/treemap) | Equal-size paired observations or shared-whole rectangular area. |

ChartGallery declares only `language` String default lustro and renders the collection. No bubble-only, observations, size, radius-scale or selected-ID prop and no selection emit exists. Native bubble shares a branch with scatter. X=40+4.8×secondary, Y=166−1.5×primary; A/B updates those paired arrays but radius remains 10+3i, i 0–5, so radii 10/13/16/19/22/25. Readout calls that same radius expression size; it is not a separate workload series and does not use square-root area mapping.

Native axes have lines x 28–296/y 20–170, no numeric ticks or explicit domains; bottom label says secondary units(x), primary units(y). Opacity 0.4+0.1i follows index, not statistical weight. Focus/mouseenter circles and focus/click Jan–Jun buttons select persistent Node 1–6 readouts with X/Y and index-size. No mouseleave reset, size key, zero-size handling, arbitrary scale or exact table exists. It would be wrong to infer calibrated third-measure values from those radii or claim the source uses area-proportional size.

This guide's workload fixtures, square-root scale/key, zero cross, edge/overlap records, calibrated fixed axes and exact three-measure table are original additions. Global Ready/Loading/Empty is demonstration state; Show sample data restores ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount. Vue/SVG specimens and theme wrappers do not imply an installed third-party chart package.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Paired coordinates and workload area update on fixed scales. |
| Zero/overlap | No positive circle for zero; duplicate records remain in table/controls. |
| Selected record | One pressed button and outlined circle; radius/position unchanged. |
| Loading/empty/reset | Withhold/recover geometry/table; reset A/Item 1/ready. |

Shared Motion fades circles on entry/refresh through explicit fade markers, not growing them through invented workloads. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Exact values, size key, axis ticks, outline and native keyboard/touch controls supplement color; no hover is required. This is not screen-reader certification.

Check both datasets and edges exact X/Y/size pairings, circle positions/radii/area ratios, tick calibration, fixed scale across A/B, zero omission/cross coordinate, corner bounds, duplicate preservation, selection without radius/position changes, states/reset/keyboard/reduced motion/unmount, desktop/mobile graph/table/key/source-map pixels, filesystem routes, overflow and errors. A live adapter needs missing/nonfinite/negative/huge sizes, ID validation, dense data, long labels, sorting/filtering and stale/error policies.

<style>
@media(max-width:700px){.bubble-chart-guide .vp-doc table:not(.bbusage-data),.bubble-chart-guide .vp-doc table:not(.bbusage-data) tbody,.bubble-chart-guide .vp-doc table:not(.bbusage-data) tr,.bubble-chart-guide .vp-doc table:not(.bbusage-data) td{display:block;width:100%;box-sizing:border-box}.bubble-chart-guide .vp-doc table:not(.bbusage-data) thead{display:none}.bubble-chart-guide .vp-doc table:not(.bbusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.bubble-chart-guide .vp-doc table:not(.bbusage-data) td{overflow-wrap:anywhere}.bubble-chart-guide .vp-doc table:not(.bbusage-data) tr{margin-bottom:12px}}
</style>
