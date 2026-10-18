---
aside: false
---
<script setup>
import StudioCatalog from '../.vitepress/theme/StudioCatalog.vue'
import SankeyFunnel from '../.vitepress/theme/SankeyFunnel.vue'

</script>

# Pace charts

Line, area, bar, stack, donut and comparison charts using Pace tokens. Series use the brand green first, then info blue and warning amber; never rely on color alone, so every chart has a caption and labels.

<StudioCatalog theme="pace" section="charts" />

## Booking funnel

Visit to booked to attended, with drop-offs. Fictitious counts; replace with your own data.

<SankeyFunnel title="Booking funnel" />
