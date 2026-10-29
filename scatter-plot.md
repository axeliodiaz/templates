---
pageClass: scatter-plot-guide
---
<script setup>
import ScatterPlotUsageDemo from './.vitepress/theme/ScatterPlotUsageDemo.vue'
</script>

# Scatter plot

A scatter plot places paired observations on two quantitative axes. Position reveals association, clusters and outliers; equal-size dots do not encode a third measure. A visual association alone is not evidence of causation. Use a line chart for ordered change over time, bars for categorical magnitudes, or a bubble chart when size has an explicitly calibrated third quantity. A single pair of axes is not a scatterplot matrix of many variable pairs.

## Try paired records and overlapping coordinates

<ScatterPlotUsageDemo />

A/B change six paired X preparation/Y output observations. Both axes retain independent fixed 0–100 domains. Edges and overlap places records at four corners plus two distinct records at(50,50). Both overlapping records stay selectable in controls/table; there is no jitter, deletion or aggregation. Loading/Empty withhold SVG/table; Ready restores choices. Reset returns A/Item 1/ready. These are local fixtures with no requests or stored changes.

## How to use it

1. Pair values by stable record ID. Never sort X and Y arrays independently; that fabricates observations and associations.
2. Name axes, units, domains and scale types. Here both are linear 0–100, but horizontal 240 and vertical 160 SVG units differ. A 45° screen slope does not mean equal unit change.
3. Use equal marker size unless another quantity is intended. Dot radius here is always 5, including selected records; outline/opacity conveys selection without changing position or size.
4. Keep axes stable across comparison datasets. Auto-scaling each dataset can conceal displacement or magnify small differences. Explain clipping/overflow before accepting live records.
5. Account for overlap. Exact duplicates can cover each other; this guide preserves their true coordinates and exposes separate rows/buttons. Dense data may need transparency, aggregation or a disclosed jitter policy.
6. Distinguish missing from zero. Zero is a valid coordinate at an axis boundary; a missing pair must not become(0,0). Empty records and all-zero coordinates are different states.
7. Treat visual patterns cautiously. These synthetic fixtures calculate no correlation, regression, confidence interval or causal conclusion. Statistical work needs sample provenance and appropriate methods.

## Anatomy and actual API

`ScatterPlotUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and root element. IDs Item 1–6 stay paired by fixed index. A X 20/28/25/39/33/46 with Y 35/48/41/61/56/74; B X 26/19/35/28/43/36 with Y 42/36/55/48/72/64. Edges pairs are(0,0),(100,100),(50,50),(50,50),(0,100),(100,0).

The 330×250 SVG plot rectangle spans x 48–288 and y 40–200. X maps 48+2.4x; Y maps 200−1.6y in downward SVG coordinates. Ticks 0/25/50/75/100 use those same mappings. Dots have radius 5 and keep a margin inside the SVG even at corners. No connecting lines imply order; painter order remains stable and later records may cover earlier ones. Selection adds an outline/opacity without moving or enlarging dots; overlapped selected positions can still be covered, so status/table are authoritative for identity.

```vue
<script setup>
import ScatterPlotUsageDemo from './.vitepress/theme/ScatterPlotUsageDemo.vue'
</script>
<template><ScatterPlotUsageDemo /></template>
```

Possible host data, not implemented props:

```ts
type Observation = { id: string; label: string; x: number | null; y: number | null }
type Axis = { label: string; unit: string; domain: [number, number]; scale: 'linear' | 'log' }
```

Validate unique IDs and finite pairs; define whether incomplete pairs are excluded with a count or shown separately. Validate strictly increasing domains, log positivity and an explicit out-of-range policy. This controller accepts only fixed bounded fixtures, not arbitrary data or log scales. No sorting, brush/lasso, zoom, filtering, tooltip-only interactions, overlap cycling, regression or async error adapter is implemented.

Buttons select on focus/activation with one pressed state. Fixed record index persists across dataset/state changes. Table/status use the same paired objects as geometry. Selection never filters, renormalizes or reorders. No request, subscription, timer or stored edit exists.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery card titled Scatter matrix, actually one scatter plot. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not independent scatter/matrix APIs. |
| [Line chart](/line-chart), [Bar chart](/bar-chart) | Ordered trends or categorical magnitudes rather than paired observations. |

ChartGallery declares only `language` String default lustro and renders the full collection. No scatter-only, observations, axes, domains or selected-ID prop and no selection emit exists. Native A/B changes primary and secondary arrays. Scatter shares a branch with bubble; scatter radius is 5, while bubble radius is 10+3i, not a calibrated arbitrary third measure.

Native X position is 40+4.8×secondary; Y is 166−1.5×primary. A/B paired values are the same six pairs as this new controller's A/B, but mappings differ. Axis lines run x 28–296 at y 170 and y 20–170 at x 28; no numeric tick labels or explicit domain are drawn. Bottom label says secondary units(x), primary units(y). Because marks and axis-line endpoints are not one declared scale, do not infer fixed 0–100 domains from those lines. The native points have opacity 0.4+0.1i, not a second series or statistical weight.

Native focus/mouseenter dots and focus/click Jan–Jun readout buttons change selection. Readout calls them Node 1–6 with X secondary/Y primary, so month-button identity and node labels are not a real record schema. Selection persists without mouseleave reset. Ready/Loading/Empty is gallery-global demonstration state; Show sample data restores ready. There is no matrix grid, correlation calculation, brush, zoom, jitter or accessible exact-data table in that branch.

This guide's explicit paired-object names, calibrated fixed axes/ticks, edge/overlap fixture, equal-sized selection and table are original additions. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount. Vue/SVG specimens and theme wrappers do not imply an installed third-party chart API.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Paired coordinates/table/status update together on the same domains. |
| Edges/overlap | Zero/max boundaries and duplicate coordinates remain exact. |
| Selection | One pressed button and outlined dot; coordinates/radius unchanged. |
| Loading/empty/reset | Withhold/recover paired geometry/table; reset A/Item 1/ready. |

Shared Motion fades dots on entry/refresh via explicit fade markers, not movement through invented observations. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Exact pairs, axis labels/ticks, outline and native keyboard/touch buttons supplement color; no hover is required. This is not screen-reader certification.

Check both datasets and edges exact pair mapping/cx/cy/radius, tick calibration/axis bounds, duplicate-coordinate preservation, selection without position/size changes, state retention/recovery/reset, focus/Enter/Space, reduced motion/unmount, graph/table/source-map desktop/mobile pixels, filesystem body routes, overflow and errors. A live adapter needs null/nonfinite/out-of-range pairs, duplicate IDs, large/dense datasets, long labels, overlap policy, filters, scaling and stale/error states.

<style>
@media(max-width:700px){.scatter-plot-guide .vp-doc table:not(.scusage-data),.scatter-plot-guide .vp-doc table:not(.scusage-data) tbody,.scatter-plot-guide .vp-doc table:not(.scusage-data) tr,.scatter-plot-guide .vp-doc table:not(.scusage-data) td{display:block;width:100%;box-sizing:border-box}.scatter-plot-guide .vp-doc table:not(.scusage-data) thead{display:none}.scatter-plot-guide .vp-doc table:not(.scusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.scatter-plot-guide .vp-doc table:not(.scusage-data) td{overflow-wrap:anywhere}.scatter-plot-guide .vp-doc table:not(.scusage-data) tr{margin-bottom:12px}}
</style>
