---
pageClass: bar-chart-guide
---
<script setup>
import BarChartUsageDemo from './.vitepress/theme/BarChartUsageDemo.vue'
</script>

# Bar chart

A bar chart compares magnitudes using length from a common baseline. Use rows for long category names or columns for a short ordered sequence. Start magnitude bars at zero; cropping the baseline can distort the comparison. Use a line for continuous trend, a histogram for numeric buckets, stacked bars for parts of a total or a waterfall for running changes. These are distinct encodings, not alternate names for a basic bar.

## Try columns, rows and zero

<BarChartUsageDemo />

Switch A/B or All zero, select a month and change Columns/Rows. Orientation changes geometry, not values or order. The selected bar has a stronger outline and one pressed month button; readout/table show the same observation. A small baseline marker makes a zero observation visible without giving it positive bar length. Loading/Empty withhold graph/table rather than drawing zero; Ready restores choices. Reset returns A, January, Columns and ready. No request or record changes.

## How to use it

1. Name unit and categories. These are six equally spaced monthly labels and synthetic units, not parsed dates or real business records.
2. Use a common zero baseline and scale. Both orientations and datasets use0–100. No hidden autoscaling changes comparison when switching A/B.
3. Choose orientation for readability. Rows leave a label gutter; columns put labels below the zero baseline. Do not rotate labels until the chart becomes unreadable.
4. Preserve meaningful order. This example stays Jan–Jun. Sorting categories is a separate operation that must preserve stable IDs and selected identity.
5. Encode magnitude with length, not rounded caps or decorative minimum size. A zero-length bar stays zero; its small dot is only a presence marker.
6. Supply exact text values. Buttons/readout/table avoid hover-only access and make zero distinguishable from missing.
7. Define signed and missing data before drawing. This fixed nonnegative controller does not implement a diverging baseline, negative bars or gaps.

## Anatomy and actual API

`BarChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `hold` (orientation), `selected` and `state`. Orientation values are column/row. Primary arrays are A35/48/41/61/56/74, B42/36/55/48/72/64 or six zeros. It is an isolated fixture controller, not a data adapter or sorting API.

Columns use X40+48i, Y170−1.4v, width20 and height1.4v in a320×210 SVG. Rows use X50, Y20+26i, width2.3v and height16. The data scale is0–100 in either layout; pixel scale differs because the available axes differ. Zero values have zero rectangle length and a small baseline dot. Selection changes outline/opacity, not dimensions. Row and column labels derive from the same array, with no reorder.

```vue
<script setup>
import BarChartUsageDemo from './.vitepress/theme/BarChartUsageDemo.vue'
</script>
<template><BarChartUsageDemo /></template>
```

A production host might use this shape; it is not implemented props:

```ts
type BarItem = { id: string; label: string; value: number | null }
type BarSeries = {
  unit: string
  orientation: 'column' | 'row'
  items: BarItem[]
}
```

Validate finite values, IDs, unit consistency and domain before mapping. Keep selected identity stable through sorting/filtering rather than retaining an unrelated numeric index. Define negative-domain and missing-value policies instead of clamping to zero. Long labels need wrapping or extra gutter space; this fixed six-month fixture does not fit arbitrary labels automatically.

Native month buttons select on focus or activation and expose pressed state. Dataset/orientation/state changes keep the selected index. Both geometries, stronger outline, readout and native table share the same array. No custom arrow-key widget, timer, listener, subscription or external animation handle is involved. Nothing is saved.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix gallery](/felix/components/charts) | ChartGallery Pill bars has a local column/row toggle and generated A/B fixtures. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery theme wrappers, not independent reusable bar data APIs. |
| [Bastion charts](/bastion/charts) | Separate service request bars share range-dependent percentages with CPU meters; selected service updates text. |
| [Line chart](/line-chart), [Sparkline](/sparkline) | Trend encodings, not magnitude bars with interchangeable interpolation. |

ChartGallery declares only `language` String default lustro and renders the full gallery. There is no bars-only, arbitrary-data, orientation or selected-item prop and no selection emit. A/B and Ready/Loading/Empty are gallery-global. The bars card starts as columns. Its button text names the alternative layout: Row when columns are active, Column when rows are active; aria-pressed tracks its mode boolean.

Source columns use X34+48i, Y166−1.5v, width24 and height1.5v with rounded caps. Rows use X45, Y17+25i, width2.4v and height16, with visible0/50/100 labels. Source focus/mouseenter on groups and month readout buttons select the card index. Its default readout includes secondary fixture values even though these bars plot primary only. This guide intentionally shows only its plotted values, adds an exact table/zero fixture and uses square ends to avoid cap/minimum-size ambiguity at zero.

Source selections persist until another point is picked; there is no mouseleave reset or actual category query. Manual loading/empty are not requests; Show sample data restores global ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount; CSS transitions are separate.

BastionCharts exposes no props. Its24h/7d range changes sample bars18/62/24/11 to22/48/31/16 for api/worker/db/cache. Native bar buttons select the service, not its value, and the status names the service. Source text calls these sample percentages, not live request counts. This separate controller is not supplied by ChartGallery and does not imply a universal bar API.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B/zero | All representations update together on a fixed0–100 domain. |
| Columns/rows | Same values/order, direction of length changes. |
| Zero | Zero-length rectangle plus a presence dot, exact0 in text/table. |
| Selected month | Stronger outline, one pressed button and exact readout. |
| Loading/empty/reset | Values withheld or restored; reset A/January/Columns/ready. |

SVG entrance fades over200ms on dataset/orientation remount. Reduced motion removes it; values do not count through invented intermediate numbers. Selection has outline/text/pressed state beyond color. SVG is descriptive, while native buttons/selects handle keyboard input. Data table fits mobile and prose source maps stack. This is not screen-reader certification.

Check A/B/zero values against table/readout, exact column/row rectangle positions and lengths, zero presence without positive length, selection styling, order retention, focus/Enter/Space, state retention/recovery/reset, reduced motion, labels/baseline/table/source-map readability, body links, overflow and console errors. A real adapter also needs long labels, many categories, signed/nonfinite/missing values, sorting/filtering and stale/error cases.

<style>
@media(max-width:700px){.bar-chart-guide .vp-doc table:not(.barusage-data),.bar-chart-guide .vp-doc table:not(.barusage-data) tbody,.bar-chart-guide .vp-doc table:not(.barusage-data) tr,.bar-chart-guide .vp-doc table:not(.barusage-data) td{display:block;width:100%;box-sizing:border-box}.bar-chart-guide .vp-doc table:not(.barusage-data) thead{display:none}.bar-chart-guide .vp-doc table:not(.barusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.bar-chart-guide .vp-doc table:not(.barusage-data) td{overflow-wrap:anywhere}.bar-chart-guide .vp-doc table:not(.barusage-data) tr{margin-bottom:12px}}
</style>
