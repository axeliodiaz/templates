<script setup>
import ReportsDashboard from './.vitepress/theme/ReportsDashboard.vue'
</script>

# Reports and analytics (Lustro)

A reporting example inspired by [Nizam's Fixtrack report page](https://x.com/nizamdesign/status/2106507837740614071). The reference combines four KPI cards with change badges and targets, a two-series line chart, ranked category bars and a contractor table. This page adapts those patterns to the Lustro design language with fictitious property-maintenance data, rather than copying the whole product.

## Maintenance report

Hover or keyboard-focus a month on the line chart to read both series. Sort the contractor table by jobs, response time or rating.

<ReportsDashboard language="lustro" />

## How to use it

- **KPI cards:** one metric each, with a change badge and the target or sample size beside it. Always say what the change is measured against.
- **Two-series line chart:** use it when two measures share a trend. The solid and dashed lines differ by pattern as well as color, and both share one labeled axis. Add a table or readout so values are readable without hover.
- **Category bars:** rank shares of a total with the count and percentage next to the label. Scale all bars to one maximum.
- **Ranked table:** keep columns numeric and right-sized, offer a sort control, and let the table scroll sideways on narrow screens.

## Anatomy

| Part | Purpose |
|---|---|
| KPI cards | Headline metric, change badge, target or volume |
| Trend chart | Two measures over six months, month readout, legend |
| Category bars | Share of requests by type, count and percent |
| Performance table | Per-contractor jobs, response, completion, on-time, cost, rating |

## Chart rules

Use the [chart catalog](/graphs#data-charts) for standalone patterns. Keep units explicit (minutes and hours share one axis here only because both are illustrative), never draw missing months as zero, and add loading, empty and error states in a real product. All names and figures are fictitious.
