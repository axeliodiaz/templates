<script setup>
import DependencyGraph from '../.vitepress/theme/DependencyGraph.vue'
</script>

# Dependency graph (PulseFit)

A task dependency graph in PulseFit: white cards on the light gray page, charcoal for blocking links, gold for review, Bebas Neue titles. Inspired by the module graph in [this post](https://x.com/_overment/status/2106102411051888770): a top-down layout, many colored links grouped by type, hover to trace a chain, and a side panel with details. Reinterpreted for task dependencies, not a copy. All names and data are fictitious.

A natural PulseFit case is a studio launch: a new class series needs a coach brief, a schedule, a sign-up page and a member email, in that order.

## Product launch

Eleven tasks across design, engineering and marketing. Hover or select a card to light up its chain. Press **Start task** and **Mark done** in the inspector to watch blocked cards unlock. Turn on **Critical path** to see the longest chain of blocking work. These are local UI demonstrations, not connected project data.

<div class="pf-dgx"><DependencyGraph scenario="launch" /></div>

## Client engagement

The same pattern for a service business, where a client review gates the handoff and an asset license gates delivery.

<div class="pf-dgx"><DependencyGraph scenario="studio" /></div>

## How to use it

Use a dependency graph when the question is "what is stopping this?" or "what happens if this slips?". A board shows where work is, a graph shows why it cannot move.

1. **Describe each task once.** A task has an id, a title, an owner, an effort estimate and a list of links to the tasks it depends on.
2. **Type every link.** A link is one of three kinds. *Blocks* means the target cannot start until the source is done. *Needs review* is a sign-off step. *Shares output* means the target uses a file or decision from the source but can start without it. Only *Blocks* decides whether a task is blocked.
3. **Derive the status.** A task is Done, In progress, Ready (every blocking source is done) or Blocked. Never store Blocked by hand, compute it, so the graph and the Board stay in agreement.
4. **Lay out by layers.** A task sits one layer below its deepest source. Order cards inside a layer to reduce crossings, then draw each link as a curve from the bottom of the source to the top of the target.
5. **Read it by selection.** Selecting a task highlights everything upstream (what it waits on) and downstream (what waits on it). Everything else dims, it does not disappear.
6. **Find the critical path.** Sum the effort along each chain of *Blocks* links. The longest chain decides the finish date, so protect it first.

### Data shape

```ts
type Link = [sourceId: string, kind: 'blocks' | 'review' | 'shares']
type Task = {
  id: string
  title: string
  owner: string
  days: number            // effort in working days
  dependsOn: Link[]
  state: 'todo' | 'doing' | 'done'   // Blocked and Ready are derived
}
```

### Usage

```md
<script setup>
import DependencyGraph from '../.vitepress/theme/DependencyGraph.vue'
</script>

<DependencyGraph scenario="launch" />
```

## Anatomy

| Part | Purpose |
|---|---|
| Task card | Status label with effort, title and owner initials. A status bar on the left edge repeats the status in color. |
| Link | A curve from the bottom of the source to the top of the target. Color and dash pattern encode the kind. |
| Animated link | A *Blocks* link flows while its source is In progress. Motion stops when reduced motion is set. |
| Link type chips | Toggle each kind on or off. The number is how many links of that kind exist. |
| Counters | Done, Ready and Blocked, derived from the same data as the cards. |
| Inspector | Owner, effort, what the task waits on, what it unblocks, and the one action that applies. |
| Critical path | Dims everything except the longest chain of blocking work. |

## Design rules

1. Let status lead. Done, In progress, Ready and Blocked each have a text label, never color alone.
2. One accent per meaning: link kind is color plus dash pattern, status is the card's left bar and label.
3. White cards, gold focus ring and gold primary action follow PulseFit. Gold text uses the ink gold #7a5a1f so it passes contrast on white.
4. Dim, do not hide. A selection lights its chain and fades the rest to about 20%.
5. Keep links thin (1.6px), and thicker (2.6px) only on the selected chain.
6. Never animate a link that is not doing work. Only a link leaving an In progress task flows.
7. Keep the graph readable with fewer than about 25 tasks per view. Above that, group tasks into a parent task and open the group on selection.
8. Cards are keyboard buttons. Tab moves between cards, Enter or Space selects, and the inspector announces the result. The graph never relies on hover alone.
9. A link can add or remove a block, but this demo has no drag-to-connect, persistence or cycle repair. A real product must reject a link that creates a cycle.

## Integration notes

The shared Vue component is `DependencyGraph.vue`. Pass `scenario="launch"` or `scenario="studio"` and include `dependency-graph.css`. Colors come from `--dg-*` variables scoped to `.dg`, with Felix light and dark overrides, and a PulseFit override under `.pf-dgx`. The layout is computed in the browser from the task list, so adding a task or link redraws the graph. No external requests are made. State is local and resets on reload.
