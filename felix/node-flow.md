<script setup>
import NodeFlow from '../.vitepress/theme/NodeFlow.vue'
</script>

# Node flow builder (Felix)

A node-based workflow canvas in the Felix design language, inspired by the automation builder in [this post](https://x.com/nazmijavierl/status/2105911435528397124): dotted-grid canvas, rounded cards with a type label and output pill, thin curved links, a branch with condition rows, a floating toolbar, a minimap and an Add node panel. Linen surfaces and turquoise; the theme toggle also changes it. Reinterpreted, not a copy. All names and data are fictitious.

## Big deal routing

A trigger starts the flow, an AI agent scores the deal, and a branch routes it by amount to one of four actions. Select a card to see its toolbar and highlight its links. Drag cards or move them with the arrow keys. Use **+ Node** to add a step after the selected card, then undo or redo. These are local UI demonstrations. Nothing runs and nothing is saved.

<NodeFlow />

## How to use it

Use a node flow when work is a sequence with decisions: automations, approval routes, onboarding steps, or data pipelines. For plain "what blocks what" questions, use the [dependency graph](/felix/dependencies) instead.

1. **Start with one trigger.** The trigger says when the flow runs. A flow has one or more triggers and no inputs.
2. **Chain actions left to right.** Each card has a type label, a title, a one-line subtitle and an output pill that counts its outgoing links.
3. **Branch with named conditions.** A branch lists its conditions as rows. Each row has its own output port and its own link, and the last row should catch everything else (here, "No value yet").
4. **Add steps from the panel.** The Add node panel groups steps as Logic, AI, Actions and Integrations. Each item has an icon dot, a name, a description and a shortcut. A new node connects after the selected one.
5. **Show the save state.** Keep a quiet "Auto-saved draft" status and a Draft or Live switch in the header. Moving or adding a card counts as a change, and undo and redo step through changes.
6. **Orient large flows.** Zoom controls and a minimap keep a flow of 20 or more cards navigable.

### Data shape

```ts
type Node = {
  id: string
  kind: 'trigger' | 'action' | 'ai' | 'branch'
  title: string
  sub: string
  x: number; y: number
  rows?: string[]          // branch conditions
}
type Edge = { from: string; row?: number; to: string }   // row = branch condition index
```

### Usage

```md
<script setup>
import NodeFlow from '../.vitepress/theme/NodeFlow.vue'
</script>

<NodeFlow />
```

## Anatomy

| Part | Purpose |
|---|---|
| Header | Flow name, Draft or Live chip, Live switch and the + Node button. |
| Toolbar | Undo, redo, zoom out and in, reset, and the save status. |
| Canvas | Dotted grid with cards and curved links. Click empty space to clear the selection. |
| Node card | Type label, title, subtitle, output pill. Branch cards show one row per condition. |
| Link | A curve from the right edge of a card (or a condition row) to the left edge of the next. The selected card's links are emphasized. |
| Floating toolbar | Duplicate and Delete, shown above the selected card. |
| Add node panel | Grouped steps with descriptions and shortcut hints. |
| Minimap | Overview of card positions, with the selected card highlighted. |

## Design rules

1. Type is a text label first (TRIGGER, ACTION, AI AGENT, BRANCH) and a color second.
2. Keep links thin. Only the selected card's links are thicker and accented.
3. One primary action in the header: + Node.
4. Linen cards and turquoise selection follow Felix.
6. Every action is reachable without a pointer. Cards are focusable, arrow keys move them by 10px and Delete removes the selected one.
7. Never run anything from the canvas silently. Draft and Live are different states, and going live should be an explicit button.
8. This demo has no drag-to-connect, auto layout, validation or persistence. A real builder must reject cycles and warn about unreachable cards.

## Integration notes

The shared Vue component is `NodeFlow.vue`. Include `node-flow.css`. Colors come from `--nf-*` variables scoped to `.nf`, with Felix light and dark overrides and a PulseFit override under `.pf-nfx`. The stage scales to the container width and is clipped, so it works on narrow screens. Positions are absolute pixels in a 780 by 460 stage. All data is fictitious and state resets on reload.
