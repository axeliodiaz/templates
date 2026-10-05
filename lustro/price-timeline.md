---
---

<script setup>
import PriceTimeline from '../.vitepress/theme/PriceTimeline.vue'
</script>

# Price timeline

A price card with a history line and a projected range, based on the Bencho "Betting on the chart" reference (https://x.com/benchodev/status/2106607746091258199). Asset name, solid line for past prices, grey line for the projected part, big price with the change, range tabs (1D, 1W, 1M, 1Y, YTD, All), hover crosshair with tooltip, and an optional position panel. Themed for Lustro. Demo data is generated and fictitious; the position panel sends nothing.

## Price card

<PriceTimeline theme="lustro" />

## Without the position panel

<PriceTimeline theme="lustro" :position="false" asset="BTC (USD)" />

## Anatomy and props

| Part | Notes |
|---|---|
| Asset header | Name and round logo |
| Line | Solid up/down color for history, grey for the projected range |
| Hover | Crosshair, tooltip with price and change from the start of the range; the big price follows it |
| Keyboard | A hidden range slider moves the same readout; arrow keys step one point |
| Ranges | 1D, 1W, 1M, 1Y, YTD, All; each regenerates the series |
| Position panel | Bet type, direction, stake and one confirm button (prop `position`) |
| Motion | Line redraw respects prefers-reduced-motion |
