---
aside: false
---

<script setup>
import SalesDash from '../.vitepress/theme/SalesDash.vue'
</script>

# Sales dashboard

A sales and revenue dashboard based on the NovaMetrics concept (https://x.com/iammuhammadmuiz/status/2106843977550856432): a top bar with search and user, a greeting with date range and an action, four KPI cards with sparklines, a sales overview area chart with a hover readout, a performance donut, recent activity, top products with sparklines and quick stats. Themed for Lustro. Move the pointer over the chart to read a day and switch the range with the control. Cards and lines animate in with Motion and stay still with reduced motion. Fictitious data.

<SalesDash theme="lustro" />

## Anatomy

| Part | Notes |
|---|---|
| KPI cards | Customers, orders, revenue and conversion, each with change and a sparkline |
| Sales overview | Revenue and orders as two areas; the readout follows the pointer |
| Performance overview | Donut with completed, in progress and pending shares |
| Recent activity | Event, detail, time and a status pill |
| Top products | Rank, revenue, change and a sparkline |
| Quick stats | Four counters with a signed change; arrows and text carry direction, not color alone |
