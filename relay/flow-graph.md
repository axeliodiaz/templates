---
aside: false
pageClass: flow-graph-guide
---
<script setup>
import FlowGraph from '../.vitepress/theme/flow-graph/FlowGraph.vue'
import { sample } from '../.vitepress/theme/flow-graph/flow-graph.sample'
const demo = { ...sample, legend: true }
</script>

# Flow graph (tool access map)

## Live demo

Four synthetic agents share nine tools. Choose an agent, open a tool with call history, then replay a call. The sample is in Spanish. Replay is a local two-second simulation: no command runs, no payment is made, and nothing is sent to a service. Input editing is intentionally read-only.

<div class="relay-frame"><div class="relay relay-bs6" data-bs-theme="dark"><div class="rl-canvas" style="padding:16px"><FlowGraph :config="demo" /></div></div></div>

## When to use it

Use it for a tool access map or a single-agent input/output flow. Data controls the nodes, access, call counts and history. Do not use it for arbitrary DAGs, drag-and-drop editing, zoom or panning. Use the [node flow builder](/node-flow) for those graphs. This component supports Relay dark surfaces only.

## Anatomy

1. The header identifies the agent and computes accessible tools and total calls from tool nodes.
2. A keyboard-accessible tablist selects Researcher, Coder, Writer or Analyst.
3. Input tools sit to the left of the agent; output tools sit to the right. Stable node IDs keep positions continuous between groups.
4. Curved edges connect only tools with access. Text and status icons carry the same meaning as color. Four Coder edges carry moving particles.
5. The agent card shows its model, task and status. The optional legend explains tool states.
6. A tool with history opens a two-panel detail view. Call selection updates Input and Output; Replay adds a call. Back or Escape restores focus to the tool.

## API

### Props and events

| Prop | Type | Behavior |
| --- | --- | --- |
| `config` | `FlowGraphConfig` | Required groups and optional display settings. |
| `groupId` | `string` | Controlled group (`v-model:groupId`); otherwise internal selection. |
| `detailNodeId` | `string \| null` | Controlled detail (`v-model:detailNodeId`). |
| `onSelectGroup` | `(groupId: string) => void` | Called after a group is selected. |
| `onNodeClick` | `({groupId, nodeId, kind}) => void` | Called for a tool with access. History also opens unless detail is controlled. |
| `onReplay` | `({groupId, nodeId, call}) => Promise<CallRecord>` | Optional real implementation. Without it, replay is synthetic. Rejection records a failed call. |
| `onBack` | `({groupId, nodeId}) => void` | Called when detail closes. |

Events: `update:groupId` emits a string; `update:detailNodeId` emits a string or `null`. Callbacks are props, so replay can return a Promise. Exposed methods: `replayEntrance()` and `refresh()` (remeasure edges).

### Types

Import the types from `flow-graph.types.ts`. Each group needs exactly one agent and unique node IDs. Edges may be omitted: accessible sources connect to the agent, and the agent connects to accessible targets. Explicit edges to denied tools are discarded. Tool call counts determine header totals; keep them consistent with history.

```ts
export type NodeKind = 'source' | 'agent' | 'target'
export type ToolStatus = 'active' | 'idle' | 'no-access' | 'failed' | 'running'
export type AgentStatus = 'running' | 'needs-you' | 'failed' | 'idle'
export type NodeStatus = ToolStatus | AgentStatus
export type EdgeStatus = 'running' | 'needs-you' | 'failed' | 'idle'

export interface FlowNode {
  id: string
  kind: NodeKind
  label: string
  sublabel?: string
  description?: string
  icon?: string
  status: NodeStatus
  calls?: number
  lastCallMs?: number
  column?: 0 | 1 | 2
  order?: number
}

export interface FlowEdge {
  from: string
  to: string
  status?: EdgeStatus
  animated?: boolean
}

export interface CallRecord {
  id: string
  label: string
  startedAt: string
  durationMs?: number
  status: 'ok' | 'failed' | 'running'
  input: unknown
  output?: unknown
}

export interface NodeDetail {
  nodeId: string
  title?: string
  sublabel?: string
  calls: CallRecord[]
}

export interface FlowGroup {
  id: string
  label: string
  nodes: FlowNode[]
  edges?: FlowEdge[]
  details?: Record<string, NodeDetail>
}

export interface FlowGraphLabels {
  title: string
  tabsAria: string
  sources: string
  targets: string
  noAccess: string
  idle: string
  lastCall: (ms: string) => string
  failed: string
  running: string
  needsYou: string
  agentIdle: string
  calls: (n: number) => string
  tools: (a: number, t: number) => string
  back: string
  replay: string
  editInput: string
  input: string
  output: string
  more: (n: number) => string
  less: string
  uses: (agent: string, list: string) => string
  sendsTo: (agent: string, list: string) => string
  noAccessList: (list: string) => string
  none: string
}

export interface FlowGraphConfig {
  groups: FlowGroup[]
  defaultGroupId?: string
  labels?: Partial<FlowGraphLabels>
  maxPerColumn?: number
  maxAnimatedEdges?: number
  legend?: boolean
}

```

`defaultGroupId` defaults to the first group; `maxPerColumn` defaults to 6 (five tools plus an expand button), `maxAnimatedEdges` to 12, and `legend` to false. `labels` overrides any Spanish default, including count and relationship formatters. Call history is newest first and paginates in batches of 50. JSON is formatted, limited to 100 KB, and guarded against circular values.

## States

| Tool state | Surface and text | Edge |
| --- | --- | --- |
| `active` | Solid border, teal icon, last-call text and count. | Agent color; particle while agent is running. |
| `idle` | Solid border, teal icon, "Sin usar aún". | Half-opacity line, no particle. |
| `running` | Violet border, "En curso" and spinner. | Animated while enabled. |
| `failed` | Danger border, alert icon and "Falló". | Danger, no particle. |
| `no-access` | Dashed border, dimmed icon only, lock and "Sin acceso"; disabled callback. | None. |

Agent states are `running`, `needs-you`, `failed` and `idle`. Edges use violet, amber, danger and idle tokens respectively. Amber glow pulses; failed and idle edges remain static. Selected tabs have a pill indicator; focus rings are visible. Returning from detail briefly marks the last-opened tool. Invalid groups are disabled and show a safe error state.

## Motion

| Interaction | Timing |
| --- | --- |
| Entrance | Spring 300/30/1; configured node stagger 40 ms, with one-frame (~16 ms) observation tolerance. Initial setup can coalesce first callbacks. |
| Edge draw | Starts 120 ms after the last configured node start; 500 ms draw with 30 ms edge stagger. |
| Particle | 1500 ms linear loop, 180 ms phase offset, maximum 12. Pauses offscreen, on a hidden page and in detail. |
| Group change / expansion | Shared-node FLIP spring 250/25/1; edges follow visual anchors. |
| Edge state | 200 ms color/particle fade; leaving edges fade over 160 ms. |
| Detail | Graph fades and scales to .95 within 350 ms; title moves from the tool label. |
| Replay row | Height 0 to 52 px in 300 ms; demo resolves after 2000 ms. |
| Counts | 700 ms ease-out; accessible totals update immediately. |
| Hover / press | 160 ms surface transition; no node movement. |

Reduced motion removes particles, springs, transforms, spinners and pulsing. Group and detail changes use a 150 ms crossfade; counters update immediately. At 4x CPU the original 50 ms long-task target was not met; the accepted release ceiling is approximately 200 ms (measured 121-196 ms). This is a documented deviation, not a claim that the original target passed.

## Accessibility

Tabs support Left/Right, Home and End, wrapping and skipping invalid groups. Only the selected tab is in the tab order. Each panel has matching `aria-controls` / `aria-labelledby`; IDs are unique per instance. Nodes use native buttons, disabled access is stated in text, and no-access text is never dimmed through ancestor opacity. Screen-reader relationship sentences remain visible in the mobile list and without JavaScript.

Detail focuses its title and makes the graph and tabs inert. Escape closes the read-only input dialog first, then detail. Back restores tool focus. A polite live region announces selection and replay results. Text is checked against WCAG AA contrast; status never depends on color alone. Below a 640 px container, wires give way to a full-width list; from 640 to 919 px the graph is compressed. Server-rendered HTML includes tabs, nodes, totals and relationships, without measured wires.

## Minimal usage

```vue
<script setup lang="ts">
import FlowGraph from '../.vitepress/theme/flow-graph/FlowGraph.vue'
import { sample } from '../.vitepress/theme/flow-graph/flow-graph.sample'
const config = { ...sample, legend: true }
</script>

<template>
  <div class="relay-frame">
    <div class="relay relay-bs6" data-bs-theme="dark">
      <div class="rl-canvas" style="padding:16px">
        <FlowGraph :config="config" />
      </div>
    </div>
  </div>
</template>
```

<style>
.flow-graph-guide .content-container { max-width: none !important; }
.flow-graph-guide .content { max-width: none !important; }
.flow-graph-guide .container { max-width: 1152px !important; }
.flow-graph-guide .relay-frame { max-width: none; background: #080a12 !important; }
.flow-graph-guide .relay-frame > .relay { background: #080a12; border-radius: 16px; }
</style>
