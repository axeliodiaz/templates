---
aside: false
---
# Agent orchestration module

TPL-ORCH-01 is a shared Vue presentation module for observing multi-agent runs. It is not an execution engine. All demo data, model names, timestamps, controls and prices are synthetic. No providers, network requests, API credentials, real approvals or billing are connected.

## Catalog scope matrix

Inventory from `TemplateGallery.vue`, `page-themes.ts` and the VitePress sidebar, checked against the current develop checkout. Every distinct template language is included. Aliases share the same adapter instead of duplicating logic. All hosts are Vue/VitePress, so no stack incompatibility was found. New nested routes below follow the existing theme route conventions; each source page links to its demo. Theme variants describe the existing host support, not an invented global dark mode.

| Template | Existing location | Demo route | Variants | Adapter / stack decision |
| --- | --- | --- | --- | --- |
| Felix | /felix | [/felix/agent-orchestration](/felix/agent-orchestration) | Light + dark | Include: Felix route tokens; Vue-compatible |
| Meadow | /home-care | [/home-care/agent-orchestration](/home-care/agent-orchestration) | Light + local dark | Include: Local homecare palette; Vue-compatible |
| Margin | /margin | [/margin/agent-orchestration](/margin/agent-orchestration) | Light + dark | Include: Page-theme tokens; Vue-compatible |
| Evertrue | /evertrue | [/evertrue/agent-orchestration](/evertrue/agent-orchestration) | Light only | Include: Fixed cream terminal palette; Vue-compatible |
| Sentinel | /agent-security | [/agent-security/agent-orchestration](/agent-security/agent-orchestration) | Light + local dark | Include: Local lab palette, isolated from shell; Vue-compatible |
| Brief | /agent-onboarding | [/agent-onboarding/agent-orchestration](/agent-onboarding/agent-orchestration) | Light + local dark | Include: Local lab palette, isolated from shell; Vue-compatible |
| Pace | /fitness; /pace | [/pace/agent-orchestration](/pace/agent-orchestration) | Light + dark | Include: Shared page-theme family; Vue-compatible |
| Cargo | /trade-finance | [/trade-finance/agent-orchestration](/trade-finance/agent-orchestration) | Light + dark | Include: Page-theme tokens; Vue-compatible |
| Trial journey | /trial-journey | [/trial-journey/agent-orchestration](/trial-journey/agent-orchestration) | Dark only | Include: Chart example, shared dark shell; Vue-compatible |
| Relay | /relay | [/relay/agent-orchestration](/relay/agent-orchestration) | Light + dark | Include: Page-theme tokens; Vue-compatible |
| Folio | /folio; /trading-panel | [/folio/agent-orchestration](/folio/agent-orchestration) | Light + dark | Include: Shared page-theme family; Vue-compatible |
| Spark | /spark; /spark-analytics | [/spark/agent-orchestration](/spark/agent-orchestration) | Light + dark | Include: Shared page-theme family; Vue-compatible |
| Bastion | /bastion | [/bastion/agent-orchestration](/bastion/agent-orchestration) | Light + dark | Include: Page-theme tokens, square mono panels; Vue-compatible |
| Lustro | /lustro | [/lustro/agent-orchestration](/lustro/agent-orchestration) | Light + dark | Include: Default shell and Lustro switch; Vue-compatible |
| PulseFit | /pulsefit | [/pulsefit/agent-orchestration](/pulsefit/agent-orchestration) | Light + dark | Include: Dedicated theme classes; Vue-compatible |
| Scopecraft | /scopecraft | [/scopecraft/agent-orchestration](/scopecraft/agent-orchestration) | Light + dark | Include: Dedicated theme classes; Vue-compatible |
| Lumen | /lumen | [/lumen/agent-orchestration](/lumen/agent-orchestration) | Light + dark | Include: Dedicated theme classes; Vue-compatible |
| Pawprint | /pawprint | [/pawprint/agent-orchestration](/pawprint/agent-orchestration) | Light + dark | Include: Dedicated theme classes; Vue-compatible |
| Umail | /umail | [/umail/agent-orchestration](/umail/agent-orchestration) | Light + dark | Include: Legacy page-theme tokens; Vue-compatible |
| Fixtrack | /fixtrack | [/fixtrack/agent-orchestration](/fixtrack/agent-orchestration) | Light + dark | Include: Legacy page-theme tokens; Vue-compatible |
| Crestway | /crestway-financials | [/crestway-financials/agent-orchestration](/crestway-financials/agent-orchestration) | Light + dark | Include: Legacy page-theme tokens; Vue-compatible |

| Reference collection | /reference-templates | [Canonical contract](/agent-orchestration) | Not a separate theme | Index of Margin/Sentinel/Brief/Pace/Cargo and graphs, all covered above |
| Reusable graphs | /graph-components | [Canonical contract](/agent-orchestration) | Not a separate template | Component guide; module is itself reusable |

The home gallery is an index, not a template. Generic component guides share Lustro. Folio trading and Spark analytics are aliases of their family tokens, not additional visual languages. No template is deferred. Fixed light/dark examples do not receive a new unsupported mode. Screenshot evidence is produced by `tests/agent-orchestration.cjs` for every supported variant, desktop and compact widths.

## Data contract

Source: `.vitepress/theme/agent-orchestration/model.ts`. A `Run` owns ISO timestamps, nodes, typed hierarchy/handoff/dependency edges, events, usage and per-control capabilities. Node kinds are run, phase, agent and task. Status mapping covers queued, running, paused, succeeded (Done), failed, canceled and needs_input (Needs you). Empty, loading and error are presentation states independent of run status.

Each node has a stable ID, parent ID, status, nullable model, start/end timestamps, duration and optional error. The graph, hierarchy, drawer and trace share these IDs. Usage references an agent/task/run subject and records input/output/cache tokens and USD cost. Unknown is `null`, rendered as n/a. An actual zero is rendered as 0 or $0.00.

Usage units must identify their basis. `exclusive` means usage owned only by that subject, excluding all descendants. `inclusive` is a parent summary for display, not an additive ledger entry. Totals add exclusive entries once, never parent inclusive summaries. Consumers must not label inclusive totals as exclusive. Missing exclusive fields result in a known subtotal with a partial label, never a claim of zero. Cache is a subset of input, not an extra token category to add again. Totals derive from the same ledger in every theme. The fixture has 82,000 known input tokens and $0.52 known cost, with one unknown usage unit. Run duration is elapsed time, not the sum of concurrent node durations; completed steps count tasks only.

## Minimal consumer

```vue
<script setup lang="ts">
import { ref } from 'vue'
import AgentOrchestration from './AgentOrchestration.vue'
import { fixture, type Run, type Action, type Ack } from './model'
const run = ref<Run>(fixture())
async function control(action: Action, current: Run): Promise<Ack> {
  // Consumer owns authorization, server request and authoritative state updates.
  // Never return ack before the real service acknowledges the control.
  return { state: 'error', message: 'No execution adapter connected.' }
}
</script>
<template><AgentOrchestration :data="run" :control="control" /></template>
```

Replace `data` with a new run object for incremental updates, preserving stable node IDs. Selection, tabs, filters, collapse state, map zoom and graph/trace scroll remain local and are not reset by updates. If a selected ID is removed, details close without selecting an unrelated node. Consumer data is never mutated; the consumer applies authoritative acknowledged status changes to its data. `selection` and `control` events report UI intent/results for integration.

Capabilities expose pause/resume/stop/retry only when declared and meaningful for the current status. Pending disables duplicate actions. A rejected promise becomes error, never ack. The sample adapter waits 650ms, supports injected errors and acknowledges Pause only after the current simulated call. No auto-running loop, auto-scroll or network exists. Approve and deny have no implementation in this demo. Approval events are visible as data only.

## Interaction, accessibility and motion

The graph groups orchestrator, phases, agents and tasks, with collapsible phases and persistent selection. Handoff/dependency edges are described in selected-node Connections, separate from hierarchy lines. Trace is horizontally scrollable with named focusable bars and a fixed time scale. Events support type/text filters and the selected node's descendants. Clear filters does not reset selection. Drawer closure returns focus to the triggering node; Escape closes it. Tabs support arrow, Home and End keys. All status chips include symbols and words, not just color.

List view is an equivalent hierarchy available on desktop and the default compact rendering. No page-wide horizontal scroll is needed; graph, trace and usage overflow only inside labeled focusable regions. Theme adapters reuse host surface, text, border, typography and brand tokens, with family-specific radius/spacing. No ornamental animation or flashing live state is used. Reduced-motion disables any inherited animations and transitions. Forced colors preserve selection and trace bars. The demo is bounded and deterministic, with no unmeasured performance claims.

## Reference and boundaries

Pattern reference: [Agent Orchestration screen by @flohoeller](https://x.com/componest/status/2119448345479401707), [Affect UI](https://www.affectui.com/). Original implementation, not copied assets or a reproduction of a proprietary screen. No reference image or source ZIP is redistributed. Integrations with agents-ai, personal sites, backends, providers, secrets and real side effects are outside this module.

## Verification

Run `node tests/agent-orchestration-consumer.cjs`, `node tests/agent-orchestration-model.cjs`, `node tests/agent-orchestration.cjs`, and `npm run build`. The consumer test covers controlled updates, unique IDs across two mounted instances, read-only missing callbacks, asynchronous acknowledgment/rejection and safe invalid data. The model test covers deterministic parity, unknown versus zero, exclusive aggregation, hierarchy cycles and control acknowledgments/errors. The UI test covers theme variants, responsive widths, selection/tabs/filters, incremental stability, state views, errors, keyboard and visual captures. A successful local example does not establish a real agent action or payment.
