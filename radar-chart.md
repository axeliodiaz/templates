---
pageClass: radar-chart-guide
---
<script setup>
import RadarChartUsageDemo from './.vitepress/theme/RadarChartUsageDemo.vue'
</script>

# Radar chart

A radar compares profiles across several axes arranged around a center. Each vertex is a score on its own axis; connecting vertices makes a profile shape. Use it for a small set of comparable normalized dimensions, with stable axis order and clear scoring direction. Use grouped bars or a table for precise comparisons, a line chart for time, and a polar sector chart for angular categories with magnitude. A radar polygon's area is not an overall score.

## Try a profile and reference

<RadarChartUsageDemo />

Switch A/B/All zero, select an axis and enable With reference. Primary is solid, Reference is dashed and stays60 on every axis. All axes use0–100, all higher-is-better; Cost means cost efficiency, not raw cost. The table adds the reference column only when plotted. Zero collapses the primary polygon to the center, not missing data. Loading/Empty withhold graph/table; Ready restores choices. Reset returns A, Speed, Single profile and ready. No request or record changes.

## How to use it

1. Define each dimension, unit and normalization. Raw milliseconds, dollars and percentages cannot be compared as though equal radial lengths mean equal performance.
2. Align scoring direction. Higher is better here, including cost efficiency. A real cost dimension needs a documented transform, not an unexplained reversal.
3. Keep axis order and common domain fixed across profiles. Reordering changes the polygon shape and area even when every value is unchanged.
4. Use the same mapping for vertices, grid and reference. This fixture has six equally spaced axes, center zero and maximum radius80 at100.
5. Limit profiles and avoid opaque fills hiding another profile. This example compares at most one primary and one dashed reference.
6. Do not rank by polygon area. Area depends on axis adjacency and scales; no average or composite score is computed here.
7. Supply exact scores and keyboard selection. Missing/nonfinite axes need a policy, not a fabricated center point.

## Anatomy and actual API

`RadarChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and `comparison`. Speed/Quality/Reach/Support/Cost/Trust are fixed axes. Primary is A35/48/41/61/56/74, B42/36/55/48/72/64 or six zeros. Reference is six60s. These normalized fixture values have no external business scoring model.

The320×250 SVG centers at160,120. Vertex i at value v is(160+0.8v cos(iπ/3−π/2),120+0.8v sin(iπ/3−π/2)). One polygon joins the six vertices and closes; it is not a smoothed time path. Grid polygons use25/50/75/100 through that same function, with spokes to100. Reference uses the same axes and mapping. Axis labels sit at radius101.6. The selected primary dot has radius5 versus3, with a stronger outline. Zero produces six coincident center vertices/dots, no positive polygon area.

```vue
<script setup>
import RadarChartUsageDemo from './.vitepress/theme/RadarChartUsageDemo.vue'
</script>
<template><RadarChartUsageDemo /></template>
```

A possible host shape, not implemented props:

```ts
type RadarAxis = { id: string; label: string; maximum: number; unit: string }
type RadarProfile = { id: string; label: string; scores: Record<string, number | null> }
```

Validate unique stable axis/profile IDs, finite scores, positive maxima and explicit missing/out-of-domain policy. Normalize scores before mapping; document favorable direction and transformations. Join by axis ID, not unrelated array positions. Keep selected axis identity through reordering/filtering. This fixed controller does not accept arbitrary dimensions, mixed units, per-axis domains, normalization rules or profile editing.

Native axis buttons select on focus or activation with pressed state. Dataset/comparison/state changes retain the selected index because axis identity is fixed. Plot/table/status use the same arrays. No custom arrow-key widget, timer, request, subscription or external animation handle exists.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | ChartGallery Radar web card uses six primary monthly fixture values and Jan–Jun labels. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery theme wrappers, not separate radar-data APIs. |
| [Polar chart](/polar-chart), [Bar chart](/bar-chart) | Sector magnitude or Cartesian magnitudes, not radar profiles. |

ChartGallery declares only `language` String default lustro and renders the full collection. No radar-only, axes, profiles, domain or selected-axis prop and no selection emit exists. Dataset A/B and Ready/Loading/Empty are gallery-global. Native radar has no second-profile toggle even though its descriptive copy mentions two profiles.

Source polygon mapping centers160,100, uses radius0.85v at six evenly spaced angles from up, and uses the same A/B primary arrays as this example. Native labels/readout are Jan–Jun and default readout includes secondary values even though only the primary polygon/points are plotted. Its two grid hexagons are hard-coded rather than generated by the data mapper. Do not treat them as calibrated25/50/75/100 ticks or infer a general scoring API.

Source circles select on mouseenter/focus; native Jan–Jun buttons update the readout. Selection persists with no mouseleave reset. This guide adds semantic score axes, calibrated grid/spokes, a dashed fixed reference, zero fixture and exact table. These are local original additions, not native controls. It does not claim real cost/quality measurements or a scoring formula.

Manual Loading/Empty are global demonstrations, not requests; Show sample data restores ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount. CSS transitions are separate. Theme wrappers do not imply an installed chart package or universal profile adapter.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B/zero | Primary profile and exact scores update on the same axes/domain. |
| Single/reference | Dashed reference and matching table/status values appear together. |
| Selected axis | One pressed button, larger outlined primary dot and exact status. |
| Loading/empty/reset | Values withheld/recovered; reset A/Speed/single/ready. |

SVG entrance fades over200ms on dataset/comparison remount; reduced motion removes it. Scores do not count through invented observations. Solid/dashed strokes, dots, labels and exact text avoid color-only meaning. Native controls handle keyboard input; SVG describes the encoding and table supplies exact scores. This is not screen-reader certification.

Check A/B/zero scores, exact polygon/point/grid/spoke coordinates, optional reference/table/status consistency, center collapse, stable axis order, selection retention, focus/Enter/Space, loading/empty/recovery/reset, reduced motion, chart/labels/table/source-map readability, actual filesystem body routes, overflow and console errors. A real adapter needs missing/nonfinite/out-of-domain scores, duplicate IDs, normalization/direction rules, long labels, many axes/profiles and stale/error cases.

<style>
@media(max-width:700px){.radar-chart-guide .vp-doc table:not(.rdusage-data),.radar-chart-guide .vp-doc table:not(.rdusage-data) tbody,.radar-chart-guide .vp-doc table:not(.rdusage-data) tr,.radar-chart-guide .vp-doc table:not(.rdusage-data) td{display:block;width:100%;box-sizing:border-box}.radar-chart-guide .vp-doc table:not(.rdusage-data) thead{display:none}.radar-chart-guide .vp-doc table:not(.rdusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.radar-chart-guide .vp-doc table:not(.rdusage-data) td{overflow-wrap:anywhere}.radar-chart-guide .vp-doc table:not(.rdusage-data) tr{margin-bottom:12px}}
</style>
