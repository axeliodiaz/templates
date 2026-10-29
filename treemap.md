---
pageClass: treemap-guide
---
<script setup>
import TreemapUsageDemo from './.vitepress/theme/TreemapUsageDemo.vue'
</script>

# Treemap

A treemap partitions a rectangle into nonnegative parts, optionally nested by hierarchy. Area encodes value relative to the whole, not independent width and height measures. It fits composition with a few clear groups; use [bars](/bar-chart) for precise ranking, [donuts](/donut-chart) for a small flat whole, or a sunburst when radial depth is the point. Do not use area for signed changes or overlapping categories.

## Try a two-level partition

<TreemapUsageDemo />

Platform contains Storage/Compute; Delivery contains Network/Cache. Switch A/B, One nonzero and All zero, then select a resource. A totals 100 units and B 200; both parent widths and child heights are computed from those units. Selection does not filter or renormalize. One nonzero fills the whole rectangle with Compute. All zero draws no tiles and reports undefined shares. Loading/Empty withhold geometry/table; Ready restores choices. Reset returns A/Storage/ready. Nothing is requested or saved.

## How to use it

1. Define one additive measure and one hierarchy. Every leaf belongs to exactly one parent; summing leaves gives the whole. Do not add parent totals again as extra leaves.
2. Distinguish percent of parent from percent of whole. Storage 45 in A is 45% of the whole but 60% of Platform 75. Every tile area here uses whole share.
3. Name the layout algorithm. This fixed two-level slice-and-dice divides parent columns horizontally, then each column's children vertically. It is not a squarified or optimized general-purpose layout.
4. Preserve category identity and order across updates. Layout changes can make visual tracking hard; exact text and stable external controls must remain available.
5. Treat tiny/zero leaves explicitly. Zero leaves create no rectangle; small leaves can omit chart text but stay in table/controls. Never invent a minimum area that changes the encoded share.
6. Label totals and the unit. All-zero known observations are not the same as missing records; shares at total zero are undefined.
7. Use a table for exact comparison. Borders are decoration and reduce visible fill slightly; measure the full rectangle geometry, not colored pixels minus the border.

## Anatomy and actual API

`TreemapUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and root element. A 45/30/15/10; B 20/20/40/120; single 0/100/0/0; zero 0/0/0/0. Index 0/1 maps to Platform,2/3 to Delivery. Values are synthetic units, not percentages supplied by a data service.

The 320×230 SVG contains a 280×180 partition at 20,25. With total T>0, parent g has width 280×parentTotal[g]/T. First parent begins at x 20; second starts after the first parent. A child fills its parent width and has height 180×leafValue/parentTotal. Within each parent, the second child begins after the first child. Therefore leaf area/(280×180)=leafValue/T. No gaps, padding or rounded corners alter the nominal partition; thin borders and a dashed parent divider are overlays. Text is shown only for positive leaves whose tile width ≥62 and height ≥38.

```vue
<script setup>
import TreemapUsageDemo from './.vitepress/theme/TreemapUsageDemo.vue'
</script>
<template><TreemapUsageDemo /></template>
```

Possible host data, not implemented props:

```ts
type ResourceLeaf = { id: string; parentId: string; label: string; units: number | null }
type ResourceParent = { id: string; label: string }
```

Validate finite nonnegative units, unique IDs, known parent references, exclusivity and additive units. Derive parent totals from leaves or reconcile an authoritative subtotal policy. Missing values must not silently become zero. Guard total overflow. A general tree also needs cycle/depth checks, arbitrary-child layout, stable sorting and label rules. None is implemented by this fixed four-leaf controller. There is no drilldown, zoom, hide/filter or live-data/error API.

Selection is external native buttons with focus/activation and one pressed state. It retains fixed index across dataset/state changes, including a zero leaf. Status gives parent/name, raw units, whole share and parent share. Table uses the same values/totals and one-decimal percentages. Undefined shares are N/A in the table, explained below it; zero in a positive parent remains 0.0%. A zero parent has no area and its child-parent shares are undefined.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Tile treemap specimen with four hardcoded rectangles. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery wrappers, not independent hierarchy/layout APIs. |
| [Donut](/donut-chart), [Bar chart](/bar-chart) | A flat whole or exact ranking rather than nested rectangular composition. |

ChartGallery declares only `language` String default lustro and renders the whole collection. No treemap-only, tree, units, selected leaf, layout or drilldown prop and no selection emit exists. Global A/B does not change native treemap rectangles/readouts. Ready/Loading/Empty is a gallery-global demonstration; Show sample data restores ready.

Native data is a flat four-rectangle tiling of x 20–296, y 20–180: Storage at 20,20 width 124.2 height 160; Compute 144.2,20 width 151.8 height 87.27; Network 144.2,107.27 width 91.08 height 72.73; Cache 235.28,107.27 width 60.72 height 72.73. Those areas approximate 45/30/15/10 shares of 276×160. Rounded corners 8 and border 4 change visible filled area. Labels and readouts are hardcoded Storage 45%, Compute 30%, Network 15%, Cache 10%. There is no parent/child hierarchy despite the card's nested-tiles description.

Focus/mouseenter on each native group and focus/click on Item 1–4 readout buttons selects a leaf readout. Selection persists without mouseleave reset. The original source provides no tree adapter, numeric unit denominator, validation, arbitrary layout or exact table. This guide's Platform/Delivery hierarchy, computed parent/child layout, A/B counts, single/zero fixtures, parent-vs-whole shares and table are original additions, not native controls.

Shared Motion mounts on gallery cards, refreshes after dataset/state changes and destroys on unmount. These Vue/SVG specimens are not a third-party package API; a theme wrapper does not install one.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Parent widths, child heights, units and both share denominators update together. |
| One nonzero/all zero | One full tile or no tiles; zero total never divides by zero. |
| Selection | One pressed button and outlined opaque tile, exact status even for zero. |
| Loading/empty/reset | Withhold/recover geometry/table; reset A/Storage/ready. |

Shared Motion fades tiles on entry/refresh using explicit fade markers, not scale transforms that imply changing data. Reduced motion skips entry effects. Refresh restores/stops previous controls; unmount destroys observers/listeners/controls. No counting numbers, requests or stored edits. External controls, parent text, exact table and selection outline supplement color and tiny chart labels. This is not screen-reader certification.

Check A/B totals/parent sums, every tile coordinate/width/height, area shares and sibling tiling without overlap, single full tile, zero omission and undefined whole/parent shares, selection without renormalization, state retention/reset, keyboard, reduced motion/unmount, graph/table/source-map desktop/mobile pixels, source filesystem routes, overflow and errors. A real tree adapter needs null/nonfinite/negative/overflow, duplicate IDs, orphan/cycle validation, many children, long labels, sorting, filters and stale/error cases.

<style>
@media(max-width:700px){.treemap-guide .vp-doc table:not(.tmusage-data),.treemap-guide .vp-doc table:not(.tmusage-data) tbody,.treemap-guide .vp-doc table:not(.tmusage-data) tr,.treemap-guide .vp-doc table:not(.tmusage-data) td{display:block;width:100%;box-sizing:border-box}.treemap-guide .vp-doc table:not(.tmusage-data) thead{display:none}.treemap-guide .vp-doc table:not(.tmusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.treemap-guide .vp-doc table:not(.tmusage-data) td{overflow-wrap:anywhere}.treemap-guide .vp-doc table:not(.tmusage-data) tr{margin-bottom:12px}}
</style>
