---
aside: false
---

<script setup>
import WasteDashboard from '../.vitepress/theme/WasteDashboard.vue'
</script>

# Waste dashboard

A kitchen waste analysis screen based on the Mise concept (https://x.com/nizamdesign/status/2106785165179805778): three KPI cards with change and target, a honeycomb where each cell is 1 kg colored by source, a ranked legend with change and cost, an insight card ("What Mise noticed") with supporting figures and actions, and a dot matrix of waste by day. Themed for Lustro. Click a legend row to isolate that source in the honeycomb. Cells and dots animate in with Motion and stay still with reduced motion. Fictitious data.

<WasteDashboard theme="lustro" />

## Anatomy

| Part | Notes |
|---|---|
| KPI cards | Waste, estimated cost and waste rate, each with change and target or comparison |
| Honeycomb | 84 cells for 84 kg; color encodes source and the legend toggles focus |
| Legend | Source, share, change and cost; text and an arrow carry the change, not color alone |
| Insight card | One finding, three numbers and two actions |
| Waste by day | One dot per 0.5 kg, split by the main source |
