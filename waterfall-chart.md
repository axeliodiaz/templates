---
pageClass: waterfall-chart-guide
---
<script setup>
import WaterfallChartUsageDemo from './.vitepress/theme/WaterfallChartUsageDemo.vue'
</script>

# Waterfall chart

A waterfall explains how signed changes reconcile an opening balance to a closing balance. Intermediate bars float between successive balances; totals extend from zero. Use it for a financial bridge, inventory change or other additive reconciliation. Use ordinary bars for independent magnitudes, stacked bars for parts of a total, or a line chart for a continuous trend. A waterfall requires compatible units and a meaningful order.

## Try a reconciliation and a negative close

<WaterfallChartUsageDemo />

A reconciles60+30−20=70. B reconciles40+20−75=−15, so the outflow crosses zero and the closing total extends below it. All zero preserves zero-length bars with small presence dots. Select a step to read its signed change or total and resulting balance. Loading/Empty withhold graph/table rather than invent zeros. Ready restores choices; Reset returns A, Opening and ready. Nothing is fetched, edited or saved.

## How to use it

1. Choose one additive unit and ordered changes. Mixing percentages and dollars does not produce a meaningful running balance.
2. Start with an opening total. Add each signed change to the previous balance. Compute the closing total from the same steps, not an unrelated headline.
3. Draw total bars from zero and change bars between prior and next balance. A decrease's rectangle still has positive height; its sign comes from from/to and text.
4. Join bars at the running balance, not their decorative top. A negative change or a crossing-zero step can end below its start.
5. Keep a fixed labeled domain containing every balance and zero. This fixture uses−20–100. Do not clip an overspend into a nonnegative bar.
6. Distinguish total and change visually and in text. Here totals are solid, changes outlined, and signs explicit. Positive does not universally mean good.
7. Reconcile exact numbers in text/table. Zero is a real zero-length step, not missing data. Missing changes need a stated policy, not an assumed zero.

## Anatomy and actual API

`WaterfallChartUsageDemo.vue` has no props or emits. Refs are `dataset`, `state` and `selected`. The computed fixture supplies opening/inflow/outflow: A60/30/−20, B40/20/−75 or0/0/0. `steps` computes from/to/value/total for Opening, Inflow, Outflow and Closing. Closing is derived, never separately stored.

The320×255 SVG uses Y180−1.5v, X36+68i and width34. Each rectangle starts at Y(max(from,to)) with height1.5×abs(to−from). Totals use from0; changes use the preceding balance. Connectors run from each bar's right edge to the next left edge at Y(current.to). Opening60 therefore spans0–60, inflow30 spans60–90, outflow−20 spans90–70 and closing70 spans0–70. In B the outflow spans60 to−15; the closing total spans0 to−15. Zero rectangles stay height0, with an independent presence dot. Selection changes outline, opacity and label weight, not geometry.

```vue
<script setup>
import WaterfallChartUsageDemo from './.vitepress/theme/WaterfallChartUsageDemo.vue'
</script>
<template><WaterfallChartUsageDemo /></template>
```

A possible host contract, not implemented props:

```ts
type Bridge = {
  unit: string; opening: number
  changes: { id: string; label: string; delta: number | null }[]
  domain: [number, number]
}
```

Validate finite numbers, stable IDs, one unit, increasing domain and all running balances within it. Reconcile closing from changes, including rounding policy. Real subtotals need explicit semantics: display a subtotal from zero without adding it again to the running balance. This controller does not implement subtotals, sorting, nulls or arbitrary-length inputs. Reordering changes preserves final arithmetic but changes the story and intermediate balances; retain selected IDs if a host reorders.

Native step buttons select on focus or activation with pressed state. Dataset/state changes retain selected index because the fixed four-step identity never changes. SVG, equation, readout and exact table share computed steps. No custom arrow-key widget, timer, subscription, request or external animation handle is created.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Waterfall steps specimen with four static bars and fixed readouts. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Theme wrappers, not independent reconciliation APIs. |
| [Bar chart](/bar-chart), [Step chart](/step-line-chart) | Independent magnitudes or held values, not an additive bridge. |

ChartGallery declares only `language` String default lustro and renders the whole gallery. No opening/changes/domain/subtotal/selected-step prop or selection emit exists. A/B and Ready/Loading/Empty are gallery-global, but the waterfall geometry and readout are static rather than recomputed from A/B arrays.

The source hard-codes v/b pairs60/0,30/60,20/70,70/0 with X30+73i, width45, Y166−1.5(b+v), height1.5v and rounded caps. Its connector path is also fixed. These encode a single bridge rather than a running-balance model. Its readouts say Opening60, Inflow+30, Outflow−20, Closing70. Do not treat those labels as evidence of a generic reconciliation engine or derive a data adapter from specimen coordinates. This isolated guide computes all balances and signed rectangle geometry, adds exact equation/table, a negative close and zero fixture. Those additions are not native gallery controls.

Source marks select on mouseenter/focus and Item1/2/3/4 buttons update the fixed readout; selection persists with no mouseleave reset. The source does not expose editing, sorting or requests. Manual Loading/Empty are global demonstration states; Show sample data restores ready. Shared Motion mounts on cards, refreshes for dataset/state and destroys on unmount. Theme changes do not imply an installed chart package or universal data API.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Positive or negative closing total; all geometry and text reconcile. |
| All zero | Zero-height bars with presence dots, exact zero balances. |
| Selected step | One pressed button, stronger outline/label and exact total/change status. |
| Loading/empty/reset | Values withheld/recovered; reset A/Opening/ready. |

SVG entrance fades over200ms on dataset remount; reduced motion removes it. Values do not animate through invented transactions. Solid/outlined shapes, signed labels, baseline and exact balances avoid color-only meaning. Native controls handle keyboard input; SVG describes encoding and the table exposes exact values. This is not screen-reader certification.

Check A/B/zero exact values and equation, every from/to balance and rectangle coordinate, running-balance connectors, negative crossing/negative close, zero-length marks, selection/state retention, focus/Enter/Space, loading/empty/recovery/reset, reduced motion, chart/table/source-map readability, actual filesystem body routes, overflow and console errors. A real adapter needs missing/nonfinite values, unit/rounding rules, duplicate IDs, subtotals, long labels, many steps and stale/error cases.

<style>
@media(max-width:700px){.waterfall-chart-guide .vp-doc table:not(.wfusage-data),.waterfall-chart-guide .vp-doc table:not(.wfusage-data) tbody,.waterfall-chart-guide .vp-doc table:not(.wfusage-data) tr,.waterfall-chart-guide .vp-doc table:not(.wfusage-data) td{display:block;width:100%;box-sizing:border-box}.waterfall-chart-guide .vp-doc table:not(.wfusage-data) thead{display:none}.waterfall-chart-guide .vp-doc table:not(.wfusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.waterfall-chart-guide .vp-doc table:not(.wfusage-data) td{overflow-wrap:anywhere}.waterfall-chart-guide .vp-doc table:not(.wfusage-data) tr{margin-bottom:12px}}
</style>
