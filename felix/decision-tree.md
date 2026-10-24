---
aside: false
---

<script setup>
import DecisionTree from '../.vitepress/theme/DecisionTree.vue'
import { lowRiskDecision, sampleDecisions } from '../.vitepress/theme/decision-tree.sample'
</script>

# Decision tree

A horizontal decision graph for a queue of agent choices, in the Felix design language. Linen cards, slate type, turquoise focus, and semantic risk colors. The behavior follows the decision-tree walkthrough in [this post](https://x.com/flohoeller/status/2113565484469686342): columns advance left to right, curves connect choices, and a committed leaf runs before the next decision. The visuals are Felix, not a copy of that recording. Names, models, and amounts are fictitious.

## Live queue

Three decisions are waiting. The agent's pick is already open so its next column is visible. Hover or focus an option to dim its siblings and reveal its branch. Click, press Enter, or press its number to commit. A leaf shows **Approved · running**, then the queue steps forward. **Other…** asks for a free-text instruction.

<DecisionTree :decisions="sampleDecisions" show-log />

The line under the tree is the last callback (`onStep`, `onCommit`, `onAdvance`, `onComplete`, `onBack`). It is documentation, not part of the component.

## How to use it

Use a decision tree when a person has to answer an agent before work continues: incidents, approvals, discounts, spend. For a freeform automation canvas, use the [node flow](/felix/node-flow). For blockers between tasks, use the [dependency graph](/felix/dependencies).

1. **One decision at a time.** The header counts what is still waiting. The fraction and dots describe the remainder of the queue, so the decision on screen is always "1 of N".
2. **The root states the problem.** Risk, agent, question, and a muted context line. Options are a column to the right and can branch again.
3. **Preview before committing.** Hover and focus reveal the next column without choosing. Siblings fall to 40% opacity. The active curve darkens.
4. **Commit moves the queue.** Unchosen siblings fade. The stage pans left so the next column is in view. A leaf approves, then the next decision enters.
5. **Other… is a sentence, not a branch.** Hover or focus reveals the field. Enter or Send commits that text.

## Variants and states

### Agent's note and warnings

Hovering **Accept 25%** opens the finance note and the margin branch. Warning badges use Felix warning colors, separate from the risk chip on the root.

<DecisionTree :decisions="[sampleDecisions[1]]" lock-preview="accept" :auto-advance="false" />

### Approved leaf

A committed leaf freezes on **Approved · running** when `autoAdvance` is off. In the live queue it holds, then advances on its own.

<DecisionTree :decisions="[sampleDecisions[0]]" :initial-path="['rollback', 'status']" phase="approved" :auto-advance="false" />

### Empty queue

When nothing is waiting the header reads how many were decided and the stage is replaced by the empty state. **Review the queue** calls `reset()`.

<DecisionTree :decisions="sampleDecisions" phase="empty" />

### Low risk

Risk is a semantic chip: high, medium, or low. It does not reuse turquoise or lime.

<DecisionTree :decisions="[lowRiskDecision]" :auto-advance="false" />

## Data shape

Pass a queue. Each decision is a tree of options. Shortcuts default to 1…n within a column. Only 1–9 are keyboard keys.

```ts
type Decision = {
  id: string
  risk: 'low' | 'medium' | 'high'
  riskLabel?: string
  agent: { name: string; model?: string }
  question: string
  context: string
  columnLabel?: string          // label above the first option column
  options: DecisionOption[]
}

type DecisionOption = {
  id: string
  title: string
  shortcut?: number             // 1–9, else sibling order
  agentPick?: boolean
  warning?: string
  note?: { title?: string; body: string; source?: string }
  other?: boolean               // free-text leaf
  otherPlaceholder?: string
  agentReply?: string           // streamed after Other… is sent
  columnLabel?: string          // label above this option's children
  children?: DecisionOption[]
}
```

The full sample queue lives in `.vitepress/theme/decision-tree.sample.ts`.

## Usage

The portable entry is `initDecisionTree`. It renders into the element you pass and does not depend on Vue. The Vue file is only the docs wrapper.

```ts
import { initDecisionTree } from './decision-tree'
import './decision-tree.css'

const tree = initDecisionTree(element, {
  decisions,
  onCommit(step) { /* leaf chosen */ },
  onComplete({ history }) { /* queue finished */ },
})

tree.getState()
tree.reset()
tree.destroy()
```

```md
<script setup>
import DecisionTree from '../.vitepress/theme/DecisionTree.vue'
import { sampleDecisions } from '../.vitepress/theme/decision-tree.sample'
</script>

<DecisionTree :decisions="sampleDecisions" />
```

### Vue props

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `decisions` | `Decision[]` | — | Queue, in order. An empty array shows the empty state. |
| `phase` | `'queue' \| 'approved' \| 'empty'` | `'queue'` | `approved` freezes `initialPath` on its leaf. `empty` skips to the finished state. |
| `initialPath` | `string[]` | — | Option ids already committed on the first decision. |
| `lockPreview` | `string` | — | Option id kept open until the pointer or focus moves. |
| `autoAdvance` | `boolean` | `true` | After a leaf, wait and load the next decision. |
| `showLog` | `boolean` | `false` | Docs-only line that prints the last callback. |

### Init options

| Option | Type | Default | Purpose |
|---|---|---|---|
| `decisions` | `Decision[]` | — | Queue rendered one at a time. |
| `autoAdvance` | `boolean` | `true` | Advance after a leaf. |
| `advanceDelay` | `number` | `1000` | Milliseconds the approved leaf stays up. |
| `initialIndex` | `number` | `0` | Which decision opens first. |
| `initialPath` | `string[]` | — | Committed option ids for that decision. |
| `lockPreview` | `string` | — | Option to preview until interaction moves on. |
| `phase` | `'queue' \| 'approved' \| 'empty'` | `'queue'` | Starting phase. |
| `onStep` | function | — | Every commit, including a choice that still has children. |
| `onCommit` | function | — | A leaf was chosen. The decision is resolved. |
| `onAdvance` | function | — | The queue moved to the next decision. |
| `onComplete` | function | — | Nothing is waiting. |
| `onBack` | function | — | Esc or ArrowLeft undid the last commit. |
| `onPreview` | function | — | Hover or focus changed the open branch. |

`getState()` returns `{ index, total, remaining, path, phase, decisionId, done, history }`.

## Events

Callbacks and DOM events carry the same detail. Events bubble from the `.dt` root: `dt-step`, `dt-commit`, `dt-advance`, `dt-complete`, `dt-back`, `dt-preview`.

| Event | When | Detail |
|---|---|---|
| `dt-step` | An option is committed | `{ decisionId, optionId, title, shortcut, depth, path, leaf, text?, agent }` |
| `dt-commit` | The committed option is a leaf | Same as `dt-step`. `text` is set for Other…. |
| `dt-advance` | The next decision is shown | `{ fromId, toId, index, decision }` |
| `dt-complete` | The queue is finished | `{ history }` of leaf commits |
| `dt-back` | The last commit was undone | `{ decisionId, path }` |
| `dt-preview` | The open branch changed | `{ decisionId, optionId }` |

`path` is the committed chain as `{ id, title, shortcut }[]`, including the option that was just chosen.

## CSS variables

Set these on `.dt` or an ancestor. Felix light and dark assign them for you. Outside this docs site, load `felix-tokens.css` or set the variables yourself.

| Variable | Role | Light fallback |
|---|---|---|
| `--dt-bg` | Stage background | `#fefcf9` |
| `--dt-card` | Root and option cards | `#fffefa` |
| `--dt-text` | Primary text | `#172d2c` |
| `--dt-muted` | Context, hints, model line | `#636158` |
| `--dt-muted-bg` | Shortcut and kbd fill | `#efebe7` |
| `--dt-line` | Borders | `#cfcabf` |
| `--dt-slate` | Text on turquoise buttons | `#082422` |
| `--dt-brand` | Agent's pick label | `#087b76` |
| `--dt-accent` | Send and review buttons | `#2bf2f1` |
| `--dt-accent-soft` | Avatar fill | `#d4fffe` |
| `--dt-lime` | Agent's pick dot | `#dcff00` |
| `--dt-edge` | Idle curve | `#c5bfb4` |
| `--dt-edge-active` | Curve on the open or committed path | `#172d2c` |
| `--dt-danger-soft` / `--dt-danger-ink` | High risk | `#fff5ef` / `#a03808` |
| `--dt-warning` / `--dt-warning-soft` / `--dt-warning-ink` | Warnings and the note | `#ffd200` / `#fffce0` / `#665500` |
| `--dt-success` / `--dt-success-soft` / `--dt-success-ink` | Low risk and approved | `#60d06f` / `#eefbf0` / `#1b7a29` |
| `--dt-shadow` / `--dt-shadow-sm` | Card elevation | slate-tinted |
| `--dt-radius` | Card radius | `16px` |
| `--dt-font` / `--dt-display` / `--dt-mono` | Saans, Plain, mono | system stacks |
| `--dt-focus-ring` / `--dt-focus-shadow` | Keyboard focus | `#065958` + turquoise glow |
| `--dt-dim` | Sibling opacity while previewing | `0.4` |
| `--dt-pan` | Pan and decision transition | `420ms` |
| `--dt-fade` | Opacity and stroke transition | `180ms` |
| `--dt-gap` | Space between columns. 64px from 920px wide. | `32px` |

## Keyboard and accessibility

The tree is operable without a pointer. Focus is a visible turquoise ring plus a slate outline so it holds up on linen and in dark mode.

| Key | Action |
|---|---|
| `1`–`9` | Commit the shortcut in the active column. On Other…, moves into the field. |
| `↑` `↓` | Move through the active column. |
| `Enter` or `Space` | Commit the focused option. Inside the Other… field, Enter sends. |
| `→` | Commit the focused option and reveal the next column. |
| `←` or `Esc` | Undo the last commit. Esc inside the field leaves the field first. |
| `Tab` | Move through the visible options, the text field, and Send. |

Each column is a `group`. Options are buttons with `aria-pressed`, `aria-expanded` when they have children, and `aria-keyshortcuts`. A polite live region announces the choice, the approved leaf, the next decision, and the empty queue. Curves are decorative (`aria-hidden`). The empty state keeps its heading in the page.

Sibling options that have faded out are removed from the tab order. Reduced motion does not remove the approved state or the announcements. It drops movement.

## Responsive layout and motion

From 561px of component width upward the flow stays horizontal. Committing pans the stage left. Hovering a branch pans just enough to show its column. At 560px and below, including a 390px phone, columns stack and curves run from the bottom of a card to the top of the next. The same stack applies when the component itself is narrow, even on a wide window.

Motion is on by default and follows `prefers-reduced-motion`:

- Option entrance, sibling fade, curve darkening, and the pan use short transitions.
- A new curve draws on once. It does not loop.
- The next decision fades and slides in. Reduced motion swaps it in place.
- Inside these docs the shared `template-motion` layer also fades the section in and lifts buttons on hover. The component does not depend on that layer. Its own CSS and `matchMedia` guard are enough when it is copied elsewhere.
- `prefers-reduced-motion: reduce` sets animation and transition to none, skips the curve drawing, and shows an Other… reply in full instead of streaming it.

## Integration notes

Copy `.vitepress/theme/decision-tree.ts` and `.vitepress/theme/decision-tree.css`. Mount with `initDecisionTree(element, { decisions })` and import the stylesheet once. The sample queue is optional (`.vitepress/theme/decision-tree.sample.ts`). `DecisionTree.vue` is the VitePress wrapper around that same function.

Felix examples are custom CSS under `.dt`, with light and dark overrides next to the other Felix canvases. On this site the tree follows the Felix theme toggle (`html.felix.felix-dark`), because VitePress already puts `dark` on `<html>` while Felix is still in its light theme. A host that is not a Felix doc can turn the same dark palette on with `.dark` or `[data-theme="dark"]` on an ancestor, or with `.felix-dark`. This component does not use Bootstrap. Felix's Bootstrap 6 catalog is a separate iframe app, and this tree does not belong in that catalog, so no Bootstrap files were changed.

State lives in the element. `destroy()` removes listeners and timers. Nothing is stored and nothing is sent to an agent. All data on this page is fictitious.
