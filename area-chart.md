---
pageClass: area-chart-guide
---
<script setup>
import AreaChartUsageDemo from './.vitepress/theme/AreaChartUsageDemo.vue'
</script>

# Area chart

An area chart fills the space between an ordered series and a baseline. Use it when magnitude above that baseline matters, such as volume over time. Keep zero visible: a cropped baseline can exaggerate the filled magnitude. A filled region is not a cumulative sum, uncertainty interval or part-of-whole breakdown. Use a range band for limits, a stream chart for layered flows or a line chart when only the trend matters.

## Try the baseline, fill and exact values

<AreaChartUsageDemo />

Switch A/B, select a month, hide the fill or choose All zero. The outline, selected mark, live readout and captioned table use the same array. All zero is valid data and still shows the baseline and six zero rows. Loading and Empty withhold the graph/table instead of drawing zero. Ready restores the retained dataset, month and fill choice. Reset returns A, January, fill shown and ready. No request runs and no record changes.

## How to use it

1. Order observations by a meaningful axis. Jan–Jun here are six equally spaced labels, not parsed dates or unequal intervals.
2. Name the unit and baseline. Synthetic units use a fixed 0–100 vertical scale for every dataset, including zero.
3. Close the area to the baseline at both ends. Do not close directly between first and last values; that would encode a different region.
4. Keep an outline and exact values. Fill opacity is decoration; table cells and readout are the values.
5. Make interpolation explicit. Straight segments here connect observations without claiming intermediate measurements. Smooth curves in the catalogue are a separate choice.
6. Do not overlap many opaque fills. For independent series prefer lines; stacked areas need a shared total, aligned observations and a clear stacking rule.
7. Treat missing as missing. A production feed needs gaps, stale/error states and validation. This fixed nonnegative example does not infer zeros or request data.

## Anatomy and actual API

`AreaChartUsageDemo.vue` is an isolated local controller with no props or emits. `dataset`, `filled`, `selected` and `state` are refs. `primary` selects A35/48/41/61/56/74, B42/36/55/48/72/64 or six zeros. Labels are Jan–Jun. The zero fixture is separate from Empty. This is not an arbitrary-data adapter.

`x(i)=40+48i` and `y(v)=170−1.4v` put 0 at170 and100 at30 in a320×210 SVG. The area starts at40,170, visits all six observations and returns through280,170 to the start. The independent polyline uses the same observations. Toggling fill removes only the area path; the outline, mark, readout and values remain. No integration, automatic aggregation, cumulative calculation or date parsing occurs.

```vue
<script setup>
import AreaChartUsageDemo from './.vitepress/theme/AreaChartUsageDemo.vue'
</script>
<template><AreaChartUsageDemo /></template>
```

A production host might define this contract; the example does not implement it:

```ts
type AreaPoint = {
  timestamp: string
  value: number | null
}
type AreaSeries = {
  unit: string
  source: string
  baseline: number
  observations: AreaPoint[]
}
```

Validate finite numbers, units, ordered/duplicate timestamps and gap semantics before mapping. Negative values require a signed baseline and scale policy, not clamping silently. These fixture arrays need none of that input processing. Month buttons update selection on focus or activation and expose pressed state. No custom arrow-key widget is claimed. State/dataset changes retain selection. No listeners, timers or animation handles need manual cleanup.

## Source coverage and actual gallery behavior

| Source | Actual behavior and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix gallery](/felix/components/charts) | Shared ChartGallery gradient spline area card, not a standalone area package. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint gallery](/pawprint/charts) | Theme wrappers for the same gallery implementation. Pawprint also has a separate static weight-area specimen. |
| [Line chart guide](/line-chart) | Separate unfilled trend family. This guide's new controller is single-series with a zero baseline, not a dual-line toggle. |

ChartGallery's only declared prop is `language` String default lustro. It renders the whole gallery. There is no area-only, data, baseline, selection or error prop and no selection emit. Dataset A/B and Ready/Loading/Empty controls affect the whole gallery. Each card keeps its own selected index; six month readout buttons and focus/mouseenter on primary dots update it. There is no area mode button or legend control in the source.

The source's `area` is its primary cubic spline plus `L274,166 L34,166 Z`. Coordinates are X34+48i and Y166−1.5v. Cubic controls are halfway horizontally between neighbors. The area has a theme/card-specific gradient from opacity.5 to.04 and a primary outline. No secondary line is drawn in the area card, yet its default readout includes secondary fixture values. This guide intentionally shows only its plotted primary series in readout/table. It uses straight segments and uniform fill rather than claiming the source's smoothing or gradient as data semantics.

Global loading/empty are manual presentation states, not requests; Show sample data restores ready. Source selections persist until another item is picked, with no mouseleave reset. Shared Motion mounts on cards, refreshes after dataset/state changes and destroys on unmount; path CSS transitions are separate. Related static SVGs do not acquire this controller API just by looking similar.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Same fixed scale; all six values update together. |
| All zero | Valid series at baseline, exact zero rows and selected mark retained. |
| Fill off | Area absent; outline/table/readout unchanged. |
| Loading/empty | Graph/table withheld, descriptive local status, controls still available. |
| Reset | A, January, fill shown and ready. |

SVG entrance fades over200ms on dataset/fill remount; reduced motion removes it. Numbers do not count through invented values. The chart description names the baseline and points to the exact table. Native buttons, checkbox and selects remain keyboard controls; the decorative SVG dots are not extra tab stops. Live readout uses text, not color alone. The two-column data table fits narrow widths, while prose source maps stack. This is not screen-reader certification.

Check A/B/zero values against every table row and selected readout, path closure at both baseline endpoints, fill-off consistency, focus/Enter/Space, selection retention, missing-state recovery/reset, reduced motion, axis/table/source-map readability, overflow and console errors. A real feed also needs nonfinite values, gaps, negatives, duplicates, mixed units and stale/error tests.

<style>
@media(max-width:700px){.area-chart-guide .vp-doc table:not(.area-data),.area-chart-guide .vp-doc table:not(.area-data) tbody,.area-chart-guide .vp-doc table:not(.area-data) tr,.area-chart-guide .vp-doc table:not(.area-data) td{display:block;width:100%;box-sizing:border-box}.area-chart-guide .vp-doc table:not(.area-data) thead{display:none}.area-chart-guide .vp-doc table:not(.area-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.area-chart-guide .vp-doc table:not(.area-data) td{overflow-wrap:anywhere}.area-chart-guide .vp-doc table:not(.area-data) tr{margin-bottom:12px}}
</style>
