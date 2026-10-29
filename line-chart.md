---
pageClass: line-chart-guide
---
<script setup>
import LineChartUsageDemo from './.vitepress/theme/LineChartUsageDemo.vue'
</script>

# Line chart

A line chart connects ordered observations to show change. Use it for a time series or another meaningful sequence, not unordered categories. A connecting segment is an interpolation choice, not evidence that every intermediate point was measured. This guide uses straight segments; the catalogue's related spline specimen uses cubic curves. For step changes, filled areas or a tiny trend, use those distinct chart families rather than treating them as cosmetic equivalents.

## Try datasets, series and exact values

<LineChartUsageDemo />

Choose dataset A or B, select a month and hide/show the secondary series. Focus or activate a month button to update the same readout and primary mark. Dataset changes keep the selected month, while Ready/Loading/Empty switches preserve local selections. Missing-state demonstrations withhold the graph and table, not replace them with zero. Ready restores them; Reset returns A, dual, January and ready. No requests or records change.

## How to use it

1. Order observations by a meaningful axis. These six fixed monthly labels have equal spacing, not parsed dates or variable time intervals.
2. Label units and scale. Here both series are synthetic units on a fixed 0–100 vertical scale, so A/B and primary/secondary remain comparable.
3. Distinguish the series beyond color. Solid primary and dashed secondary have a text legend and separate table columns.
4. Choose interpolation honestly. Straight segments connect observations; a smooth spline can suggest intermediate peaks or certainty that the data does not support.
5. Provide exact values without requiring a pointer. This example has month buttons, readout and a captioned table. No hover tooltip is necessary.
6. Define missing/stale/loading behavior. A real feed needs timestamps, source and error handling; the manually selected loading state here is not a request.
7. Keep chart interaction separate from business effects. Selecting a point should not change an account, price or underlying record.

## Anatomy and actual API

`LineChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `dual`, `selected` and `state`. Two computed arrays depend on dataset. Labels are Jan–Jun. `x(i)=40+i*48` and `y(value)=170-value*1.4` map the fixed scale into a 320×210 SVG. `points()` joins primary/secondary values into polylines; no smoothing, aggregation, sorting, date parsing or remote feed occurs.

Dataset A primary is35/48/41/61/56/74 and secondary20/28/25/39/33/46. B primary is42/36/55/48/72/64 and secondary26/19/35/28/43/36. These are the same illustrative values used by the gallery, rendered with an original isolated controller and accessible exact-value table. All values fit the fixed scale. This demo is not an arbitrary-data adapter and does not validate out-of-range or missing points.

```vue
<script setup>
import LineChartUsageDemo from './.vitepress/theme/LineChartUsageDemo.vue'
</script>
<template><LineChartUsageDemo /></template>
```

A production host might use this shape; it is not an implemented prop API:

```ts
type Observation = { timestamp: string; primary: number | null; secondary?: number | null }
type LineSeries = { unit: string; source: string; asOf: string; observations: Observation[] }
// Validate timestamps/units/order and define gaps before plotting.
```

Native buttons set the selected index on focus or activation and expose pressed state. No custom arrow-key tablist behavior is invented. Hiding secondary removes its path, readout text and table column together. No listeners, timers, subscriptions or external animation handles exist; Vue cleanup is enough.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Felix spline line](/felix/components/charts#mono-line) | ChartGallery uses the same six fixture arrays, cubic paths and a single/dual toggle. Shared language prop selects theme, not data props. |
| [Lumen charts](/lumen/charts), [Scopecraft charts](/scopecraft/charts), [Lustro chart gallery](/graphs), [Pulsefit charts](/pulsefit/charts) | Shared ChartGallery theme variants. They are not separate installed chart APIs or live data providers. |
| [Price timeline](/price-timeline) | Different asset-card model with generated points and projected segment. It does not supply dated observations to this chart. |

ChartGallery's actual API is `language` String default lustro. It renders the entire gallery; there is no public line-only prop or series-data prop. Global Dataset A/B and chart-state controls affect all applicable cards. Per-card focus/mode objects hold month and single/dual state. The line starts dual because its secondary path renders when mode is false. Its button text describes the alternative action: Single when dual, Dual when single; aria-pressed tracks the underlying mode boolean, not a universal show-secondary flag.

The source spline uses cubic controls halfway horizontally between neighboring points: X34+48i and Y166−1.5value. Its primary circles handle mouseenter/focus, while native readout buttons support keyboard/touch. The readout's default branch includes secondary text even when single mode hides the secondary path, so hiding a line there does not hide its readout value. This guide intentionally synchronizes hidden-series representation, readout and table. Source selections persist until another point is picked; there is no mouseleave reset or real time range query.

ChartGallery loading/empty are local presentation states, not actual requests. Empty's Show sample data restores global ready. Its shared Motion helper refreshes after dataset/state changes and destroys on unmount; CSS path transitions are separate. Do not infer a general data/selection event API from gallery controls.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| Ready | Fixed-scale SVG, text legend, month controls, live readout and exact table. |
| Single/dual | Secondary path/readout/column absent or present together; primary selection retained. |
| Selected month | One pressed button and larger primary dot. |
| Loading/empty | Values withheld; explanatory local status, controls remain available. |
| Reset | A, January, secondary shown, ready. |

The new SVG fades in over200ms on dataset/series remount. Reduced motion removes the fade. Numeric readouts never count through invented values. The SVG has a concise description and exact table follows; dots are visual marks, not custom keyboard controls. Tables remain real row/column tables at mobile widths because their narrow three-column data fits; prose source maps stack separately. This is not screen-reader certification.

Check both dataset arrays against table/readout, month focus/Enter/Space, single pressed state, hidden-secondary consistency, selection retention through dataset/state changes, Ready recovery/reset, reduced motion, axis labels, narrow table/legend/source-map readability and console errors. A production feed also needs sorted/duplicate timestamps, gaps, nonfinite/out-of-range values, changing units and stale/error states.

<style>
@media(max-width:700px){.line-chart-guide .vp-doc table:not(.line-data),.line-chart-guide .vp-doc table:not(.line-data) tbody,.line-chart-guide .vp-doc table:not(.line-data) tr,.line-chart-guide .vp-doc table:not(.line-data) td{display:block;width:100%;box-sizing:border-box}.line-chart-guide .vp-doc table:not(.line-data) thead{display:none}.line-chart-guide .vp-doc table:not(.line-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.line-chart-guide .vp-doc table:not(.line-data) td{overflow-wrap:anywhere}.line-chart-guide .vp-doc table:not(.line-data) tr{margin-bottom:12px}}
</style>
