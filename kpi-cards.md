---
pageClass: kpi-cards-guide
---
<script setup>
import KpiCardsUsageDemo from './.vitepress/theme/KpiCardsUsageDemo.vue'
</script>

# KPI cards

A KPI card pairs one headline measurement with its unit, comparison period and enough context to interpret the change. Use a small group for a dashboard overview, not as a replacement for a dated report or the underlying records. A higher number is not always better: a shorter response time can improve while its numeric delta is negative. A card showing a metric is different from [task progress or a bounded meter](/progress).

## Try comparable and unavailable states

<KpiCardsUsageDemo />

Change the period to compare two fixed sample snapshots. Current shows bookings increasing, occupancy up by percentage points and response time improving by decreasing. Previous includes a zero prior count, an unchanged occupancy and a worsening response time. Change Data state to Loading, Empty or Error to withhold values instead of pretending missing data equals zero. Restore sample data only changes local state; it does not retry a request. Reset returns to current/ready. Cards themselves are not clickable.

## How to use it

1. Give each metric a visible label, unit, reporting period and source. A large unlabeled number is not self-explanatory.
2. Compare like with like. Use the same definition and duration for current and previous periods; say when the denominator or coverage changes.
3. Distinguish relative percent change from percentage-point change. Moving occupancy from 80.8% to 84% is +3.2 percentage points, not +3.2% relative growth.
4. Handle zero baselines without dividing by zero. This example says not comparable for relative change from a zero prior count, rather than displaying infinity or a made-up percentage.
5. Separate arithmetic direction from business meaning. Here lower response time is better; state Improved/Worse/Unchanged in text, not color alone.
6. Treat unavailable, loading and stale as separate data states. Do not animate zero up to a supposedly real result while a request is pending.
7. Link to details only when there is a real destination. A whole-card button with no action is worse than a non-interactive summary.

## Anatomy and actual API

`KpiCardsUsageDemo.vue` has no props, emits or installed package API. `period` selects one of two static arrays; `state` selects ready/loading/empty/error. Each metric has id, label, value, previous, unit and better direction. `metrics` selects the array, while value/delta/assessment helpers format and interpret it. The count/seconds relative formula is `(value - previous) / previous * 100`; percent-unit metrics use `value - previous` and label it percentage points. Number formatting uses en-US with at most one decimal.

```ts
type Metric = {
  id: string
  label: string
  value: number
  previous: number
  unit: 'count' | 'percent' | 'seconds'
  better: 'higher' | 'lower'
}
// Fixture shape in this demo, not a public prop contract.
```

Current bookings: 128 vs 108 gives +18.5% after display rounding. Occupancy: 84% vs 80.8% gives +3.2 percentage points. Response: 34s vs 50s gives -32%, labeled Improved. Previous bookings: 108 vs 0 gives no relative comparison, not a zero percent change. Previous occupancy: 80.8 vs 80.8 is unchanged. Previous response: 50 vs 40 is +25%, labeled Worse.

```vue
<script setup>
import KpiCardsUsageDemo from './.vitepress/theme/KpiCardsUsageDemo.vue'
</script>
<template><KpiCardsUsageDemo /></template>
```

The period stays selected through unavailable states, so restoring ready returns that same sample snapshot. There is no network, timer, subscription, persistence, counter animation or event cleanup. A real host needs definitions, timestamps/as-of, source/coverage, currency/precision rules and missing/stale/error metadata in its own data contract. The fixed positive-baseline fixtures do not establish how to interpret every negative baseline or changing denominator.

## States and layout

| Part/state | Behavior |
|---|---|
| Label/value | Named article, visible title, unit-aware headline. No automatic card action. |
| Comparison | Explicit prior value and comparison direction; percentage points for percent metrics. |
| Assessment | Improved/Worse/Unchanged/Not comparable text; color is supplementary. |
| Ready | Three cards from the selected snapshot. |
| Loading/empty/error | Values hidden, distinct status text; loading is manually selected, not a real pending request. |
| Restore/reset | Restore returns ready for the selected period; reset returns current/ready. |
| Narrow layout | One-column cards, wrapping context and stacked source maps. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Pulsefit KPI inner structure](/pulsefit/kpi-cards) | Static HTML pfk cards: label/circled glyph, large value and comparison/delta footer. Studio and finance specimens are text, not computed metrics. Hover lift has a reduced-motion guard. No card interaction/data props/controller. |
| [Finance dashboards](/felix/finance) | FinanceDashboard computes income, expenses, net and cash-retained percentage from its local month fixture. A dashboard-specific controller, not a generic KPI component export. Theme variants share that implementation. |
| [Operations dashboard](/felix/ops-dashboard) | OpsDashboard hard-codes KPI arrays and sparks. The response-time specimen has a negative percent string but its displayed arrow depends on a separate boolean, so direction and badge meaning are not universally derived from delta. |
| [Workflow operations](/felix/workflow-ops) | WorkflowOps selects local KPI arrays by workspace, with a 60-tick strip and an accessible percent-of-target label. It is its own fixture and target encoding, not a task-progress API. |
| [Chart gallery](/felix/components/charts#mono-kpi) | Related KPI-with-sparkline pattern. Chart/tick/progress implementations remain separate; this issue covers headline card structure and comparison semantics. |

The dedicated Pulsefit source calls the cards Finance-reference-inspired. This guide uses an original neutral controller and does not copy the outside reference or its assets. Existing source percentages, comparison text and color classes are specimen content, not a verified calculation contract. Dashboard compositions are related coverage, not duplicate issues or a claim that all KPI implementations share one API.

## Motion, accessibility and checks

Ready cards fade/move 4px over 200ms when mounted or the period changes. Reduced motion removes the reveal. Values do not count through intermediate numbers; state changes update the truthful fixture immediately. Native labeled selects support keyboard use, a concise live status announces state/period, and each card remains a normal article with heading/text. It is not a button or progressbar. This does not claim screen-reader testing.

Check both snapshots against the formulas, zero-baseline and unchanged cases, higher/lower-is-better labels, period retention through loading/empty/error, restore/reset, native select keyboard operation, absence of clickable card semantics, reduced motion, narrow stacking, source-map readability and console errors. Live hosts also need data freshness, definition/coverage changes, negative baselines, division/precision and permission-aware detail-link tests.

<style>
@media(max-width:700px){.kpi-cards-guide .vp-doc table,.kpi-cards-guide .vp-doc tbody,.kpi-cards-guide .vp-doc tr,.kpi-cards-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.kpi-cards-guide .vp-doc thead{display:none}.kpi-cards-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.kpi-cards-guide .vp-doc td{overflow-wrap:anywhere}.kpi-cards-guide .vp-doc tr{margin-bottom:12px}}
</style>
