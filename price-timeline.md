---
pageClass: price-timeline-guide
---
<script setup>
import { ref } from 'vue'
import PriceTimeline from './.vitepress/theme/PriceTimeline.vue'
const theme = ref('felix')
</script>

# Price timeline

A price timeline puts a current readout, change from the start of a range and a line of values together. Use it for exploring a price history, not for presenting a forecast as a fact. This catalogue component splits a generated series into colored history and a grey projected segment. Neither segment is market data, and the range labels do not represent real timestamps.

## Try range, keyboard and pointer exploration

<div class="price-guide-demo">
<label>Example theme<select v-model="theme"><option v-for="name in ['felix','lumen','scopecraft','lustro','pulsefit']" :key="name" :value="name">{{ name }}</option></select></label>
<p>Generated sample values, not a live quote or investment advice. No trading controls are enabled here.</p>
<PriceTimeline :theme="theme" asset="Sample asset (USD display)" :position="false" />
</div>

Choose 1D, 1W, 1M, 1Y, YTD or All. Each range uses a different deterministic generated series, not a filtered time window over one historical feed. Move a pointer across the chart to inspect a point; leaving the chart returns to the history/projection split. Tab into the range slider to reveal it, then use arrows, Home or End for the same readout. Blur returns to the split too. Switch theme to compare tokens without changing the active range. The grey segment is only illustrative, not a statistical prediction or uncertainty band.

## How to use it

1. Name the asset and unit precisely. The `asset` prop only changes text; it does not select a feed, currency or symbol metadata.
2. State where values come from. This component has no timestamps, network requests, exchange/source attribution, refresh interval or stale/error handling.
3. Keep history and projected data visibly distinct. The grey path is another slice of the generated array, not a computed forecast with a confidence level.
4. Define what the big number means: here it is the hovered/keyboard-selected value or, at rest, the split value, not the latest point at the right edge.
5. Give keyboard users equivalent inspection. Native range input controls the same index as pointer movement; changing a range clears that selection.
6. Keep speculative actions separate from chart reading. Use `:position="false"` for a read-only card. A real financial action needs an independent, authorized and validated workflow.

## Actual props and usage

`PriceTimeline.vue` already implements these props. This guide uses the existing component rather than claiming a new package export.

| Prop | Type/default | Actual effect |
|---|---|---|
| theme | String, pulsefit | One of lustro/felix/pulsefit/scopecraft/lumen token sets; unknown values fall back to pulsefit. |
| asset | String, ETH (SOL) | Header and chart description only. The default label does not choose a market or pricing unit. |
| position | Boolean, true | Shows the local Open position button. This guide passes false to remove it. |

```vue
<script setup>
import PriceTimeline from './.vitepress/theme/PriceTimeline.vue'
</script>
<template>
  <PriceTimeline theme="felix" asset="Sample asset (USD display)" :position="false" />
</template>
```

No emits, data-series prop, exposed API, feed adapter, export action or persistence is implemented. Dollar formatting is hard-coded to en-US with two decimals; changing the asset label to EUR or BTC does not change formatting. A host with real prices needs a separate validated data contract, for example:

```ts
type PricePoint = { timestamp: string; value: number; kind: 'observed' | 'projected' }
type PriceSeries = {
  assetId: string
  currency: string
  source: string
  asOf: string
  points: PricePoint[]
}
// Proposed host shape, not supported props of PriceTimeline.vue.
```

## Data and readout model

Ranges map to 48/56/60/72/64/80 points. A seed derived from the selected range drives sin/cos increments starting near 1800; there is no randomness, date arithmetic or remote data. `split = floor(N * 0.7)`. History includes points 0 through split and projection begins at that same split to connect paths. The selected index is `hover ?? split`; change is `(selectedValue - series[0]) / series[0] * 100`.

The SVG uses a 280 by 110 viewBox. X spans the point count and Y scales all values, including the grey segment, to the local min/max. Consequently the visual scale changes with the range and includes projected values. The history path always uses the up-color token; it does not automatically turn red when the percentage is negative. The percentage readout has a separate up/down class and a signed number. The source prose's up/down-line claim is broader than the code.

Pointer movement clamps and rounds to an index. The source tooltip follows that index with a horizontal clamp. This guide pins the tooltip to the chart's right edge to keep its full readout inside a narrow card. Mouse leave and slider blur clear hover; a range button clears it as well. Range controls use a group of native pressed buttons, not ARIA tabs. There are no component timers, document listeners or subscriptions to clean up; CSS owns path transition and Vue owns handlers.

## Anatomy and states

| Part/state | Behavior and limits |
|---|---|
| Header/logo | Text label and decorative CSS ring, not a fetched asset identity. |
| History/projection | Two SVG paths sharing the split point. No axes, dates, legend widget or actual forecast model. |
| Idle readout | Price/change at split, not the last point. |
| Pointer/keyboard selection | Crosshair, tooltip and readout use the same index; blur/leave resets. |
| Range change | Deterministic series/count changes, selection resets, exactly one button is pressed. |
| Theme | Token-only change. No account, quote, range or order change. |
| Optional position panel | Local demonstration only; hidden in this guide. Not a broker connection. |

### Optional position panel is not a trade workflow

With `position=true`, Open position shows an absolutely positioned `role=dialog` panel, and Open New Position changes `placed` to true. Nothing is sent. Direction and stake are local refs; the Bet type select has no model or effect. A number input's min=1 is not enforced by a form submit here, so zero/negative/invalid stake values are not reliably rejected. The success wording is a local UI state, not a receipt or executed position.

The panel has no modal focus trap, Escape handler, initial focus move or explicit focus restoration. It does not set aria-modal. Changing the position prop false after opening does not itself clear `open`; the template condition is only on its opener, so hosts should not treat a prop toggle as dismissal. Production needs those focus/dismissal rules, validation, price freshness, risk disclosure and server confirmation separately. This guide leaves the panel absent for its entire lifecycle rather than encouraging a false trade.

## Source coverage

| Source | Coverage |
|---|---|
| [Felix](/felix/price-timeline) | Shared component with felix theme and position/no-position examples. |
| [Lumen](/lumen/price-timeline) | Same component, lumen tokens. |
| [Scopecraft](/scopecraft/price-timeline) | Same component, scopecraft tokens. |
| [Lustro](/lustro/price-timeline) | Same component, lustro tokens. |
| [Pulsefit](/pulsefit/price-timeline) | Same component, pulsefit tokens. |

These are theme variants of one implementation, not independent financial APIs. The catalogue attributes a visual reference; this guide adds explanation and uses the repository's component, without copying outside assets or asserting rights to that reference.

## Motion, accessibility and checks

The actual component sets a 300ms transition on SVG path `d` only when reduced motion is not requested. Browser support for path interpolation can vary; no JavaScript draw/replay controller exists. Reduced motion removes that transition. Theme/range changes are immediate state changes, not simulated loading. The slider is visually 1px/transparent until keyboard focus, when it becomes full width; the SVG has an asset/range description and price uses polite live updates. Dense hover changes can still be noisy for assistive technology. The graphic alone does not provide a complete data table or dated accessible alternative.

This guide's wrapper constrains card width on mobile and keeps range buttons wrapping; it does not silently alter source pages. Check all six ranges, single pressed state, slider count and endpoint values, Arrow/Home/End inspection, selection reset on range/blur/mouse-leave, pointer tooltip, theme changes, absent trading controls, reduced motion, console errors and narrow overflow. For real data, also test sorted timestamps, missing/flat/negative values, unavailable/stale quotes, unit precision and an accessible data-table alternative. These checks are not a screen-reader certification or a trading integration test.

<style>
.price-guide-demo{border:1px solid var(--vp-c-divider);border-radius:14px;padding:16px;margin:20px 0}.price-guide-demo>label{display:flex;gap:10px;align-items:center;font-weight:650}.price-guide-demo>label select{padding:8px;border:1px solid var(--vp-c-divider);border-radius:8px;background:var(--vp-c-bg);color:var(--vp-c-text-1);appearance:auto}.price-guide-demo .ptl{box-sizing:border-box;min-width:0;padding:14px}.price-guide-demo .ptl-card{box-sizing:border-box;max-width:100%;min-width:0}.price-guide-demo .ptl-tabs{flex-wrap:wrap}.price-guide-demo .ptl-tabs button{padding:6px}.price-guide-demo .ptl-tip{left:auto!important;right:0;max-width:100%;box-sizing:border-box}.price-guide-demo .ptl-sr:focus-visible{box-sizing:border-box}@media(max-width:700px){.price-timeline-guide .vp-doc table,.price-timeline-guide .vp-doc tbody,.price-timeline-guide .vp-doc tr,.price-timeline-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.price-timeline-guide .vp-doc thead{display:none}.price-timeline-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.price-timeline-guide .vp-doc td{overflow-wrap:anywhere}.price-timeline-guide .vp-doc tr{margin-bottom:12px}}
</style>
