---
pageClass: histogram-guide
---
<script setup>
import HistogramUsageDemo from './.vitepress/theme/HistogramUsageDemo.vue'
</script>

# Histogram

A histogram groups numeric observations into intervals and plots their frequencies. X is a numeric range, not a set of unrelated categories. Equal-width bins can use count height; unequal widths need density if area should represent frequency. Use [bars](/bar-chart) for categories, a [scatter plot](/scatter-plot) for paired measures, or a box plot for a compact distribution summary. Bin choices can change apparent shape, so disclose them.

## Try raw samples and boundary rules

<HistogramUsageDemo />

A has 19 raw durations; B has 8 including every boundary and repeated 60. One occupied bin places five 30-minute observations in[30,40). No samples draws no bars and undefined shares, not six zero-minute observations. Switch dataset and select a bin to inspect count/share. Raw samples are available in the disclosure. Loading/Empty withhold geometry/table; Ready restores choices. Reset returns A/first bin/ready. No requests or edits occur.

## How to use it

1. Define the measured variable, unit, domain and sample inclusion policy. These synthetic durations are nonnegative minutes in 0–60.
2. Specify exact edges and closure. Bins are[0,10),[10,20),[20,30),[30,40),[40,50),[50,60]. Internal boundary 10 belongs to the second bin;60 belongs to the last. Every valid sample is counted once.
3. Derive counts from observations or label pre-binned input honestly. This controller computes bins from raw arrays; the native specimen uses prefilled counts.
4. Keep bin edges and vertical scale fixed for comparisons. Here width 10 and count axis 0–6 do not change across A/B. Different sample sizes affect counts; use proportions/density when that is the comparison intended.
5. Distinguish count, proportion and density. Height here is count; table share is count/N. With unequal widths, count-height area would mislead unless explicitly intended; density=count/(N×binWidth) gives area proportional to share.
6. Preserve zero-count bins as intervals with no filled area. No samples means undefined proportions. A measured zero belongs to the first bin and is not missing.
7. Avoid overclaiming distribution shape. Small samples and arbitrary bin edges do not prove normality, modality or an outlier threshold. No statistical estimate is calculated here.

## Anatomy and actual API

`HistogramUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and root element. A samples 0,5,9,10,10,19,20,22,25,29,30,35,39,40,45,49,50,55,60 produce counts 3/3/4/3/3/3. B 0,10,20,30,40,50,60,60 produces 1/1/1/1/1/3. Single 30 repeated five times produces 0/0/0/5/0/0; zero is an empty array. N equals sum of counts for these fixtures.

The 330×250 SVG plots x 42–294, y 50–200. Six bins have nominal width 42, corresponding to 10 minutes each; x=42+42i. Y=200−25×count, height 25×count. Count ticks 0/2/4/6 use the same mapping. Bars abut at bin boundaries; thin border decoration does not redefine their numeric width. Zero-count intervals get a baseline marker without a positive rectangle. X ticks 0/10/20/30/40/50/60 mark boundaries, not bin midpoints. Selection changes opacity/outline, not frequency or bin width.

```vue
<script setup>
import HistogramUsageDemo from './.vitepress/theme/HistogramUsageDemo.vue'
</script>
<template><HistogramUsageDemo /></template>
```

Possible host data, not implemented props:

```ts
type HistogramInput = { samples: number[]; edges: number[]; finalUpperIncluded: boolean; unit: string }
```

Validate finite samples, strictly increasing edges, closure, domain exclusion/overflow policy and nonempty bin structure. Missing/nonfinite durations must not silently become zero. If using pre-binned counts, validate finite nonnegative counts, interval disjointness and reconcile total N rather than pretending raw samples were binned. This fixed controller has no arbitrary edges, adaptive binning, unequal-width density mode, weights, under/overflow bins, dynamic y maximum, live request or error adapter.

Native buttons select on focus/activation with one pressed state. Fixed bin index survives dataset/state changes, including a zero-count bin. Exact table/status use the same computed counts and raw N; shares use one decimal and N/A at N=0. Raw sample disclosure keeps duplicates and observed zeros. No selection filtering or rebucketing occurs.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Histogram attendance distribution, pre-binned class counts. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not independent binning/data APIs. |
| [Bar chart](/bar-chart), [Scatter plot](/scatter-plot) | Categories or paired observations rather than a one-variable distribution. |

ChartGallery declares only `language` String default lustro and renders the collection. No histogram-only, samples, edges, density, weights or selected-bin prop and no selection emit exists. Native bins are string labels 0–9/10–19/20–29/30–39/40–49/50–59 attendees, counts A 3/8/16/22/12/5, B 2/6/13/25/18/8. These are prefilled frequencies, not computed from raw attendance observations. Labels imply integer buckets, but no code validates integer/domain/edge closure or excludes an upper 60.

Native Y=166−4×count, height 4×count; ticks 0/10/20/30 match that mapping. Rect x 32+45i, width 43, leaving 2-unit gaps. X labels sit at 53+45i; top caption is Classes. Focus/mouseenter groups and focus/click bin-label buttons select persistent readout stating attendees interval and number of classes. No mouseleave reset, sample list, total, density mode or exact-data table exists. A/B updates prefilled counts, not bin edges.

This guide's duration variable, explicit continuous interval closure, raw sample binning, boundary fixture, one-bin/empty samples, reconciled N/table/share and abutting nominal bins are original additions, not native controls. Global Ready/Loading/Empty is demonstration state; Show sample data restores ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount. Vue/SVG specimens and theme wrappers do not imply an installed histogram package.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Raw samples, counts, N and shares update using fixed edges/axes. |
| One-bin/no samples | Only one occupied interval or no bars/undefined shares. |
| Selected bin | One pressed button and outlined opaque bar; counts unchanged. |
| Loading/empty/reset | Withhold/recover samples/geometry/table; reset A/first bin/ready. |

Shared Motion fades bars on entry/refresh through explicit fade markers, not growing frequencies through invented observations. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Exact intervals, count table, raw disclosure, outlines and native keyboard/touch controls supplement color; no hover is required. This is not screen-reader certification.

Check every fixture's raw sample assignment including 0/10/20/30/40/50/60 and duplicate boundaries, sum(counts)=N, table shares, exact bar x/y/width/height and ticks, zero omission/markers, one occupied bin, selection/state/reset/keyboard/reduced motion/unmount, desktop/mobile chart/table/raw/source-map pixels, filesystem routes, overflow and errors. Live adapters need nonfinite/out-of-range observations, invalid edges, weights, unequal bins, large counts, long labels and stale/error policies.

<style>
@media(max-width:700px){.histogram-guide .vp-doc table:not(.hgusage-data),.histogram-guide .vp-doc table:not(.hgusage-data) tbody,.histogram-guide .vp-doc table:not(.hgusage-data) tr,.histogram-guide .vp-doc table:not(.hgusage-data) td{display:block;width:100%;box-sizing:border-box}.histogram-guide .vp-doc table:not(.hgusage-data) thead{display:none}.histogram-guide .vp-doc table:not(.hgusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.histogram-guide .vp-doc table:not(.hgusage-data) td{overflow-wrap:anywhere}.histogram-guide .vp-doc table:not(.hgusage-data) tr{margin-bottom:12px}}
</style>
