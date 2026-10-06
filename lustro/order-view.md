---
aside: false
---

<script setup>
import OrderView from '../.vitepress/theme/OrderView.vue'
</script>

# Order view

An analytics report screen based on the average order view (https://x.com/zafarlab/status/2106734311492002146): a report sidebar, a headline value with change, three summary cards, a dot chart grouped by weekday with each group's line, and a table whose rows open to show the detail. Themed for Lustro. Click a weekday row to show or hide its detail (daily rows and three cards); click it again to hide. Dots and rows animate in with Motion and stay still with reduced motion. Fictitious data.

<OrderView theme="lustro" />

## Anatomy

| Part | Notes |
|---|---|
| Sidebar | Report list with the current one highlighted |
| Headline | Value, change and comparison period, plus a Day, Week and Weekday switch |
| Summary cards | Highest day, discount days and best weekday |
| Dot chart | One dot per day, a line for the group's revenue over its orders |
| Table | Weekday rows that expand to daily rows and context cards |
