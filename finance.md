<script setup>
import FinanceDashboard from './.vitepress/theme/FinanceDashboard.vue'
</script>

# Finance overview (Lustro)

A money-management example inspired by [Khoirul's revenue dashboard](https://x.com/khoiruldesign/status/2105903419152314771). The reference shows a marketing workspace with total revenue, attributed revenue, marketing ROI and a revenue line chart. This example adapts its rounded KPI cards, quiet navigation and chart-first layout into a studio cash-flow dashboard, rather than claiming to reproduce its whole product.

Dark glass panels, a soft indigo accent and Space Grotesk numbers. All names, transactions and amounts are fictitious. Currency is USD throughout.

## Studio cash flow

Switch September / August, compare income with expenses, hover or keyboard-focus a chart point, search or filter the ledger, and open a transaction. Everything runs locally and resets on reload.

<FinanceDashboard language="lustro" />

## How to use it

- **Monthly review:** income, expenses and net cash flow answer whether the studio took in more cash than it spent. Cash retained is net cash flow divided by income, not an accounting profit margin.
- **Weekly planning:** the solid income line and dashed expense line share a zero-based USD axis. Each point represents one week's total, not daily interpolation or a cumulative bank balance.
- **Cost control:** compare category spending with a fixed monthly budget. An explicit over-budget label explains the capped progress bar; color is never the only signal.
- **Reconciliation:** inspect settled transactions by type or description. Table filters do not alter the overview totals. Use the detail panel to inspect one row, not initiate a payment.

## Anatomy

| Part | Purpose |
|---|---|
| Workspace context | Illustrative sidebar, not clickable navigation that promises other screens |
| Period picker | Two complete months of sample data; every KPI, chart and table updates together |
| KPI cards | Total income, expenses, net cash flow and cash retained; September changes compare with August |
| Revenue performance | Area/line income chart, optional dashed expenses, point values on hover or focus |
| Spending plan | Category actuals and budgets, percentage used and an over-budget warning |
| Transaction ledger | Signed amounts, explicit type, settled status, date, category and local detail |

## Chart and data rules

Use the existing [chart catalog](/graphs#data-charts) for standalone line, area and bar patterns. This page adds dashboard composition and coordinated data, not another chart library. Keep axes, units and aggregation explicit. Never render missing values as zero. Real products need loading, stale-data, error and empty states alongside the populated example.

The shared `FinanceDashboard.vue` owns this example. Supply `language="lustro"`; its scoped class tokens carry the language and Felix dark-mode colors. Keep monetary data in integer cents in production, format only at the presentation layer and distinguish settled, pending and forecast values. This demo uses whole-dollar settled sample entries, so all amounts can be checked against the ledger.

No bank connection, account balance, transfer, payment, export, investment forecast or persistence is implied. It is a UI template, not financial advice.
