---
pageClass: funnel-guide
---
<script setup>
import FunnelUsageDemo from './.vitepress/theme/FunnelUsageDemo.vue'
</script>

# Funnel chart

A funnel compares ordered stages of a nested population: people reaching a later stage also reached the earlier ones. Stage width can encode count, while overall and previous-step rates answer different questions. Do not add stage counts as if they were disjoint parts. Use a [bar chart](/bar-chart) for unrelated categories, a [Sankey](/sankey-chart) for branching flow and explicit drop-off paths, or [cohort retention](/cohort-chart) for activity by elapsed period where users may return.

## Try counts and denominator choices

<FunnelUsageDemo />

A has 100/75/50/20 people across Signup/Activate/Invite/Pay. B80/40/10/0 ends in measured zero. No drop-off has 50 at every stage; No entrants has four zeros and undefined rates. Switch the readout between overall and previous-step rates without changing bar geometry. Selection and rate mode survive dataset/state changes. Loading/Empty withhold counts/table; Ready restores it. Reset returns A/Signup/overall/ready. No request or edit occurs.

## How to use it

1. Define membership, ordering and window. These synthetic counts describe the same signup cohort progressing in order during one observation window. They are not independent daily event totals or counts of repeated actions.
2. Validate the subset rule. Counts must be nonnegative, nonincreasing and no larger than the first count for this definition. A later count larger than a prior count needs a different definition, not a silently widened conversion funnel.
3. Keep count encoding separate from rates. All bars use the same fixed 0–100 count scale across fixtures. The readout rate selector changes only the denominator, not width or count.
4. Overall rate=count/Signup. A Pay 20/100=20%. Step rate=count/prior stage: A Pay 20/50=40%; the prior-stage loss is 50−20=30 people. These are different from percentage-point change.
5. Handle zero denominators explicitly. B Pay 0/10=0%; No entrants 0/0 is undefined, not 0% or 100%. Signup uses its own count as the reference step and therefore 100% only when positive.
6. Distinguish count loss from rate loss. First stage has no prior-stage loss. Here every subsequent loss is prior−current; no unrelated traffic, skipped stage or re-entry model is inferred.
7. Avoid decorative area claims. Equal-height centered rectangles encode full width, not trapezoid area or an interpolated stage. Centering is layout; bar width is the quantity. Later-stage labels/values remain in table and status even when zero.

## Anatomy and actual API

`FunnelUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected`, `mode` and root element. A100/75/50/20 has overall 100/75/50/20% and step 100/75/66.7/40% after rounding. B80/40/10/0 has overall 100/50/12.5/0% and step 100/50/25/0%. Equal 50/50/50/50 gives all 100% rates; zero gives all N/A. All comparisons use the original unrounded counts; formatting is one decimal.

The 330×260 SVG centers bars at x 160. Stage i has y 29+45i, height 28, width 2.4×count, left x 160−1.2×count. This fixed scale maps 100 to 240 SVG units. Zero omits the rectangle and draws an 8-unit center tick without inventing positive count width. Stage names sit above bars; counts below 20 are placed at the right so narrow bars do not squeeze text. The caption states count domain and first-stage count. Selected row opacity changes; numeric dimensions do not. No trapezoid, flow band or area-normalization calculation exists. Exact table always shows both rate definitions; status follows the selected mode and prior-stage loss.

```vue
<script setup>
import FunnelUsageDemo from './.vitepress/theme/FunnelUsageDemo.vue'
</script>
<template><FunnelUsageDemo /></template>
```

Possible host input, not implemented props:

```ts
type FunnelStage = { id: string; reached: number }
```

Validate unique ordered IDs, finite nonnegative integer counts, subset/monotonic rule and fixed-domain bounds. Missing is not zero. Establish deduplication, cohort inclusion/exclusion, stage-skipping rules, observation window and conversion lag before computing rates. A live feed with eligible or weighted denominators needs a different explicit contract. This fixed controller has no arbitrary stage input, event processing, filters, date range, branching paths, uncertainty estimate, export, request or error adapter.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Stage funnel with four fixed percentages. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared gallery wrappers and separate SankeyFunnel journey where included. |
| [PulseFit blocks](/pulsefit/blocks), [Felix blocks](/felix/blocks), [Lustro blocks](/lustro/blocks), [Lumen blocks](/lumen/blocks), [Scopecraft blocks](/scopecraft/blocks) | ShadcnBlocks Activation funnel with fixed counts and Total/Step labels. |
| [Trial journey](/trial-journey), [Sankey guide](/sankey-chart) | Separate staged flow with explicit sinks; see Sankey guide for actual props, rounding, node controls and layout limits. |
| [Felix status charts](/felix/components/charts) | Status share bars labeled Funnel, not a sequential conversion population. |

ChartGallery declares only `language` String default lustro and renders the collection. No stages, counts, rates, denominator, selected-stage prop or selection emit exists. Native funnel values 100/75/50/24 are fixed percentages; A/B does not change them. Rectangles start x 35, y 18+40i, width 2.5×percentage, height 28. They are left-aligned equal-height bars, not centered trapezoids or flow-conserving bands. Text prints the percentage; readout says Stage N: percentage. Focus/mouseenter on four groups and focus/click on Item 1–4 buttons select persistent readout. No raw counts, conversion/loss calculation, zero-denominator handling, exact table or mouseleave reset exists. Global Ready/Loading/Empty is manual demo state; Show sample data restores ready. Shared Motion mounts cards, refreshes sample/state and destroys on unmount.

`ShadcnBlocks.vue` declares only `theme` String default pulsefit and renders six blocks. Its fixed activation counts are 1280/1046/812/534/296 with names Signed up/Verified email/Created workspace/Invited a teammate/Upgraded to paid. Total mode divides by 1280; Step divides by prior stage (first 100%). Neither mode changes trapezoid geometry or the details' Overall rate/Lost-from-first fields. Stage buttons select on focus/mouseenter; SVG paths have mouseenter only. No explicit click selection or pressed state exists, although native button focus usually selects on click.

Those trapezoids use top width 12+176×count/1280 and next-stage width at bottom; the final bottom width is 74% of its own top. Positive base width and decorative final taper mean area/width is not an exact zero-based count encoding throughout. Hovered stage opacity changes. Fixed note calls Paid the biggest leak by its 55.4% step conversion; it is not a dynamically computed maximum absolute count loss. Motion fades cards/funnel and grows other block bars on mount after an initial reduced-motion check; no retained animation cleanup or live media-change handler is declared there. These are source limitations, not controls in this new example.

`StatusCharts.vue` accepts a counts object for five disjoint statuses, computes each count/total and labels the centered bars Funnel. Width is calc(36%+0.64×rounded percent%), including positive baseline width for zero. These are shares of mutually exclusive statuses, not sequential conversion rates; order need not decrease. Focus/mousemove shows a tooltip; blur/mouseleave hides it. Do not present this specimen as a signup funnel.

SankeyFunnel is a separate title/subtitle-only component: range presets change fictitious source shares/stage rates, drop-off sinks reconcile each stage, KPIs use signups denominator and node readouts expose totals. It does not supply an event-level conversion API. This guide's explicit nested-count contract, fixed count-width scale, A/B/equal/zero fixtures, denominator selector, prior-stage loss, exact table and pressed stage/reset are original additions.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B/equal/zero | Update counts and both rates; fixed domain/order, undefined 0/0 explicit. |
| Rate mode | Overall vs previous-step status only; count geometry/table unchanged. |
| Selected stage | One pressed native button and status; no data edits. |
| Loading/empty/reset | Withhold/recover chart/table; reset A/Signup/overall/ready. |

Shared Motion fades explicit bars rather than animating invented intermediate people or rates. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Exact table, count labels, selected opacity, zero tick and native keyboard/touch controls supplement color. No hover is required. These checks are not screen-reader certification.

Check every fixture's counts, overall/step denominators, rounding, losses,0/positive and 0/0, exact centered x/y/width/height, equal-width equality, zero omission/ticks and unchanged geometry across rate modes. Check selection/state retention/reset, keyboard/reduced motion/unmount, desktop/mobile chart/table/source-map pixels, filesystem routes, overflow and errors. Live adapters need missing/nonfinite/increasing counts, duplicates, stage-skipping, lag/window changes, long labels, many stages and stale/error policy.

<style>
@media(max-width:700px){.funnel-guide .vp-doc table:not(.fnusage-data),.funnel-guide .vp-doc table:not(.fnusage-data) tbody,.funnel-guide .vp-doc table:not(.fnusage-data) tr,.funnel-guide .vp-doc table:not(.fnusage-data) td{display:block;width:100%;box-sizing:border-box}.funnel-guide .vp-doc table:not(.fnusage-data) thead{display:none}.funnel-guide .vp-doc table:not(.fnusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.funnel-guide .vp-doc table:not(.fnusage-data) td{overflow-wrap:anywhere}.funnel-guide .vp-doc table:not(.fnusage-data) tr{margin-bottom:12px}}
</style>
