---
aside: false
---
# Assay evaluation lab

A light-only lab for AI agent and MCP tool evaluations. Warm paper, black type and one orange signal keep attention on the evidence. All data is synthetic; no backend, provider, email or billing account is connected.

[Open the full dashboard](/assay/dashboard) · [Foundations](/assay/foundations) · [Agent orchestration](/assay/agent-orchestration)

![Assay run dashboard](/thumbnails/assay.webp)

## When to use it

Use Assay to inspect a run, compare model quality across commits, find weak MCP tools and read the tool-call chain behind a failing case. Do not use it for financial reporting, production incident management or as proof that a real tool call happened.

## Anatomy

1. The rail selects Runs, Suites, Models, MCP Tools, Traces and Datasets. Non-run destinations are honest preview states, not invented dashboards.
2. The top bar identifies the agent and run, with running progress and an accessible Compare preview.
3. Four KPI cards summarize pass rate, regressions, latency and cost per task.
4. Three model series show pass rate across six commits. Select a commit to read every model value.
5. A live trace names the current step without relying on color.
6. Tool-by-suite accuracy and failing cases expose the evidence underneath the headline numbers.

## Mount

```vue
<script setup>
import AssayDashboard from './AssayDashboard.vue'
import { assaySample } from './assay.sample'
</script>
<AssayDashboard :config="assaySample" @select-case="inspectCase" />
```

The component owns its `.assay.assay-bs6` wrapper and product `main` landmark. Mount it outside another `main`, as the full-page demo does. `config` accepts a typed run, navigation and label overrides. Events: `select-nav`, `compare`, `view-billing`, `view-all-failing`, `select-case` and `select-commit`. No event sends or saves anything.
