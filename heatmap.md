---
pageClass: heatmap-guide
---
<script setup>
import HeatmapUsageDemo from './.vitepress/theme/HeatmapUsageDemo.vue'
</script>

# Heatmap

A heatmap maps a value at each row/column intersection to color. Label both dimensions, unit and color scale before using it to compare cells. Calendar grids, day/time matrices and branch/cause tables share this pattern but do not share data semantics. Use a [bar chart](/bar-chart) for precise one-dimensional comparisons, or a [scatter plot](/scatter-plot) for individual paired observations. Color alone is not an exact numeric scale.

## Try thresholds, zero and missing values

<HeatmapUsageDemo />

A includes every band boundary, measured zero and two missing observations. B reverses the observed intensity pattern and moves missing cells. All missing retains twelve known coordinates with no observations. Select any cell by touch, keyboard or click to inspect it; no hover is required. Dataset/state changes retain the coordinate. Loading/Empty withhold the grid/table; Ready restores it. Reset returns A/Mon 06h/ready. No network request or edit occurs.

## How to use it

1. Define what a cell measures. This example is a synthetic occupancy percentage at a named observation time, not accumulated visits or a four-hour average. Local Mon/Tue/Wed labels have no actual date or timezone binding.
2. Declare row/column order explicitly. Rows are Mon/Tue/Wed; columns are 06h/10h/14h/18h. Index=4×row+column. This is a day/time matrix, not a continuous calendar.
3. Fix the scale for comparison. Bands are[0,25),[25,50),[50,75),[75,100]. The legend uses integer labels 0–24/25–49/50–74/75–100 because these fixtures contain integers. A live decimal adapter should show interval notation rather than imply 24.5 has no band.
4. Keep observed zero distinct from missing. Zero uses the lightest numeric band with a 0% label; null uses N/A, a hatch and Missing in the exact table. Never use a falsey test that treats 0 as absent.
5. Preserve scale across datasets, filters and selections. No row normalization, column normalization, local maximum, quantile scale or color-domain rescaling occurs here. Such transforms change the question and need explicit disclosure.
6. Provide exact values and a non-color path. Every cell contains its value, an accessible coordinate/value name and one pressed state; the table repeats the same values. Selection changes only the outline/readout.
7. State the aggregation and missing policy for real data. Occupancy percentages cannot be summed as counts. Multiple observations per coordinate need a defined aggregation, denominator and time basis; absent observations are not automatically zero.

## Anatomy and actual API

`HeatmapUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and root element. A row-major values are 0,24,25,49 /50,74,75,100 /null,10,null,90. B is 100,75,74,50 /49,25,24,0 /60,null,30,null. All missing is twelve nulls. A/B each have 10 observed cells. Threshold index is min(3,floor(value/25)) for the fixed valid 0–100 fixtures; null has no numeric band.

The HTML grid has five columns:36px row label plus four equal `minmax(0,1fr)` data columns, with 6px gaps. One header row gives the four observation times; each following row has its day and four native buttons of minimum height 44px. There is no interpolated surface or implied value between cells. The sequential light-blue to dark-blue palette has four discrete bands; a separate gray hatch represents missing. Legend swatches, grid and table derive from the same definitions. Color is not a claim of perceptual linearity or accessibility certification.

```vue
<script setup>
import HeatmapUsageDemo from './.vitepress/theme/HeatmapUsageDemo.vue'
</script>
<template><HeatmapUsageDemo /></template>
```

Possible host input, not implemented props:

```ts
type OccupancyCell = { day: string; time: string; occupancy: number | null }
type HeatmapInput = { rows: string[]; columns: string[]; cells: OccupancyCell[]; unit: 'percent' }
```

Validate unique row/column identifiers and coordinate pairs, complete or explicitly sparse grid policy, finite values in 0–100, null semantics, observation time/date/timezone and percentage denominator. Reject NaN, infinity and out-of-range values rather than silently assigning a band. This fixed controller has no dynamic dimensions, continuous legend, arbitrary threshold or palette prop, tooltip portal, calendar mapping, aggregation, filter, zoom, export, request or error adapter.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared activity grids, dot matrix and day/hour occupancy matrix; different synthetic units and layouts. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared ChartGallery wrappers, not distinct heatmap data APIs. |
| [Felix basic heatmap](/felix/components/charts#basic-heatmap) | Static three weekday rows × four month columns, colored i elements; no numeric values, legend thresholds or cell interaction. |
| [Lustro calendar](/calendar), [Felix calendar](/felix/calendar), [PulseFit calendar](/pulsefit/calendar) | Static yearly-style intensity specimens, not working date/count adapters. |
| [Margin analytics](/margin/analytics), [standalone Margin](/margin-analytics) | Shared MarginDashboard leakage table with branch filter and dollar-value bands, not occupancy. |

ChartGallery declares only `language` String default lustro and renders the collection. No cells, dates, rows, columns, thresholds, missing, selected-coordinate prop or selection emit exists. Three activity variants render 140 buttons in seven rows/twenty columns with column-first flow; dot matrix renders 35 buttons in seven columns with row-first flow. Their formula is h=(13i+7×id.length+(B?19:0)) mod 6; label is 3h events; opacity=.15+.17h. Emerald/Sky/Violet differ by palette and id length, so their generated values need not match. Zero events still has positive opacity. No actual dates, day/week headers, numeric legend, null cell or exact table exists. A focus/mouseenter selects persistent Cell N readout; clicking a cell has no explicit pick handler and generally selects through focus. Generic Item 1–6 controls cover only the first six positions despite larger grids. No mouseleave reset exists.

Native day/hour occupancy has seven day rows and six columns at 06/09/12/15/18/21h. Cell i uses(17i+23+(B?11:0)) mod 101 percent. SVG x=50+41×column, y=20+22×row, width 37/height 19; opacity=.12+.0088×value. Focus/mouseenter on each rectangle and 42 day/hour label buttons update the readout. Light 0% to dark 100% is a continuous opacity caption, not this example's discrete thresholds. No missing observations or exact table exists. Native Ready/Loading/Empty is manual demo state; Show sample data restores ready. Shared Motion mounts cards, refreshes on sample/state and destroys on unmount.

The basic Felix matrix has Spanish Ene/Feb/Mar/Abr columns and Lun/Mié/Vie rows. Colors are hardcoded backgrounds, not evidence of exact event counts. Calendar year specimens use styled i elements and preset level classes without per-day numeric observations or a functioning calendar calculation. Do not infer missing/zero/date semantics from blank decoration.

Margin's live local branch selector filters visible leakage rows without recomputing the fixed column headers or callout. Heat classes use v<4,4≤v<7,7≤v<13,v≥13 in thousands of dollars. Values are printed inside colored spans, with row/column totals supplied separately. Row fixtures sum to 36.2/24.3/21.9; column sums reconcile to the supplied 31.2/18.7/14.4/9.8/8.3 headers for the unfiltered fixtures. Those headers are fixed display data, not a computed rollup of filtered rows or occupancy percentages. No cell-selection handler or missing-value adapter exists there.

This guide's small labeled snapshot grid, fixed four-band integer legend, exact threshold-boundary fixtures, explicit null/hatch, all-missing dataset, one pressed cell, exact table and reset are original additions. Vue/HTML specimens and theme wrappers do not imply an installed heatmap package.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Update the same twelve coordinates using fixed thresholds; each has ten observations. |
| All missing | Known coordinates remain, all N/A/hatched; observed count 0. |
| Selected cell | One pressed button with coordinate/value status; missing is selectable too. |
| Loading/empty/reset | Withhold/recover grid/table; reset A/Mon 06h/ready. |

Shared Motion uses explicit fades for HTML cells, without inventing intermediate measured occupancy. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Text, hatch, exact table, selected outline and native focus/keyboard controls supplement color. Mobile keeps the matrix and exact table legible; source maps stack rather than clipping prose.

Check every A/B/null fixture, boundary 0/24/25/49/50/74/75/100, exact cell names/text/bands, row/column order, observed counts, table agreement, all-missing, retained selection, loading/empty/reset, keyboard, reduced motion and unmount. Inspect desktop/mobile grid/legend/table and lower source-map pixels; check filesystem routes, overflow and runtime errors. Live adapters also need invalid/nonfinite values, duplicates, missing rows, decimal thresholds, long labels, large matrices, timezone/DST and stale/error policies.

<style>
@media(max-width:700px){.heatmap-guide .vp-doc table:not(.hmusage-data),.heatmap-guide .vp-doc table:not(.hmusage-data) tbody,.heatmap-guide .vp-doc table:not(.hmusage-data) tr,.heatmap-guide .vp-doc table:not(.hmusage-data) td{display:block;width:100%;box-sizing:border-box}.heatmap-guide .vp-doc table:not(.hmusage-data) thead{display:none}.heatmap-guide .vp-doc table:not(.hmusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.heatmap-guide .vp-doc table:not(.hmusage-data) td{overflow-wrap:anywhere}.heatmap-guide .vp-doc table:not(.hmusage-data) tr{margin-bottom:12px}}
</style>
