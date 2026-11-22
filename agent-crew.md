---
aside: false
pageClass: crew-page
---
<script setup>
import AgentCrew from './.vitepress/theme/agent-crew/AgentCrew.vue'
</script>

# Agent crew module

<AgentCrew />

TPL-CREW-01 is a shared Vue presentation module for watching a persistent multi-agent crew. It is not an execution engine. Demo projects, models, timestamps, handoffs and costs are synthetic. No providers, billing, or steering adapters are connected in the default demo.

## Catalog scope matrix

Inventory from `.vitepress/theme/agent-crew/inventory.json`, aligned with the Agent orchestration catalog. Every distinct template language receives a nested `/…/agent-crew` route. Aliases share the same adapter instead of duplicating logic.

| Template | Demo route pattern | Variants | Adapter |
| --- | --- | --- | --- |
| See [Agent orchestration catalog](/agent-orchestration#catalog-scope-matrix) | `/<template>/agent-crew` | Same as orchestration | Same host tokens |

Screenshot evidence is produced by `tests/agent-crew.cjs` for supported variants at desktop and compact widths.

## Data contract

Source: `.vitepress/theme/agent-crew/crew.model.ts`. A project owns a single root `CrewAgent` tree with optional `CrewHandoff` records. Status values: `working`, `idle`, `paused`, `needs_you`, `done`, `failed`. Unknown numeric fields are `null` and render as `n/a`.

Context ratio uses `used/limit` clamped to 0–1 with levels `work`, `late` (≥0.8) and `over` (≥0.95). `validate` rejects duplicate ids and hierarchy cycles.

## Minimal consumer

```vue
<script setup lang="ts">
import { ref } from 'vue'
import AgentCrew from './.vitepress/theme/agent-crew/AgentCrew.vue'
import { projects } from './.vitepress/theme/agent-crew/crew.sample'
import type { CrewAgent, SteerAction, Ack } from './.vitepress/theme/agent-crew/crew.model'
const active = ref('onboarding')
async function steer(agent: CrewAgent, action: SteerAction): Promise<Ack> {
  return { state: 'error', message: 'No steering adapter connected.' }
}
</script>
<template><AgentCrew v-model="active" :projects="projects()" :steer="steer" /></template>
```

`v-model` selects the active project id. Changing projects closes any open dialog and replays card entrance. Consumers supply authoritative trees; the sample adapter in `crew.sample.ts` is deterministic.

## Interaction, accessibility and motion

Tree and compact list layouts share one hierarchy. Cards support roving focus with arrow keys, Home, End, Enter and Escape. The v1 dialog is read-only (no steering controls). Header shows `N working · N needs you · N agents`. New handoffs animate a single pulse along connector paths with a floor glow on the target card. `prefers-reduced-motion: reduce` disables motion and spinners.

## Reference and boundaries

Pattern reference: [Agent Crew by @flohoeller](https://x.com/componest/status/2122345064751931523), [Affect UI](https://www.affectui.com/components/agent-crew). Original implementation; no proprietary assets or code are redistributed. Distinct from [Agent orchestration](/agent-orchestration) (run observation) and Flow Graph (pipeline topology).

## Verification

Run `npm run test:agent-crew-model`, `npm run test:agent-crew-contrast`, `npm run test:agent-crew`, `npm run test:agent-crew-motion`, and `npm run build`. Model tests cover validation, formatting and handoff paths. Contrast: [measured pairs for all 22 adapters](/agent-crew-contrastes) (`npm run test:agent-crew-contrast`, source `.vitepress/theme/agent-crew/verificacion/contraste.py`). UI tests cover keyboard tree navigation, dialog width, header counts, light/dark variant sweeps at 1720 and 390 px, inventory routes and overflow captures under `.artifacts/agent-crew/`.