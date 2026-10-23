---
aside: false
---
<script setup>
import MarginDashboard from './.vitepress/theme/MarginDashboard.vue'
</script>

# Margin profitability analytics

Field-service profitability workspace with five complete screens: an Overview with gross-margin KPI, target waterfall, rotating pattern insights, 12-week trend and an action inbox; a Jobs page with a 158-dot margin swarm, search, branch filter, sorting and pagination; a Leakage page with a branch-by-cause heatmap and ranked actions; a Forecast page with scenario switches that recompute the projection live; and a per-job profit bridge with planned-vs-actual and full-cost-stack views. Analyze pages cover customers, job types, technicians, branches and trends.

Source-inspired implementation from [the Margin design posts](https://x.com/nizamdesign/status/2113330104193683682?s=46) by @nizamdesign. Recreated with local components, layouts and copy; no downloaded product code, assets or brands. Interaction details not visible in the source images (hover states, page transitions) are our interpretation, not an exact match. All data is fictitious; filters, exports and settings act locally only.

<MarginDashboard />

## Motion and accessibility

Cards, bars, dots and chart lines animate in on load and on page switch; scenario switches and hover states transition smoothly. Reduced-motion preferences disable all animation while keeping every value visible. Sidebar navigation is keyboard reachable with visible focus; low-margin swarm dots, table job links, scenario switches and dialogs are fully keyboard operable. Dialogs close with Escape. Tables scroll horizontally on narrow screens, and the sidebar collapses into a section select.
