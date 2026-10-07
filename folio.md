---
aside: false
---
<script setup>
import FolioDashboard from './.vitepress/theme/FolioDashboard.vue'
</script>

# Folio finance

Charcoal finance dashboard with mint accents, balance sparkline, cash-flow allocation, upcoming payments and transaction search. Payment controls add local fictitious rows only.

Source-inspired implementation from [the reference post](https://x.com/olatheuiuxguy/status/2107377813783544110?s=46). Recreated with local components, not downloaded product code or assets. No real money, contractor message or account action is performed.

<FolioDashboard />

## Motion and accessibility

Cards enter with short fades; chart lines and bars reveal on load; controls transition on focus, hover and press. Local updates receive shared state feedback. Reduced-motion preferences stop animations and keep all information visible. Native dialogs support Escape. Tables scroll on narrow screens.
