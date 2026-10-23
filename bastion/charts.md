---
aside: false
title: Bastion charts
---

<script setup>
import BastionCharts from '../.vitepress/theme/BastionCharts.vue'
</script>

# Charts

Sparklines, CPU meters, and request bars in the terminal palette. Switch 24h and 7d, then select a bar. Values are printed, not only drawn. The [ops dashboard](/bastion/dashboard) uses the same meters, the uptime sparkline, and the deploy timeline.

<BastionCharts />

## Rules

- A meter has a name, a percent, and `aria-valuenow`.
- Amber starts at 60% for CPU. The threshold is also a word in the dashboard footnote.
- The sparkline draws once. Reduced motion shows the finished stroke.
- Do not encode a third meaning with a gradient. Green, amber, and hot orange are enough.
