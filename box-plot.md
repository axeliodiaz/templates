---
pageClass: box-plot-guide
---
<script setup>
import BoxPlotUsageDemo from './.vitepress/theme/BoxPlotUsageDemo.vue'
</script>

# Box plot

A box plot summarizes a numeric distribution with quartiles, median and a declared whisker rule. It is not a confidence interval or a complete picture of the distribution: different samples can have the same summary. Use a [histogram](/histogram) for binned shape, a [scatter plot](/scatter-plot) for paired records or raw dot plots for small samples. Group sample size and units matter when comparing boxes.

## Try quartiles and two whisker rules

<BoxPlotUsageDemo />

Switch A/B or Ties and singleton, select a group and compare 1.5×IQR with Min/max. Quartiles stay the same when whisker rules change. In A/Group A,90 is outside the upper fence and whisker ends at 40; Min/max extends to 90 and removes the outside marker. Ties/singleton retain a median line even when box/whisker collapse. Loading/Empty withhold SVG/table/raw samples; Ready restores choices. Reset returns A/Group A/IQR/ready. No request or stored change exists.

## How to use it

1. Declare the unit, group identity and sample count. These fixtures are synthetic values in 0–100 units, not dollar estimates or inferred populations.
2. Name the quartile convention. Here linear interpolation uses index (N−1)p in a sorted copy, with p=.25,.5,.75. Different software conventions can produce different quartiles on small samples.
3. Name the whisker rule. Min/max uses observed extrema.1.5×IQR uses the most extreme actual observations inside inclusive fences Q1−1.5IQR and Q3+1.5IQR; endpoints are not the fences themselves.
4. Keep outside observations separate from errors. A point beyond the fence is not automatically invalid or a causal anomaly. This guide does not remove it from quartile calculation or raw samples.
5. Use a common quantitative scale. Boxes here share fixed 0–100; unequal sample sizes do not change box height or imply a weight encoding.
6. Handle ties and very small N explicitly. All ties or a singleton yields Q1=median=Q3 and zero IQR. A visible median remains; do not invent a minimum-width box that misrepresents spread.
7. Keep raw samples accessible. Quartiles hide modes, gaps and duplicate counts. This controller's disclosure includes each raw list and N.

## Anatomy and actual API

`BoxPlotUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected`, `rule` and root. A groups are[10,20,25,30,35,40,90], [20,30,40,50,60], [5,10,15,20,25,30,35]. B groups[0,10,20,30,40], [40,45,50,55,60,65,100], [10,20,30,40,50,60,70]. Ties groups[25,25,25], [0], [50,50,50,50]. Stats are computed from sorted copies; no raw sample mutation.

The 330×245 SVG maps units to x 70+2.1v. Group center y 50+55i; box y 39+55i, height 22. Box starts at Q1, width 2.1(Q3−Q1); median is a vertical line at its mapped value. Whisker horizontal line goes from actual low to actual high, caps are 16 high. Outside points have radius 3 at true values, with no jitter; duplicates can overlap. Ticks 0/25/50/75/100 use the same mapping. Selection changes row opacity, not summary or coordinates.

```vue
<script setup>
import BoxPlotUsageDemo from './.vitepress/theme/BoxPlotUsageDemo.vue'
</script>
<template><BoxPlotUsageDemo /></template>
```

Possible host shape, not implemented props:

```ts
type SampleGroup = { id: string; label: string; samples: number[] }
type BoxRules = { quartiles: 'linear-index-n-minus-one'; whiskers: 'minmax' | '1.5-iqr'; unit: string }
```

Validate unique groups, finite samples, a missing-value policy and scale bounds. Empty groups need a no-summary state rather than calling quantiles on an empty array. The current fixtures are all nonempty; Empty is a manual whole-controller state, not an implemented per-group-empty adapter. Precomputed summaries need ordered min≤Q1≤median≤Q3≤max and explicit provenance; do not claim raw computation from a five-number input. No arbitrary data, weighted quantiles, alternate quartile methods, notches, confidence intervals, variable-width boxes or async error adapter exists here.

Buttons select on focus/activation; fixed group index persists through dataset/rule/state. Table gives Q1/median/Q3 and actual whisker ends; status adds N and outside values. Raw disclosure exposes all observations. Min/max mode does not delete values; it changes endpoints and suppresses outside markers because all observations lie within those extrema.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Box plot revenue spread, precomputed five-number arrays. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not independent quantile/whisker APIs. |
| [Histogram](/histogram), [Scatter plot](/scatter-plot) | Binned distributions or paired raw observations rather than quartile summaries. |

ChartGallery declares only `language` String default lustro and renders all cards. No boxplot-only, samples, summaries, quartile method, whisker rule or selected-group prop and no selection emit exists. Native four groups Ride/Power/Endurance/Sprint use A[20,40,55,70,90], [30,50,65,80,100], [15,35,50,65,85], [25,45,60,75,95]. B adds 5 to every number, including extrema; these arrays are not calculated from raw observations.

Native whiskers are explicitly min/max, not 1.5IQR. X maps 75+2v; ticks 0/50/100 use that mapping and dollar labels. Box xQ1, width 2(Q3−Q1), height 22; median line and min/max caps draw directly from five numbers. Groups are y 33+36i. B can extend to 105 beyond the 100 tick without a declared domain policy. Readout lists min/Q1/median/Q3/max revenue in dollars; no N, raw samples, outliers or quantile convention is supplied.

Native focus/mouseenter groups and focus/click named class buttons select persistent readouts, without mouseleave reset. This guide's raw samples, interpolation formula, IQR/minmax switch, actual in-fence endpoints, outside markers, ties/singleton, fixed scale/table/disclosure are original additions. Global Ready/Loading/Empty is demonstration state; Show sample data restores ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount. Vue/SVG specimens and theme wrappers do not imply an installed statistics/chart package.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B/ties | Quartiles, actual whiskers, outside observations and N recompute together. |
| Whisker rule | Same quartiles; endpoints/outside markers change by explicit rule. |
| Selection | One pressed button, opaque group and exact status, no data changes. |
| Loading/empty/reset | Withhold/recover SVG/table/raw samples; reset A/first group/IQR/ready. |

Shared Motion fades marks on entry/refresh using explicit fade markers rather than moving quartiles through invented statistics. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Exact table/status/raw lists, median/caps and native keyboard/touch controls supplement color. This is not screen-reader certification.

Check both datasets/rules/ties/singleton independent quartile calculations, ordered summaries, actual whisker endpoints vs fences, outside inclusion and raw counts, exact box/median/cap/outlier coordinates and ticks, zero-width median visibility, selection/state/reset/keyboard/reduced motion/unmount, desktop/mobile graph/table/raw/source-map pixels, filesystem routes, overflow and errors. Live adapters need empty groups, missing/nonfinite/out-of-range values, ID validation, huge samples, duplicate outside points, long labels and stale/error policies.

<style>
@media(max-width:700px){.box-plot-guide .vp-doc table:not(.bxusage-data),.box-plot-guide .vp-doc table:not(.bxusage-data) tbody,.box-plot-guide .vp-doc table:not(.bxusage-data) tr,.box-plot-guide .vp-doc table:not(.bxusage-data) td{display:block;width:100%;box-sizing:border-box}.box-plot-guide .vp-doc table:not(.bxusage-data) thead{display:none}.box-plot-guide .vp-doc table:not(.bxusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.box-plot-guide .vp-doc table:not(.bxusage-data) td{overflow-wrap:anywhere}.box-plot-guide .vp-doc table:not(.bxusage-data) tr{margin-bottom:12px}}
</style>
