---
pageClass: step-line-guide
---
<script setup>
import StepLineUsageDemo from './.vitepress/theme/StepLineUsageDemo.vue'
</script>

# Step line chart

A step line holds a value between boundaries and changes vertically at a boundary. Use it for values that really remain constant until an event, such as a configured capacity, price tier or inventory after a transaction. Do not use it merely to make a continuous measurement look different. A straight line implies linear interpolation; a smooth curve implies another interpolation; a step line explicitly chooses which interval gets each observed value.

## Try boundary conventions and observations

<StepLineUsageDemo />

Choose A/B or All zero, then Step after or Step before. Select a month with its native button. The path changes convention while exact observations, selected mark and table remain the same. Step after holds the earlier value until the next boundary; Step before places the next value across the preceding interval. These are two visual conventions for these fixtures, not evidence of their real effective dates. Loading and Empty withhold path/table rather than converting missing to zero. Ready restores choices; Reset returns A, January, Step after and ready. No request or record changes.

## How to use it

1. Establish what a timestamp means: effective-from, effective-until or measurement time. That decision selects the interval convention; a chart must not guess it from the data's shape.
2. Sort boundaries and define duplicates. These six Jan–Jun labels are equally spaced fixtures, not parsed dates, timezones or unequal intervals.
3. Make the hold rule visible. Step after goes horizontally at the old value, then vertically at the new boundary. Step before goes vertically first, then horizontally at the new value.
4. Keep exact observations distinct from intervals. Dots and table rows show the boundary observations; a vertical segment is a change, not a duration.
5. Avoid invented coverage. The line ends at June. It does not claim a value after June or before January, and no last interval is extrapolated.
6. Distinguish valid zero from no data. A zero series stays visible on the zero baseline; Loading/Empty have no observations to plot.
7. Keep the scale and units stable. Both datasets here use synthetic units on0–100. A real signed series needs an appropriate scale instead of silently clamping negatives.

## Anatomy and actual API

`StepLineUsageDemo.vue` has no props or emits. Refs are `dataset`, `hold`, `selected` and `state`. Computed `primary` selects A35/48/41/61/56/74, B42/36/55/48/72/64 or six zeros. The six labels are Jan–Jun. `x(i)=40+48i` and `y(v)=170−1.4v` map to a320×210 SVG. This is not a data adapter, date parser or persistent controller.

The path starts `M40,y(first)`. For each subsequent observation, Step after appends `H x(current) V y(current)`; Step before appends `V y(current) H x(current)`. There are five horizontal intervals and five vertical commands for either convention. All-zero vertical commands have zero height, so the line still covers January to June at baseline. No area closes to zero and no smoothing occurs.

```vue
<script setup>
import StepLineUsageDemo from './.vitepress/theme/StepLineUsageDemo.vue'
</script>
<template><StepLineUsageDemo /></template>
```

A production host could use this shape; it is not an implemented prop contract:

```ts
type Boundary = {
  effectiveAt: string
  value: number | null
}
type StepSeries = {
  unit: string
  convention: 'after' | 'before'
  boundaries: Boundary[]
}
```

Validate finite values, timezone/ordering, duplicate boundaries and missing intervals before plotting. Do not bridge unknown periods or assume their value is zero. Event histories need a documented rule for multiple changes at one instant. Dates should be spaced by elapsed time where that matters; this fixture deliberately has no such mapping.

Native month buttons update selected index on focus or activation and expose pressed state. Switching dataset, convention or presentation state retains that index. Mark, live readout and table share the same values; the SVG is descriptive, not an extra custom keyboard widget. No timers, listeners, subscriptions or external animation handles require manual cleanup.

## Source coverage and actual gallery behavior

| Source | Actual behavior and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix gallery](/felix/components/charts) | Shared ChartGallery Step progression card, fixed step-after path and fixture arrays. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Theme wrappers around the same gallery, not separate installed step chart APIs. |
| [Line chart](/line-chart), [Area chart](/area-chart) | Distinct interpolation/fill families. A step line is not a filled-area, cumulative-total or range-band switch. |

ChartGallery declares only `language` String default lustro. It renders all cards; no public step-only, data, convention or effective-date prop exists, and it emits no selection event. Dataset A/B and Ready/Loading/Empty are gallery-global. The step card does not have its own convention toggle. It uses X34+48i and Y166−1.5v. Its path starts at the first primary value and appends H then V for each later primary value, so it implements step-after only.

Its six primary dots respond to mouseenter/focus, and month readout buttons select the card index. The default readout includes secondary fixture values even though the step card plots only its primary path. This guide's original isolated controller deliberately shows only the plotted series, adds the convention comparison and provides an exact native table. Source selection persists until another point is picked; there is no mouseleave reset or real effective-date query.

Source loading/empty are manual local states, not requests. Show sample data restores global ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount; path transitions are separate CSS. Do not infer a reusable event-history service or validation from these gallery controls.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B/zero | Fixed scale and synchronized observations, readout and table. |
| Step after/before | Only connecting intervals change; observation dots and values are unchanged. |
| Selected month | One pressed button and one larger primary dot. |
| Loading/empty | Graph/table withheld, descriptive status, controls available. |
| Reset | A, January, Step after and ready. |

The SVG fades over200ms on dataset/convention remount. Reduced motion removes the fade. Numbers never animate through fabricated intermediate values. A text hold-rule label complements the path; the table supplies exact values without hover. Native buttons/selects handle keyboard input. The two-column data table fits narrow widths; prose source maps stack separately. This is not screen-reader certification.

Check A/B/zero values against table/readout/dots, exact H/V command order and endpoints for both conventions, unchanged observations on convention switch, focus/Enter/Space, retained selection, state recovery/reset, reduced motion, axis/hold-label/table/source-map readability, body links, overflow and console errors. A real event feed also needs unordered/duplicate timestamps, uneven intervals, timezone boundaries, gaps, stale/error and negative/nonfinite cases.

<style>
@media(max-width:700px){.step-line-guide .vp-doc table:not(.step-data),.step-line-guide .vp-doc table:not(.step-data) tbody,.step-line-guide .vp-doc table:not(.step-data) tr,.step-line-guide .vp-doc table:not(.step-data) td{display:block;width:100%;box-sizing:border-box}.step-line-guide .vp-doc table:not(.step-data) thead{display:none}.step-line-guide .vp-doc table:not(.step-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.step-line-guide .vp-doc table:not(.step-data) td{overflow-wrap:anywhere}.step-line-guide .vp-doc table:not(.step-data) tr{margin-bottom:12px}}
</style>
