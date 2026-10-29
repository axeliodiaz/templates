---
pageClass: sparkline-guide
---
<script setup>
import SparklineUsageDemo from './.vitepress/theme/SparklineUsageDemo.vue'
</script>

# Sparkline

A sparkline is a small trend line beside a number or inside a table cell. Use it for quick shape and direction, not precise visual reading. Its surrounding text must name the metric, unit and period. For detailed axes, multiple series or analysis, use a full line chart. A compact line is not proof that a headline metric was calculated from it.

## Try a tiny trend and exact values

<SparklineUsageDemo />

Choose A/B, Flat or All zero and select a month. June's headline and January-to-June absolute change update with the same array as the line. The selected mark and readout follow the month button. Show exact values opens a captioned table; Hide exact values closes it. Flat40 and All zero are valid trends, not Empty. Loading/Empty withhold chart/headline/table, preserve local choices and make no request. Ready restores them; Reset returns A, January, closed table and ready. No records change.

## How to use it

1. Name the metric, unit and period outside the tiny line. This is synthetic monthly units, Jan–Jun, not live telemetry or revenue.
2. Keep scales honest across comparisons. This example fixes0–100 for every dataset, so flat40 and flat0 occupy different heights. Per-series autoscaling would make their positions incomparable.
3. Make the headline relationship explicit. The headline is the final observation and the delta is final−first in units, not percent change. No division by a zero first value occurs.
4. Keep the sparkline small. Here it stays160×56 CSS pixels on desktop and mobile instead of growing into a full chart.
5. Supply exact values without hover. Native month buttons, a live readout and a disclosure table make the trend usable with keyboard/touch.
6. Preserve missingness. A zero value is not a missing observation. Production gaps need an explicit rule, not a line silently bridging unknown data.
7. Do not imply smooth measurements. Straight segments here connect equal-spaced fixtures. A real timeline needs actual timestamps and a declared interpolation rule.

## Anatomy and actual API

`SparklineUsageDemo.vue` has no props or emits. Refs are `dataset`, `detail`, `selected` and `state`. Computed primary arrays are A35/48/41/61/56/74, B42/36/55/48/72/64, six40s or six zeros. The headline uses index5 and the delta subtracts index0. Month labels are Jan–Jun. It is a local fixture controller, not an arbitrary-series adapter.

X is8+28i and Y is48−.4v inside a160×56 SVG. The fixed0–100 scale leaves padding for dots, including zeros and flat values. No axes are drawn at this size, so the text states the fixed range. A polyline joins six observations and a larger mark identifies selection. No aggregation, smoothing, normalization, date parsing or automatic domain fitting occurs.

```vue
<script setup>
import SparklineUsageDemo from './.vitepress/theme/SparklineUsageDemo.vue'
</script>
<template><SparklineUsageDemo /></template>
```

A production host might define this shape; it is not implemented props:

```ts
type SparkPoint = { timestamp: string; value: number | null }
type SparkSeries = {
  metric: string
  unit: string
  domain: [number, number]
  observations: SparkPoint[]
}
```

Validate finite values, domain, ordering/duplicates, gaps and units before plotting. Define what an empty or single-point series means. A percent delta also needs a zero-denominator policy; this demo avoids that calculation entirely. Do not silently clip out-of-range values or stretch every flat line to the same implied scale.

Month buttons select on focus or activation and expose pressed state. Dataset/state changes keep the month and table disclosure. Reset closes it. The disclosure uses a native button with aria-expanded; no accordion keyboard behavior or persistent preference is claimed. No timers, listeners, subscriptions or external animation handles need manual cleanup.

## Source coverage and actual behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix](/felix/components/charts), [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | ChartGallery KPI with sparkline and telemetry specimens share fixture geometry. They are not a standalone sparkline data API. |
| [Bastion charts](/bastion/charts) | BastionCharts has24h/7d local point strings. The range changes the sparkline and related meter/bar fixtures, not live uptime records. |
| [KPI cards](/kpi-cards), [Line chart](/line-chart) | Headline-card and full-axis trend guides remain separate. A sparkline is a compact encoding, not a KPI calculation service. |

ChartGallery declares only `language` String default lustro and renders the full gallery. There is no sparkline-only, series-data or metric prop and no selection emit. Global A/B changes six primary values and their cubic path. Its KPI card headline is48920 or56320, while the label+14.2% stays fixed; the path uses synthetic index values, not a derivation of those revenue numbers. Primary dots and month readout buttons update selection. The default readout also names secondary fixture values. Do not claim that changing a selected dot changes the headline or that the headline delta is computed from this sparkline.

Gallery telemetry rows all reuse that same spline, translated/scaled for CPU/GPU/fan rows. Their text values42°C,58°C and1.2kRPM remain fixed, and the telemetry-specific readout reports those constants. The rows are not distinct live sensor feeds. Global loading/empty are manual states, not requests. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount.

BastionCharts exposes no props. It stores range24h/7d and two explicit eight-point strings in a112×48 viewBox displayed72px high. Its mounted ready flag drives presentation. The range buttons have pressed state; there is no exact sparkline-value table or per-point selection in that source. This guide adds those behaviors in its own controller rather than presenting them as universal source APIs.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Headline, absolute delta, path, readout and open table update together. |
| Flat/zero | Visible constant trend at40 or0 on the same scale; delta0. |
| Selected month | One pressed button and larger mark; headline remains June. |
| Table disclosure | Exact rows available on demand, aria-expanded reflects visibility. |
| Loading/empty/reset | Values withheld or restored; reset closes table and restores defaults. |

SVG entrance fades over200ms on dataset remount; reduced motion removes it. Numbers do not count through invented values. SVG description names synthetic units and fixed range; buttons/readout/table avoid hover-only access. The line has no extra tab stops. The two-column table fits mobile; prose source maps stack. This is not screen-reader certification.

Check all four arrays against path coordinates, selected mark, headline, absolute delta, readout and table, constant-value geometry, disclosure state, focus/Enter/Space, state retention/recovery/reset, reduced motion, actual160×56 size, body links, narrow table/source-map readability, overflow and console errors. A production feed also needs missing/single-point series, negative/nonfinite values, unequal intervals, domain changes and stale/error tests.

<style>
@media(max-width:700px){.sparkline-guide .vp-doc table:not(.spusage-data),.sparkline-guide .vp-doc table:not(.spusage-data) tbody,.sparkline-guide .vp-doc table:not(.spusage-data) tr,.sparkline-guide .vp-doc table:not(.spusage-data) td{display:block;width:100%;box-sizing:border-box}.sparkline-guide .vp-doc table:not(.spusage-data) thead{display:none}.sparkline-guide .vp-doc table:not(.spusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.sparkline-guide .vp-doc table:not(.spusage-data) td{overflow-wrap:anywhere}.sparkline-guide .vp-doc table:not(.spusage-data) tr{margin-bottom:12px}}
</style>
