---
aside: false
---
<script setup>
import {ref,computed} from 'vue'
import TopologyGraph from './.vitepress/theme/graph/TopologyGraph.vue'
import WorkflowBuilder from './.vitepress/theme/graph/WorkflowBuilder.vue'
const dark=ref(false),incident=ref(false),selected=ref('api'),notice=ref('')
const services=computed(()=>[
{id:'gateway',label:'Gateway',x:30,y:150,status:'healthy',latency:18},
{id:'auth',label:'Authentication',x:280,y:40,status:'healthy',latency:24},
{id:'api',label:'API',x:280,y:250,status:incident.value?'degraded':'healthy',latency:incident.value?180:42},
{id:'database',label:'Database',x:560,y:40,status:'healthy',latency:8},
{id:'workers',label:'Workers',x:560,y:250,status:'delayed',latency:120}])
const links=[{id:'g-a',source:'gateway',target:'auth'},{id:'g-api',source:'gateway',target:'api'},{id:'a-d',source:'auth',target:'database'},{id:'api-w',source:'api',target:'workers'}]
const flow=ref({nodes:[{id:'trigger',label:'Document uploaded',kind:'trigger',x:20,y:140},{id:'agent',label:'Summarize document',kind:'agent',x:280,y:50},{id:'store',label:'Review draft',kind:'action',x:540,y:140}],edges:[{id:'first',source:'trigger',target:'agent'},{id:'second',source:'agent',target:'store'}]})
</script>

# Reusable graph components

Original components for service topology and workflow editing. The host supplies all data and owns persistence, permissions and execution. These examples use fictitious data. They do not connect to infrastructure or run agents.

<button @click="dark=!dark">{{dark?'Light':'Dark'}} graph theme</button>

## Service topology

<button @click="incident=!incident">{{incident?'Clear':'Simulate'}} API incident</button>

<TopologyGraph v-model="selected" :nodes="services" :edges="links" :dark="dark" />

## Workflow builder

<WorkflowBuilder v-model="flow" :dark="dark" @configure="notice='Host configuration event: '+$event.label" />

<p role="status">{{notice}}</p>

## Install and connect

Copy the three Vue files in `.vitepress/theme/graph/` into your Vue 3 app. Install `motion` (the dependency already used here). Import the public component; `GraphCanvas.vue` is its shared renderer.

```vue
<TopologyGraph v-model="selectedId" :nodes="nodes" :edges="edges" @select="inspectService" />
<WorkflowBuilder v-model="workflow" @change="saveDraft" @configure="openSettings" @run="inspectSimulation" />
```

`@run` is a notification for the local preview, not execution permission. Never wire it directly to a production runner without your own validation and approval flow.

### Data contracts

- Node: `{ id, label, x, y, kind?, status?, subtitle?, latency? }`. IDs must be unique. Coordinates are pixels in canvas space. Status examples: `healthy`, `degraded`, `delayed`, `failed`. Latency is numeric milliseconds.
- Edge: `{ id, source, target, label? }`. Source and target reference node IDs. Invalid endpoints are omitted from the renderer. Edge IDs must be unique.
- Workflow: `{ nodes, edges }`. Editing emits new arrays/objects; the component never edits supplied props.

### TopologyGraph API

`nodes`, `edges`, `modelValue` (selected ID), `dark`, `loading`. Emits `update:modelValue` and `select(node)`. Slots `node({ node })` and `details({ node })` let a host supply service cards and telemetry. Missing selection and empty/loading states are handled. The host should replace nodes when telemetry changes.

### WorkflowBuilder API

`modelValue`, `dark`, `readonly`. Emits `update:modelValue`, `change(workflow)`, `select(node|null)`, `configure(node)` and `run(snapshot)`. Slots `toolbar` and `configuration({ node, readonly })` let the host provide domain-specific settings. Includes add/rename/remove nodes, connect/disconnect, drag/keyboard movement, undo/redo (50 edits), fit/zoom and cancellable local path simulation. External model replacement resets history so undo cannot restore stale host data.

Simulation follows a single path, pauses at branching and detects cycles. It does not execute any node. No backend, scheduling, secrets, or authorization is built in. Changes and run notifications carry your own application data only.

### Styling and accessibility

Light/dark defaults are overridable through `--graph-bg`, `--graph-surface`, `--graph-ink`, `--graph-muted`, `--graph-line` and `--graph-accent`. These can map to any template's tokens. Node buttons support Enter/Space selection; editable nodes support arrow-key movement and Delete. A connection list provides the graph relationships as text. Scrollable canvases keep controls usable on narrow screens.

Motion handles node entrance, cancels on unmount and restores final styles on interruption or reduced-motion changes. Local simulations are cancellable and skip delay under reduced-motion. Multiple instances are independent; there are no global SVG IDs, global listeners or shared mutable graph state.

## Pattern credits

- [Akash: topology](https://x.com/a1x45h/status/2108249928145543356)
- [Adrian: workflow builder](https://x.com/adriankuleszo/status/2108459992802328903)

Original implementation, no source images, branding or code copied. This provides reusable component behavior, not a claim that every interaction from the reference videos is reproduced.
