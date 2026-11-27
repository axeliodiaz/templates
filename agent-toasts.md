---
aside: false
pageClass: atoast-page
---
<script setup>
import { ref } from 'vue'
import AgentToasts from './.vitepress/theme/agent-toasts/AgentToasts.vue'
const demoState = ref('')
</script>

# Agent toasts module

<label>
  State
  <select v-model="demoState">
    <option value="">Default</option>
    <option value="busy">Busy</option>
    <option value="error">Error with action</option>
    <option value="queue">Queue full</option>
    <option value="empty">Empty</option>
  </select>
</label>

<AgentToasts :demo-state="demoState || undefined" theme="lustro" />

Example-only Vue module for synthetic agent results as stacked toasts with inline data graphics. No global notification service, registry, or network calls.

## Scope

Agent toasts differ from the short [Toasts](/toasts) guide: each card carries a small SVG graphic, optional single action pill, in-place busy updates, and a collapsible stack inside the demo frame. They do not replace Bootstrap specimen toasts in template catalogs.

## Catalog scope matrix

| Template | Demo route | Variants | Adapter |
| --- | --- | --- | --- |
| See `.vitepress/theme/agent-toasts/inventory.json` | `/<folder>/agent-toasts` | Per template | `.atoast-<theme>` |

## Data contract

Source: `.vitepress/theme/agent-toasts/toast.model.ts`. Tones: `neutral`, `success`, `info`, `warning`, `danger`. Graphics are pure functions (`cells`, `altText`).

## Minimal consumer

```vue
<script setup lang="ts">
import AgentToasts from './.vitepress/theme/agent-toasts/AgentToasts.vue'
</script>
<template><AgentToasts theme="meadow" /></template>
```

## Interaction, accessibility and motion

Demo controls (`Play sequence`, per-variant triggers, `Expanded`, `Auto-hide`) live inside the module toolbar. **Play sequence** runs on click only. Persistent action toasts skip autodismiss. `prefers-reduced-motion: reduce` disables shimmer, blur spotlight, and transform transitions.

| Reduced motion | Behavior |
| --- | --- |
| Entry / exit | Instant, without transform animation |
| Stack expand | Instant positions |
| Spotlight | Opacity only, no blur |
| Busy title | Static muted text |
| Active pipeline arc | No spin |

## Reference and boundaries

Pattern reference: agentic toasts by [@pitus_](https://x.com/pitus_/status/2125619571705196849). Original implementation; no code, sample data, icons or fonts from the post or from other design systems are used.

## Verification

After `npm run build`, run `npm run test:agent-toasts` to regenerate browser-computed contrast evidence and screenshots. Then run `npm run test:agent-toasts-store`, `npm run test:agent-toasts-model`, `npm run test:agent-toasts-contrast`, `npm run test:agent-toasts`, `npm run test:agent-toasts-motion`, and `npm run build`. Contrast: [measured pairs](/agent-toasts-contrastes).