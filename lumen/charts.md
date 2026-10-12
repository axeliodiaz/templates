---
aside: false
pageClass: lmn-page
---

<script setup>
import SankeyFunnel from '../.vitepress/theme/SankeyFunnel.vue'
import ChartGallery from '../.vitepress/theme/ChartGallery.vue'
</script>

# Charts

38 animated chart patterns in the Lumen palette (violet, amber, cyan on white). Synthetic data, hover and keyboard readouts, reduced-motion support, Ready/Loading/Empty states.

<ChartGallery language="lumen" />

## Conversion funnel (Sankey)

Multi-stage conversion flow with drop-offs, date ranges, play/pause and keyboard focus. It inherits this template's colors and works with synthetic data. Replace the stage counts with your own source of truth.

<SankeyFunnel title="Conversion funnel" />
