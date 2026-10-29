---
pageClass: sunburst-chart-guide
---
<script setup>
import SunburstChartUsageDemo from './.vitepress/theme/SunburstChartUsageDemo.vue'
</script>

# Sunburst chart

A sunburst lays out a hierarchy as concentric rings. Depth moves outward; a child's angular interval stays within its parent. Angle encodes share of one additive whole. Outer sectors have more area per degree, so do not compare area across depths or add parent totals to their children. Use a [treemap](/treemap) for rectangular hierarchy, a [donut](/donut-chart) for one flat level, or [bars](/bar-chart) for precise ranking.

## Try two depths and exact shares

<SunburstChartUsageDemo />

Operations contains Rent/Utilities; People contains Coaches/Support. A leaves 35/25/30/10 total 100; B 20/20/40/120 total 200. Switch A/B, One nonzero leaf and All zero, then select a node. Parent values and all angles derive from leaves. Single makes Operations and Utilities full annuli at their own depths; zero draws neutral tracks without sectors or percentages. Loading/Empty withhold SVG/table; Ready restores choices. Reset returns A/Operations/ready. No drilldown, request or persistence happens.

## How to use it

1. Define one additive leaf measure and a clear hierarchy. Compute parent totals from children; the whole is the leaf sum, not all table rows combined.
2. Keep parent and child angle spans aligned. Children partition their parent's interval, not their own independent 360° ring.
3. Distinguish share of whole from share of parent. Rent 35 in A is 35% of the whole and 58.3% of Operations 60. Its angular width is 126°, not 210°.
4. Explain depth and unequal area. The two rings here use the same radial thickness but different radii; equal angle does not mean equal area across depths.
5. Keep order stable across updates and provide exact text. Tiny sectors can be hard to read; this controller labels through controls/table instead of squeezing names into wedges.
6. Handle zero and full intervals explicitly. Zero nodes have no sector.360° needs split outer and inner arcs, not a coincident-endpoint single arc.
7. Keep selection separate from navigation. This example highlights a node but retains the whole. Real drilldown needs a breadcrumb, changed denominator disclosure and a way back.

## Anatomy and actual API

`SunburstChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and root element. Leaf fixtures A 35/25/30/10, B 20/20/40/120, single 0/100/0/0 or zero 0/0/0/0. Computed node order is Operations, People, Rent, Utilities, Coaches, Support. Parents are first-two leaf sums and last-two leaf sums; their parent is the whole.

The 320×220 SVG centers 160,95. Inner ring radii 26–53 and outer 57–84 leave a 4-unit depth gap. Start 0° at top, clockwise. Each node starts at cumulative preceding leaf units/total×360; end adds its own value/total×360. Parent spans aggregate their child spans. The sector path follows outer arc clockwise and inner arc counterclockwise. Spans >180° set large-arc flags; a full 360° uses two 180° arcs on each boundary. Zero nodes omit paths. Thin strokes decorate nominal intervals without changing computed angles.

```vue
<script setup>
import SunburstChartUsageDemo from './.vitepress/theme/SunburstChartUsageDemo.vue'
</script>
<template><SunburstChartUsageDemo /></template>
```

A possible general model, not implemented props:

```ts
type ExpenseNode = { id: string; parentId: string | null; label: string; units?: number | null }
```

Validate unique IDs, one root policy, known parent references, acyclic structure, nonnegative finite additive leaf units, missing-value policy and total overflow. Avoid supplying both parent and child units without a reconciliation rule. Sort/order by stable IDs, not incidental array position, for a real adapter. This fixed two-depth/six-node controller implements no arbitrary tree, labels inside sectors, drilldown, collapse, zoom, filtering, loading request or error adapter.

Buttons select on focus/activation; one pressed state and a brighter outlined sector supplement status. Selected index survives dataset/state changes even when that node is zero. The table contains both parents and leaves, explicitly overlapping rows, with units and one-decimal whole/parent shares. At whole or parent total zero, the relevant denominator is undefined, shown as N/A. A zero node in a positive parent is 0.0%. Selection never renormalizes or changes totals.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Sunburst expense hierarchy with six fixed sectors. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not independent tree/drilldown APIs. |
| [Treemap](/treemap), [Donut](/donut-chart) | Rectangular hierarchy or one flat shared whole. |

ChartGallery declares only `language` String default lustro and renders the entire collection. No sunburst-only, tree, root, units, selected-node or drilldown prop and no selection emit exists. Global A/B does not change its fixed `sunNodes`; Ready/Loading/Empty is a gallery demonstration. Show sample data restores ready.

Native inner nodes Operations 60% spans 0–216° and People 40% spans 216–360°, radii 28–56. Outer Rent 35% spans 0–126°, Utilities 25%126–216°, Coaches 30%216–324°, Support 10%324–360°, radii 60–86. Center 160,100, top start. Sector path uses clockwise outer and reverse inner arcs with large-arc test >180°. It has no zero/full fixtures and no full 360° split path. Center reads 100%, not a raw-unit total.

Native focus/mouseenter sectors and named node readout buttons select one of six nodes. Readout describes percent of total expenses, not percent of parent. Selection persists without mouseleave reset. This is a valid static two-depth hierarchy, but not a computed tree layout: values, spans and radii are hardcoded independently. No source raw-unit denominator or parent-value reconciliation is supplied.

This guide's count-derived A/B, parent sums, whole-vs-parent table, single/zero fixtures and complete-annulus handling are original additions, not native controls. Shared Motion mounts on gallery cards, refreshes after dataset/state and destroys on unmount. Vue/SVG specimens and theme wrappers do not imply an installed third-party chart package or universal tree API.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Parent totals, child alignment, angles and share denominators update together. |
| Single/zero | Full annuli for one branch or neutral tracks without sectors. |
| Selection | One pressed button, outlined sector and exact unit/whole/parent status. |
| Loading/empty/reset | Withhold/recover geometry/table; reset A/Operations/ready. |

Shared Motion fades sectors on entry/refresh using explicit fade markers. Reduced motion skips entry effects; refresh stops/restores previous controls and unmount destroys observers/listeners/controls. No angles sweep through invented intermediate data. Names, exact table, parent membership and selection outline supplement color. Native controls support keyboard/touch, SVG describes depth/angle, and no hover is required. This is not screen-reader certification.

Check both datasets' leaf totals and parent sums, every sector path/radii/start/end/large-arc flags, parent-child span containment and full leaf partition, single annulus four-arc paths, omitted zero sectors and undefined shares, selection/state retention/reset, keyboard, reduced motion/unmount, graph/table/source-map desktop/mobile pixels, filesystem body routes, overflow and errors. A general tree adapter also needs null/nonfinite/negative/overflow validation, orphan/cycle/multiple-root rules, many/deep nodes, long labels, sorting, filters, drilldown and stale/error cases.

<style>
@media(max-width:700px){.sunburst-chart-guide .vp-doc table:not(.sbusage-data),.sunburst-chart-guide .vp-doc table:not(.sbusage-data) tbody,.sunburst-chart-guide .vp-doc table:not(.sbusage-data) tr,.sunburst-chart-guide .vp-doc table:not(.sbusage-data) td{display:block;width:100%;box-sizing:border-box}.sunburst-chart-guide .vp-doc table:not(.sbusage-data) thead{display:none}.sunburst-chart-guide .vp-doc table:not(.sbusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.sunburst-chart-guide .vp-doc table:not(.sbusage-data) td{overflow-wrap:anywhere}.sunburst-chart-guide .vp-doc table:not(.sbusage-data) tr{margin-bottom:12px}}
</style>
