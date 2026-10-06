---
aside: false
pageClass: lmn-page
---

<script setup>
import WorkflowOps from '../.vitepress/theme/WorkflowOps.vue'
</script>

# Workflow operations

A workflow operations overview based on the cropped dashboard post (https://x.com/jubayer6910/status/2107000333046067686): a header with search, help and an account menu that lists workspaces, three KPI cards with a tick progress bar, a two line chart with a hatched area and a Week, Month and Year switch, and a "Needs attention" queue ranked High, Medium and Low. Themed for Lumen. Open the account menu to switch workspace (the KPIs change) and press Escape to close it. Cards and ticks animate in with Motion and stay still with reduced motion. Only part of the source screen was visible, so the left navigation is not included. Fictitious data.

<WorkflowOps theme="lumen" />

## Anatomy

| Part | Notes |
|---|---|
| Account menu | Identity, a workspace list with a checked radio item, then profile, preferences, theme and log out; closes with Escape |
| KPI cards | Colored left rule, value, change with an arrow and a 60 tick progress strip |
| Chart | Two lines, one with a hatched area, and a period switch |
| Needs attention | Priority label, item, reason and an ETA pill; priority is also written out, not only colored |
