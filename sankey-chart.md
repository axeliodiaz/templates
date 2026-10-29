---
pageClass: sankey-guide
---
<script setup>
import SankeyUsageDemo from './.vitepress/theme/SankeyUsageDemo.vue'
</script>

# Sankey chart

A Sankey chart shows flows between nodes using band thickness proportional to quantity. A common scale must apply at both endpoints; node heights reconcile to entering/leaving amounts. Curve length, horizontal position and crossings do not measure volume. Use a [bar chart](/bar-chart) for isolated quantities, a [treemap](/treemap) for a hierarchy's parts, or the [trial journey](/trial-journey) for a richer staged conversion specimen. A Sankey needs actual flows, not unrelated totals joined by decoration.

## Try conserved flow and zero links

<SankeyUsageDemo />

A has four flows 40/20/10/30; B10/30/50/10. One flow sends 100 from A to X and leaves other flows zero. Zero flow has no positive band/node area and undefined shares, not missing observations. Select a transfer including a zero one; table/status remain exact. Dataset/state changes retain transfer index; Loading/Empty withhold flows/table; Ready restores it. Reset returns A/A→X/ready. No request or edit occurs.

## How to use it

1. Define a conserved unit and interval. These are synthetic transferred units from two sources to two destinations, not conversion percentages, revenue and people mixed together.
2. Derive node totals from links. A outgoing=qAX+qAY, B outgoing=qBX+qBY, X incoming=qAX+qBX, Y incoming=qAY+qBY. Source sum=destination sum=total transfers. The controller has no intermediate loss or creation.
3. Use one numeric scale. Link thickness=1.2×units; node height=1.2×its total. That fixed scale remains across A/B/single/zero. Selection never resizes flows or renormalizes one source.
4. Pack endpoint slots without double counting. Each source's links stack by destination; each destination's links stack by source. A link uses the same thickness at both ends, even while its route bends or crosses another link.
5. Omit zero geometry without discarding records. Zero transfers remain selectable and in the table. No minimum positive band or node height invents flow. All-zero share is undefined because total=0.
6. State conservation exceptions. Real processes with drop-offs need explicit sink nodes or a stated accounting boundary. Intermediate node incoming/outgoing mismatch requires a defined inventory/change term, not silent band stretching.
7. Separate routing from meaning. Node order is fixed A/B and X/Y; crossings are not a time ordering. This two-column layout is not a general graph solver, attribution model or causal path estimate.

## Anatomy and actual API

`SankeyUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected` and root element. Link array order is A→X,A→Y,B→X,B→Y. A40/20/10/30 gives source totals 60/40 and destination 50/50. B10/30/50/10 gives 40/60 and 60/40. Single 100/0/0/0 gives 100/0 on both sides; zero is four known zeros. A/B/single total 100.

The 330×340 SVG uses source nodes x 30,width 16; destinations x 284,width 16. First row starts y 40, second y 190. Node height=1.2×total; zero gets only a 16-unit horizontal location tick. Curves run from x 46 to 284 with both cubic control x coordinates 165. Source center y=rowY+sum(previous source-link thickness)+half thickness. Destination center uses its independently stacked preceding source-link thickness. At each endpoint, the stacked intervals exactly partition the node height. Only positive links render. Paths are stroked with width 1.2×value; there is no minimum thickness. Selection changes opacity. Table share=value/full total, one decimal; all-zero is N/A.

```vue
<script setup>
import SankeyUsageDemo from './.vitepress/theme/SankeyUsageDemo.vue'
</script>
<template><SankeyUsageDemo /></template>
```

Possible host input, not implemented props:

```ts
type Flow = { source: string; target: string; value: number }
```

Validate finite nonnegative flows, consistent units, unique or explicitly aggregated source/target pairs, node identifiers and a conservation policy. Missing must not become zero; signed flow needs a separate direction policy. General graphs need topology, cycles, self-loops, parallel links, ordering and collision handling. This fixed controller has no arbitrary graph input, layout solver, drag, multistage graph, hover tooltip, node selection, live request, export or error adapter.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery two-source/two-destination fixed Sankey card. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Same gallery wrapper plus a separate SankeyFunnel staged journey where included. |
| [Trial journey](/trial-journey), [Pace charts](/pace/charts), [Spark charts](/spark/charts), [Folio charts](/folio/charts), [Lustro blocks](/lustro/blocks) | Shared SankeyFunnel with title/subtitle props, range/play/replay and node readouts. |

ChartGallery declares only `language` String default lustro and renders the collection. No nodes, links, value accessor, conservation, layout, selected-node prop or selection emit exists. Its four fixed links have stroke widths 36/36/24/24 and node heights A72/B48/X60/Y60. Scale 1.2 implies link values 30/30/20/20, source totals 60/40 and destination 50/50. Readout exposes node totals 60/40/50/50, not per-link transfer values; A/B does not change this card. Curves are hardcoded, with endpoints y 48/84/142/166 at sources and 58/148/88/178 at destinations. Their endpoint bands are not rigorously packed within node rectangles (for example the first A band extends above its y 30 top). Do not claim this static specimen is a general conserved layout algorithm.

Focus/mouseenter on four native node groups and focus/click on Item 1–4 buttons select persistent node readout. No explicit link selection or mouseleave reset exists. Global Ready/Loading/Empty is manual demo state; Show sample data restores ready. Shared Motion mounts cards, refreshes sample/state and destroys on unmount.

`SankeyFunnel.vue` is a different original component with only title/subtitle String props. Its 7D/30D/90D buttons choose fixed synthetic source shares and stage-rate presets, not a live date query. Total starts at round(20400×scale), then each source count is rounded; signed total is their sum. Activated, invited and upgraded are sequential rounded ratios; complement sinks Skipped setup/Went solo/Stayed on free keep each split conserved. KPIs and selected-node percentages use signups as denominator, not prior-stage conversion. The five-column 900×420 layout uses a common unit based on signup volume and fixed node gaps; minimum node/link pixel sizes 5/3 can distort very small quantities in a generalized feed. The supplied fixtures are not evidence that arbitrary input is supported.

Its nodes select on focus/mouseenter/click/Enter. The role-button node groups have no explicit Space handler or pressed state. Range changes keep picked node, Replay resets phase/pick to Signed up, Pause/Play controls decorative particles and is disabled for reduced motion. Motion fades links/KPIs; media changes and unmount stop animation/frame/listener work. On narrow screens the SVG has minimum width 640 and scrolls internally. There is no exact flow table, general graph data prop or external analytics connection. Titles such as Booking funnel do not change the underlying trial fixtures.

This guide's exact two-by-two input flows, computed node sums, endpoint packing, fixed scale across datasets, one-flow/all-zero fixtures, per-link pressed selection/status/table and reset are original additions. Theme wrappers do not imply an installed Sankey library.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Update links and derived node totals on a fixed scale/order. |
| Single/zero | One positive path or no flow geometry; zero records remain inspectable. |
| Selected transfer | One pressed native button; opacity/readout only, no flow edits. |
| Loading/empty/reset | Withhold/recover chart/table; reset A/first flow/ready. |

Shared Motion fades links/nodes explicitly, avoiding draw-length animation that could imply changing flow quantity. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Exact table, labels, selected opacity and native keyboard/touch controls supplement color. No hover is required. This is not screen-reader certification.

Check independent link/node totals and full conservation, exact node x/y/width/height, path center/control coordinates, stroke thickness and endpoint-slot partition at both ends, zero omissions/ticks and undefined shares. Check all selections/state retention/reset/keyboard/reduced motion/unmount, desktop/mobile chart/table/source-map pixels, filesystem routes, overflow and errors. A live adapter also needs nonfinite/signed/missing values, duplicate links, cycles, many nodes, layout overflow, very small flows and stale/error policies.

<style>
@media(max-width:700px){.sankey-guide .vp-doc table:not(.skusage-data),.sankey-guide .vp-doc table:not(.skusage-data) tbody,.sankey-guide .vp-doc table:not(.skusage-data) tr,.sankey-guide .vp-doc table:not(.skusage-data) td{display:block;width:100%;box-sizing:border-box}.sankey-guide .vp-doc table:not(.skusage-data) thead{display:none}.sankey-guide .vp-doc table:not(.skusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.sankey-guide .vp-doc table:not(.skusage-data) td{overflow-wrap:anywhere}.sankey-guide .vp-doc table:not(.skusage-data) tr{margin-bottom:12px}}
</style>
