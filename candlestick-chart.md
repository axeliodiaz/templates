---
pageClass: candlestick-guide
---
<script setup>
import CandlestickUsageDemo from './.vitepress/theme/CandlestickUsageDemo.vue'
</script>

# Candlestick chart

A candlestick summarizes open, high, low and close for each period. The body spans open to close; the thin wick spans low to high. Use it when those four values and their within-period range matter. It does not show the order of trades inside the period, volume or every intermediate price. A line chart is simpler when only closing values matter. These are synthetic fixtures, not market data, investment advice or an order interface.

## Try OHLC and equal closes

<CandlestickUsageDemo />

Switch A/B or Flat closes and select a month. Filled bodies mean close above open; hollow bodies mean close below open. A horizontal tick means equal open/close, not missing or zero price. The selected candle has a stronger outline, one pressed month button and an exact readout. O/H/L/C table headings have a visible expanded key. Loading/Empty withhold graph/table without replacing prices with zero. Ready preserves dataset/month; Reset returns A, January and ready. No request runs and no trade or record changes.

## How to use it

1. Define period, timezone, market and currency. Here Jan–Jun are six equal-width synthetic labels with sample currency units, not real sessions or timestamps.
2. Validate OHLC relationships: low≤open≤high and low≤close≤high. Swapped or nonfinite values must not be drawn as valid candles.
3. Encode direction relative to the same period's open, not the previous period's close. Name the convention; do not rely on assumed red/green market meanings.
4. Draw wick and body from the same prices and scale. The body height is abs(close−open), not the total low/high range.
5. Show equal open/close explicitly. This demo uses a visible horizontal tick, while retaining its low/high wick.
6. Label the price scale. This fixed100–200 domain is cropped, not zero-based; do not infer ratios from candle height. All fixtures fit the domain.
7. Keep missing periods distinct. No data is not a zero-priced candle. A real feed also needs session gaps, stale quotes, corporate-action policy and errors.

## Anatomy and actual API

`CandlestickUsageDemo.vue` has no props or emits. Refs are `dataset`, `selected` and `state`. Base A is35/48/41/61/56/74; B is42/36/55/48/72/64. Flat closes uses B bases. Per index, open=base+100, high=base+115, low=base+85. Close=open+9 for even indices and open−9 for odd indices, except Flat closes sets close=open. These are internally generated valid fixtures, not an arbitrary OHLC data adapter.

X is40+48i; Y is170−1.4(price−100), mapping100 to170 and200 to30 in a320×210 SVG. Wick endpoints are Y(high)/Y(low). Body top is Y(max(open,close)); body height is abs(close−open)×1.4 and width16. An equal open/close is a16-unit horizontal tick, so it remains visible without inventing price movement. Month selection changes only the highlighted outline and text, never the prices.

```vue
<script setup>
import CandlestickUsageDemo from './.vitepress/theme/CandlestickUsageDemo.vue'
</script>
<template><CandlestickUsageDemo /></template>
```

A production host might use this shape; it is not an implemented prop API:

```ts
type Candle = {
  periodStart: string
  periodEnd: string
  open: number
  high: number
  low: number
  close: number
}
type CandleSeries = {
  currency: string
  timezone: string
  candles: Candle[]
}
```

Validate finite values and bounds, timestamp ordering/duplicates, period overlap, units and domain before mapping. Do not silently round, clamp or replace invalid candles. State whether prices are adjusted, which session they cover and when the feed was updated. This controller performs none of those production-feed operations.

Native month buttons select on focus or activation and expose pressed state. Dataset/state switches retain selected index. Wick/body/table/readout use the same rows. There is no hover-only tooltip, custom arrow-key widget, timer, listener, subscription or external animation handle to clean up. No integration or transaction occurs.

## Source coverage and actual gallery behavior

| Source | Actual behavior and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix gallery](/felix/components/charts) | Shared ChartGallery Financial candlesticks specimen with generated OHLC around primary fixtures. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Theme wrappers for the same gallery, not independent market-feed APIs. |
| [Line chart](/line-chart), [Range band](/range-band-chart) | Closing trend or bound interval alternatives; neither supplies open/close body direction by itself. |

ChartGallery declares `language` String default lustro and renders all cards. No candle-only, OHLC-data, market, currency, session or price-domain prop exists; there is no selection emit. Dataset A/B and Ready/Loading/Empty are gallery-global. There is no flat-candle fixture or candle mode button in the source.

The source uses open=primary+100, high=primary+115, low=primary+85 and close=open±9 by index parity. Its actual SVG uses X34+48i, Y166−1.5v on base-relative values. Wicks use Y(base+15)/Y(base−15); bodies use Y(base+9) for rising or Y(base) for falling, height13.5. Its grid ticks are base-relative0–100, with a separate price offset+100 label. This guide's new example instead labels the actual100–200 price axis directly and adds an explicit equal-close state.

Source native readout buttons and focus/mouseenter on candle groups select the index. Its candle-specific readout reports all four offset prices, not secondary-series data. Filled/hollow body convention is based on index parity matching the generated direction. Selected source index persists until another point is picked; no mouseleave reset or live time-range query occurs.

Source loading/empty are manual states, not requests; Show sample data restores ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount; CSS chart transitions are separate. The financial title and generated labels do not establish a trading service or reusable OHLC validation API.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Six valid generated OHLC rows, same fixed scale. |
| Flat closes | Close=open, horizontal body tick and unchanged low/high wick. |
| Selected month | Stronger candle outline, one pressed button and exact OHLC/direction text. |
| Loading/empty | Graph/table absent, descriptive status and controls retained. |
| Reset | A, January and ready. |

SVG entrance fades over200ms on dataset remount. Reduced motion removes the fade. Prices do not count through invented values. Filled/hollow/tick shapes supplement color, and text names direction. Native buttons/selects handle keyboard input; candle groups are descriptive SVG, not extra tab stops. The five-column table uses short O/H/L/C labels with a visible expanded key to fit mobile widths; prose source maps stack. This is not screen-reader certification.

Check every fixture's OHLC relationships and table/readout, exact wick endpoints/body top/height/direction, equal-close ticks, selection/highlight, focus/Enter/Space, state retention/recovery/reset, reduced motion, cropped-axis label/table/key/source-map readability, body links, overflow and console errors. A live feed also needs invalid/negative prices under its instrument policy, split adjustment, timezone/session boundaries, missing candles, duplicate/out-of-order periods and stale/error tests.

<style>
@media(max-width:700px){.candlestick-guide .vp-doc table:not(.candle-data),.candlestick-guide .vp-doc table:not(.candle-data) tbody,.candlestick-guide .vp-doc table:not(.candle-data) tr,.candlestick-guide .vp-doc table:not(.candle-data) td{display:block;width:100%;box-sizing:border-box}.candlestick-guide .vp-doc table:not(.candle-data) thead{display:none}.candlestick-guide .vp-doc table:not(.candle-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.candlestick-guide .vp-doc table:not(.candle-data) td{overflow-wrap:anywhere}.candlestick-guide .vp-doc table:not(.candle-data) tr{margin-bottom:12px}}
</style>
