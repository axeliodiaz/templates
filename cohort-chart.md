---
pageClass: cohort-guide
---
<script setup>
import CohortUsageDemo from './.vitepress/theme/CohortUsageDemo.vue'
</script>

# Cohort retention chart

A cohort retention matrix compares groups that started together across elapsed periods. Rows identify signup groups; columns are age since signup, not the same calendar month for every row. Color is a percentage with a fixed original-cohort denominator. Use a [heatmap](/heatmap) for a general row/column value matrix or a [line chart](/line-chart) for trends. A color matrix alone does not define retention, eligibility or a denominator.

## Try elapsed, missing and zero-size cohorts

<CohortUsageDemo />

A includes a missing elapsed count, a measured zero followed by returning users, and a known zero-size cohort. B has positive cohort sizes and a different missing elapsed cell. Three future coordinates are placeholders, not zero observations. Select any coordinate to inspect the count/denominator or why no percentage exists. Dataset/state changes retain the coordinate; Loading/Empty withhold the grid/table, Ready restores it. Reset returns A/Jan M0/ready. No request or edit occurs.

## How to use it

1. Define cohort membership and activity. Here each row is a fixed original signup group; retained means active during that elapsed monthly period among its original members. This is period retention, not continuously surviving membership or cumulative return probability.
2. Fix the denominator. Percent=100×active/original N, not the prior period's active count. Jan A M1 is 60/100=60%; Feb A M2 is 10/50=20%, not division by its preceding zero.
3. Separate calendar time and age. Jan M1 is one elapsed period after Jan signup; Feb M1 is one after Feb signup. The fixture has no actual year/timezone/calendar-boundary calculation. Age limits 3/2/1 produce a triangular observation window.
4. Distinguish Future (not elapsed), Missing (elapsed count unavailable), N/A (known N=0) and measured 0%. All have different meanings. Future has no count; a known 0/0 has counts but no defined percentage.
5. Keep thresholds fixed across cohorts/datasets. Four discrete bands are[0,25),[25,50),[50,75),[75,100]. Integer legend labels match these integer fixtures; a decimal adapter needs interval labels. No row normalization or local maximum rescaling occurs.
6. Show counts with percentages. A50% cell from 20 people is not equivalent evidence to 50% from 2,000. Exact table and status disclose original N and active count. Do not sum percentages across cohorts or compare newer unavailable periods as zero.
7. Do not enforce monotonicity for this definition. Members may return after inactivity, so period retention may rise. Survival retention would need a different definition and data contract. This chart does not calculate churn, significance, revenue retention or causal effects.

## Anatomy and actual API

`CohortUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and root element. A Jan N 100 has counts 100/60/null/30 at M0–M3; Feb N 50 has 50/0/10 through M2; Mar N 0 has 0/0 through M1. B Jan N 80 has 80/40/32/20; Feb N 40 has 40/null/8; Mar N 20 has 20/10. Age limits remain 3/2/1. Future wins before count lookup; elapsed null becomes missing; elapsed count with N 0 becomes undefined; otherwise compute active/N×100.

Rows use 44px label columns including N, plus four equal `minmax(0,1fr)` data columns with 6px gaps. Twelve native buttons have minimum height 44px and visible value/state text. Numeric band=min(3,floor(percent/25)); future is dashed, missing hatched, undefined gray. All coordinates remain selectable, including future placeholders. One pressed button/outline and status share row-major index 4×row+age. No percentage or color changes on selection. The exact table has twelve rows and repeats active/N and derived percentage/state.

```vue
<script setup>
import CohortUsageDemo from './.vitepress/theme/CohortUsageDemo.vue'
</script>
<template><CohortUsageDemo /></template>
```

Possible host input, not implemented props:

```ts
type RetentionCohort = { id: string; originalSize: number; elapsedPeriods: number; active: (number | null)[] }
```

Validate unique cohort IDs, finite nonnegative integer N/counts, active≤N for this user-count definition, age/window bounds and explicit null policy. Validate M0's meaning rather than assuming 100% when activity criteria differ from signup. Establish cohort exclusion, time unit, timezone, acquisition boundary, late data and identity deduplication. Missing counts must not become 0 or future. This fixed controller has no arbitrary cohort input, aggregation, activity-event processing, calendar cutoff calculation, confidence intervals, filter, export, request or error adapter.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery cohort member-retention card. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Theme wrappers around the same cohort implementation, not independent retention APIs. |
| [Heatmap](/heatmap), [Line chart](/line-chart) | General matrix or time-series alternatives; they do not define cohort membership. |

ChartGallery declares only `language` String default lustro and renders the full collection. No cohorts, originalSize, active counts, age, cutoff, missing, selected-cell prop or selection emit exists. Four row names Jan/Feb/Mar/Apr and M0–M3 labels use index i=4×row+age. Native `cohortCells` keeps row+age<4, producing ten cells; future cells are omitted, not measured zero. `extraOptions` uses those same ten indices and labels for the selection buttons.

Native retention is 100 for M0; otherwise max(0,100−15×age−4×row+(B?5:0)). A Jan is 100/85/70/55; Feb 100/81/66; Mar 100/77; Apr 100. B adds 5 points only outside M0. These are synthetic prefilled percentage formulas, not ratios from member counts. There are no cohort sizes, active counts, actual event dates, denominator validation, null elapsed cells or zero-size case. A/B changes percentages, not observation ages.

Native SVG cell x=65+58×age, y=34+34×row, width 54/height 30. Opacity=.35+.0065×percentage; each cell text prints its percentage. Headers sit at x 93+58×age/y 20; row labels at x 12/y 56+34×row. Caption says M0=signup month and future=blank. Focus/mouseenter on cell groups and focus/click on ten label buttons update persistent cohort/month/percent readout; no mouseleave reset, pressed-coordinate state or exact count table exists. Global Ready/Loading/Empty is manual demo state; Show sample data restores ready. Shared Motion mounts cards, refreshes after sample/state and destroys on unmount.

This guide's three-cohort original-count calculation, returning-user zero example, elapsed missing counts, known zero-size denominator, explicit selectable future/missing/N/A states, exact count table, fixed discrete legend and reset are original additions. Theme wrappers and Vue/SVG specimens do not imply an installed cohort analytics package.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Recompute period retention from original count denominators; age window unchanged. |
| Future/missing/N/A | Separate time-unavailable, count-unavailable and undefined denominator states. |
| Measured 0% | Observed 0 active with positive N; lightest numeric band, not missing. |
| Loading/empty/reset | Withhold/recover grid/table; reset A/Jan M0/ready. |

Shared Motion fades cells through explicit fade markers without inventing intermediate retained members. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Text, hatch/dash, denominator labels, exact table, one selected outline and native keyboard/touch controls supplement color. No hover is required. These are implementation checks, not screen-reader certification.

Check every A/B count/denominator/percentage/state. This example has nine elapsed coordinates and three future coordinates (4+3+2), unlike the native four-row ten-cell triangle. Verify 0/positive=0%,0/0 undefined, null distinct from future, returning-user increase, fixed thresholds, exact table/status/order/geometry, state retention/reset/keyboard/reduced motion/unmount and desktop/mobile grid/legend/table/source-map pixels. Validate filesystem routes, overflow and errors. Live adapters need invalid counts, duplicate people/cohorts, time eligibility, late events, long labels, large matrices, decimal percentages and stale/error policies.

<style>
@media(max-width:700px){.cohort-guide .vp-doc table:not(.chusage-data),.cohort-guide .vp-doc table:not(.chusage-data) tbody,.cohort-guide .vp-doc table:not(.chusage-data) tr,.cohort-guide .vp-doc table:not(.chusage-data) td{display:block;width:100%;box-sizing:border-box}.cohort-guide .vp-doc table:not(.chusage-data) thead{display:none}.cohort-guide .vp-doc table:not(.chusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.cohort-guide .vp-doc table:not(.chusage-data) td{overflow-wrap:anywhere}.cohort-guide .vp-doc table:not(.chusage-data) tr{margin-bottom:12px}}
</style>
