---
pageClass: bullet-chart-guide
---
<script setup>
import BulletChartUsageDemo from './.vitepress/theme/BulletChartUsageDemo.vue'
</script>

# Bullet chart

A bullet chart places a measured bar and a target marker on one scale. Background bands can add context when their thresholds mean something. Use it for compact goal comparisons, not parts of a whole or a time trend. Use a dumbbell for two peer endpoints, a progress bar for a simple completion ratio, or a line chart for history.

## Try values, targets and direction

<BulletChartUsageDemo />

Switch A/B, All zero or At target, select a metric and compare bar, marker, status and table. Throughput/Uptime require at least their target; Latency requires at most its target. Bigger is therefore not always better. Values are synthetic normalized scores, not live throughput, milliseconds or measured uptime percentages. Zero remains a real value with zero bar length. Loading/Empty withhold values; Ready recovers the previous choices. Reset returns A, Throughput and ready. Nothing is requested or saved.

## How to use it

1. Define a unit and domain per metric. This normalized fixture deliberately shares0–100. Do not imply that real latency and throughput naturally have the same unit or favorable direction.
2. Start the magnitude bar at zero and keep a fixed domain through comparisons. The target uses the same mapping as the bar.
3. Label target direction explicitly. At least and at most include equality; a short bar can meet an upper-bound requirement.
4. Give background thresholds a source and meaning. These neutral bands are0–50,50–80,80–100 reference intervals, not poor/fair/good labels. A production host must supply domain-specific grades and reverse them when appropriate.
5. Distinguish value and target beyond color. A bar and an extending vertical marker remain identifiable when equal.
6. Preserve zero versus missing. This controller has an explicit zero fixture, but no null/nonfinite data adapter. Loading is not zero.
7. Provide exact values, direction and result in text. Do not rely on a target line's pixel location or a hover tooltip.

## Anatomy and actual API

`BulletChartUsageDemo.vue` has no props or emits. Its refs are `dataset`, `state` and `selected`. Throughput/Latency/Uptime targets stay75/80/90. Values are A82/65/95, B70/85/88, three zeros, or targets themselves for At target. `meets(i)` uses≤ for Latency and≥ for the other two. This is a local demonstration, not a KPI rule engine.

The320×250 SVG maps X25+2.7v. Each row's background is Y32+65i, height24. Bands occupy0–50,50–80,80–100 at widths135/81/54. The measured bar is Y39+65i, height10, width2.7v. The target line extends from Y28+65i to60+65i at X25+2.7target. Target remains visible beyond the bar on either side. Selection changes label weight, row opacity and bar outline, never geometry. Zero has width0, not a decorative minimum.

```vue
<script setup>
import BulletChartUsageDemo from './.vitepress/theme/BulletChartUsageDemo.vue'
</script>
<template><BulletChartUsageDemo /></template>
```

A possible host contract, not implemented props:

```ts
type BulletMetric = {
  id: string; label: string; unit: string
  value: number | null; target: number
  domain: [number, number]; direction: 'at-least' | 'at-most'
  bands: { from: number; to: number; label: string }[]
}
```

Validate finite value/target/domain, increasing domain, consistent units, stable IDs and ordered nonoverlapping bands within the domain. Define missing, negative and out-of-domain behavior before drawing; do not silently clamp a missed target into success. When each metric uses a different scale, label each one. This fixed normalized fixture does not implement per-row domains, bands or rule editing.

Native metric buttons select on focus or activation and expose pressed state. Dataset/state changes preserve selected index because fixture ordering is constant. Bar, status and exact table use the same values and comparison. No custom arrow-key widget, request, timer, subscription or external animation handle exists.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | ChartGallery Bullet targets card with three fixed sample rows. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not separate metric/band APIs. |
| [Bar chart](/bar-chart), [Dumbbell chart](/dumbbell-chart) | Magnitude alone or peer paired positions, not the same target-context encoding. |

ChartGallery declares only `language` String default lustro and renders the whole gallery. It has no bullet-only, value, target, thresholds or selected-metric prop, no selection emit and no per-card target control. Global A/B does not change this card: both plotted rows and readout hard-code82/65/95 with75/80/90 targets.

Source bars map X25+2.7v with rounded measured bars and a single270px neutral track, height15. It does not draw qualitative bands despite descriptive copy referring to poor/fair/good. This guide adds explicitly neutral reference bands, a zero/B fixture, direction-aware text results and a native table; those are not claims about the source. Source text uses percentage labels for all three synthetic metrics, not an actual latency unit or an implemented favorable-direction rule.

Source groups select on mouseenter/focus, with aria labels naming value and target. Readout buttons are Item1/2/3 rather than metric names; readout supplies the names. Selection persists until another row is picked. The source has no target-met calculation, tie fixture, editing or request. Manual Loading/Empty are gallery-global demonstration states; Show sample data restores ready. Shared Motion mounts on cards, refreshes for dataset/state and destroys on unmount. Wrapper styling is not a universal installed chart API.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B/zero/at target | Bar, exact value and direction-aware result update; target/bands stay fixed. |
| At least/at most | Value≥target for Throughput/Uptime; value≤target for Latency. |
| Selected metric | One pressed button, heavier label/bar outline and exact status. |
| Loading/empty/reset | Values withheld or recovered; reset A/Throughput/ready. |

SVG entrance fades over200ms on dataset remount. Reduced motion removes it; values do not count through invented intermediate scores. Geometry, marker shape, text direction and results avoid color-only meaning. Native buttons/selects handle keyboard input; SVG describes encoding and the native table supplies exact values. This is not screen-reader certification.

Check A/B/zero/at-target values against table/status, exact background/bar/target coordinates, upper-versus-lower direction, equality rule, zero length, selection retention, focus/Enter/Space, loading/empty/recovery/reset, reduced motion, chart/table/source-map readability, actual filesystem body routes, overflow and console errors. A real adapter needs null/nonfinite/signed/out-of-domain data, duplicate IDs, long labels, many rows, band validation, per-metric units and stale/error cases.

<style>
@media(max-width:700px){.bullet-chart-guide .vp-doc table:not(.blusage-data),.bullet-chart-guide .vp-doc table:not(.blusage-data) tbody,.bullet-chart-guide .vp-doc table:not(.blusage-data) tr,.bullet-chart-guide .vp-doc table:not(.blusage-data) td{display:block;width:100%;box-sizing:border-box}.bullet-chart-guide .vp-doc table:not(.blusage-data) thead{display:none}.bullet-chart-guide .vp-doc table:not(.blusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.bullet-chart-guide .vp-doc table:not(.blusage-data) td{overflow-wrap:anywhere}.bullet-chart-guide .vp-doc table:not(.blusage-data) tr{margin-bottom:12px}}
</style>
