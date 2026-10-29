---
pageClass: radial-bar-chart-guide
---
<script setup>
import RadialBarChartUsageDemo from './.vitepress/theme/RadialBarChartUsageDemo.vue'
</script>

# Radial bar chart

A radial bar wraps a magnitude scale around a circle or partial circle. Concentric tracks can compare independent completion fractions, but different radii produce different physical arc lengths for the same percentage. Compare angle or fraction of each track, not raw length or area. Use straight bars for precise magnitude comparison, a donut for shares of one total, or polar sectors for categories at angular positions.

## Try half and full tracks

<RadialBarChartUsageDemo />

Switch A/B, Zero and full or All zero, select a ring and change Half/Full circle. Values remain independent percentages; they need not sum to100. Half sweeps clockwise over the top from left0 to right100; full starts at top and returns there at100. Zero produces no measured path, only a small start marker. Full100 uses two arcs to draw the complete circle, not a coincident-endpoint empty arc. Loading/Empty withhold graph/table; Ready restores choices. Reset returns A, Core, Half and ready. No request or record changes.

## How to use it

1. Define the denominator for each percentage. Independent targets are not parts of a shared total; do not add them into a donut.
2. Keep track domain, start and direction consistent. Every ring here uses0–100 and the same sweep/start, even at different radii.
3. Explain radius bias. Equal percentages produce equal angles but longer paths on outer rings. Use exact text or straight bars if users need precise comparisons.
4. Handle0 and100 explicitly. Zero must not acquire rounded-cap length; a full circle needs two SVG arcs or another complete-circle representation.
5. Use stable order and label every ring. Outer-to-inner order here is fixed and repeated in buttons/table.
6. Define under/over-target behavior before drawing. This bounded controller accepts only nonnegative0–100 fixtures; it does not silently clamp live data or support multiple revolutions.
7. Preserve exact values and keyboard selection. Hover-only rings do not provide accessible touch/keyboard comparisons.

## Anatomy and actual API

`RadialBarChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and `sweep`. Core/Support/Growth/Retention values are A35/48/41/61, B42/36/55/48, edges0/25/75/100 or four zeros. Sweep is half or full. These are fixed fixtures, not a goals API.

The320×235 SVG centers160,115. Ring radius is80−17i; track stroke is9 with butt caps. Half starts at180° and sweeps180° clockwise; full starts270° and sweeps360°. Measured angle is span×v/100. Coordinates use(centerX+r cos(a),centerY+r sin(a)) in SVG's downward Y system. Full100 is split into two180° arcs so matching start/end does not collapse. Zero omits the measured path and adds a presence dot at the start. Selection changes stroke/opacity, not angle or radius. Track paths always represent100 for that ring/sweep.

```vue
<script setup>
import RadialBarChartUsageDemo from './.vitepress/theme/RadialBarChartUsageDemo.vue'
</script>
<template><RadialBarChartUsageDemo /></template>
```

A possible host shape, not implemented props:

```ts
type RadialGoal = { id: string; label: string; value: number | null; maximum: number }
type RadialBars = { sweep: 180 | 360; goals: RadialGoal[] }
```

Validate finite nonnegative value, positive maximum, stable IDs and consistent denominator semantics. Define missing/overflow policies and preserve selected IDs through sorting/filtering. Compute fraction value/maximum before drawing. More rings need spacing/layout rules; this controller does not implement arbitrary goals, per-ring maxima, long labels, negative values or overflow turns.

Native ring buttons select on focus or activation with pressed state. Dataset/sweep/state changes retain selected index because ring identity is fixed. Table/status and paths use the same values/span. No request, timer, subscription or external animation handle is created.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | ChartGallery Grouped radial arcs specimen uses four half-circle tracks. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not independent goal APIs. |
| [Polar chart](/polar-chart), [Bar chart](/bar-chart) | Directional sectors or straight magnitudes, not concentric completion arcs. |

ChartGallery declares only `language` String default lustro and renders the full collection. No radial-only, goals, sweep, maximum or selected-ring prop and no selection emit exists. A/B and Ready/Loading/Empty are gallery-global; the native radial card has no half/full toggle.

Native `radial` shares a branch with rings/polar but uses four tracks centered160,154 with radii76/59/42/25. Tracks use half-circumference πr dash/gap and−180° rotation. Measured arcs use dash lengthπr×v/100 followed by a full-circumference gap, width10 and rounded caps. A uses35/48/41/61, B42/36/55/48 from the first four primary values. Readout calls them Ring1–4 percentages, selected via focus/mouseenter groups and Item1–4 buttons. Rounded caps can visually extend tiny values; this new example uses butt caps and explicit zero/full fixtures.

The source has no reference denominator data, arbitrary goal adapter or overflow policy. Selection persists with no mouseleave reset. Full circles belong to the separate rings/polar branch with three tracks, not a native mode toggle. This guide's four-ring half/full controller, exact angle table and edge cases are original additions, not native controls.

Manual Loading/Empty are global demonstrations, not requests; Show sample data restores ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount. CSS transitions are separate. Theme wrappers do not imply an installed chart package or universal goal API.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B/zero/edges | Percentages, angles, paths and exact table update together. |
| Half/full | Same fractions; span/start and matching tracks change. |
| Selected ring | One pressed button, brighter thicker arc and exact status. |
| Loading/empty/reset | Values withheld/recovered; reset A/Core/half/ready. |

SVG entrance fades over200ms on dataset/sweep remount; reduced motion removes it. Percentages do not count through invented progress. Ring order, exact text and outline supplement color. Native controls handle keyboard input, SVG describes encoding and the table exposes exact values/angles. This is not screen-reader certification.

Check A/B/zero/edges exact percentages/angles, path radii/start/end/large-arc flags, half/full track alignment, full100 two-arc completion, omitted zero measured paths, selection/state retention, focus/Enter/Space, loading/empty/recovery/reset, reduced motion, chart/labels/table/source-map readability, actual filesystem body routes, overflow and console errors. A real adapter needs null/nonfinite/out-of-range values, denominators, duplicate IDs, long labels, many goals and stale/error cases.

<style>
@media(max-width:700px){.radial-bar-chart-guide .vp-doc table:not(.rbusage-data),.radial-bar-chart-guide .vp-doc table:not(.rbusage-data) tbody,.radial-bar-chart-guide .vp-doc table:not(.rbusage-data) tr,.radial-bar-chart-guide .vp-doc table:not(.rbusage-data) td{display:block;width:100%;box-sizing:border-box}.radial-bar-chart-guide .vp-doc table:not(.rbusage-data) thead{display:none}.radial-bar-chart-guide .vp-doc table:not(.rbusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.radial-bar-chart-guide .vp-doc table:not(.rbusage-data) td{overflow-wrap:anywhere}.radial-bar-chart-guide .vp-doc table:not(.rbusage-data) tr{margin-bottom:12px}}
</style>
