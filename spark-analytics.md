---
aside: false
---
<script setup>
import TradingPanel from './.vitepress/theme/TradingPanel.vue'
import SparkAnalytics from './.vitepress/theme/SparkAnalytics.vue'
</script>

# Spark analytics example

Dark agency analytics with an orange pixel-grid sales histogram, period tabs, revenue bars, searchable transactions and CSV export. All figures are fictitious.

Source-inspired implementation from [the reference post](https://x.com/noman_huge/status/2107455846544208053?s=46). Recreated with local components, not downloaded product code or assets. No real money, contractor message or account action is performed.

<SparkAnalytics />

## Motion and accessibility

Cards enter with short fades; chart lines and bars reveal on load; controls transition on focus, hover and press. Local updates receive shared state feedback. Reduced-motion preferences stop animations and keep all information visible. Native dialogs support Escape. Tables scroll on narrow screens.

## Spark design system

[Foundations](/spark) · [Live component catalog](/spark/components) · [Charts](/spark/charts)

## Trading panel

Big balance, an open position with entry, take-profit and liquidation levels, a leverage multiplier and an equity curve. Switch market, side and range, pause the live ticks, close or reopen the position. It reads this template's theme tokens, and motion stops with reduced motion. Fictitious paper account.

<TradingPanel />
