---
aside: false
---

<script setup>
import TradingPanel from './.vitepress/theme/TradingPanel.vue'
</script>

# Trading panel

A paper-trading dashboard block: balance display, open position with entry, take-profit and liquidation levels, leverage multiplier, equity curve and trade stats. One component, `.vitepress/theme/TradingPanel.vue`, themed through `--vp-c-*` tokens so every template gets the same panel.

<TradingPanel />

## Behavior

- Market, long or short, and the 2x to 20x multiplier change the take-profit and liquidation levels and the live P&L.
- Close the position to see the empty state, then open a new one.
- Ranges 1H, 6H and 22H redraw the curve; hover or drag shows each trade.
- With reduced motion, the balance and the curve are set directly with no animation.

Pattern credit: the perps-bot UI in a post by @0xTenzo. Original code and fictitious data, nothing copied.
