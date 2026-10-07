---
aside: false
---
<script setup>
import FixtrackDashboard from './.vitepress/theme/FixtrackDashboard.vue'
</script>

# Fixtrack maintenance

Property maintenance dashboard with a request pipeline, response-time chart, contractor assignment, local job chat and extra-work approval. White surfaces, forest-green accents and short state transitions. Illustrative blocks replace the original photography.

Source-inspired implementation from [the reference post](https://x.com/nizamdesign/status/2107486036624347286?s=46). Recreated with local components, not downloaded product code or assets. No real money, contractor message or account action is performed.

<FixtrackDashboard />

## Motion and accessibility

Cards enter with short fades; chart lines and bars reveal on load; controls transition on focus, hover and press. Local updates receive shared state feedback. Reduced-motion preferences stop animations and keep all information visible. Native dialogs support Escape. Tables scroll on narrow screens.
