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

Cards rise 8px and fade in over 280ms. Chart lines and bars still reveal on load. Controls lift 2px on hover, settle 1px on press, and show a focus ring. Local updates receive the shared state fade. Reduced motion stops animations and keeps all information visible. Native dialogs support Escape. Tables scroll on narrow screens. Tokens are `--m-rise` and `--m-hover` on `html[data-tpl="fixtrack"]`.
