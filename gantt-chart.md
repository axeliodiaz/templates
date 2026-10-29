---
pageClass: gantt-guide
---
<script setup>
import GanttUsageDemo from './.vitepress/theme/GanttUsageDemo.vue'
</script>

# Gantt chart

A Gantt chart places task intervals on a shared time axis. Start position encodes start time; bar length encodes planned duration. A milestone is a point, not a short invented task. Completion can be a separate overlay but must not be mistaken for elapsed time. Use a [bar chart](/bar-chart) for quantities without start/end times or a [calendar](/calendar) for date-oriented browsing. A timeline picture does not schedule work by itself.

## Try task intervals and completion

<GanttUsageDemo />

A has overlapping task intervals, zero and full reported completion and a milestone at 18h. B moves the plan, uses 25/75/50% completion and places the milestone at the 22h axis endpoint. Toggle completion without changing planned intervals or exact table. Select any task by keyboard, touch or click. Dataset/state changes retain selection/toggle; Loading/Empty withhold geometry/table; Ready restores it. Reset returns A/Plan/completion shown/ready. No task edits or requests occur.

## How to use it

1. Define time semantics. These synthetic same-day clock-hour fixtures span 06–22 without an actual date or timezone. Planned duration=end−start in hours; no breaks, weekends, overnight dates or DST arithmetic exists.
2. Fix the domain and ordering for comparison. Plan/Build/Review/Release keep four rows on the same 06–22 scale across A/B. Changing a dataset does not recenter or rescale.
3. Keep duration and progress separate. Planned bars are outlined tracks; the filled overlay is reported completion×planned width. Review A is 100% done even though its scheduled time is later than Plan. No current time is modeled.
4. Render milestones as points. Release has start=end and no positive-duration bar or completion percentage. The visible diamond is a symbol centered at that time, not a duration interval.
5. Do not infer resource conflicts from overlap. These are task rows with no assigned resources, capacity, precedence or dependencies. Overlap A demonstrates parallel planned intervals, not a detected booking collision.
6. Define interval closure for live schedules. Half-open[start,end) prevents touching endpoints from being counted as overlap; an actual milestone is a distinct point event. This example does not calculate overlap or enforce precedence.
7. Provide exact values and a non-drag path. Status/table disclose start, end, planned hours and completion. Selection changes opacity/readout only. No drag, resize, date edit, critical path or automatic scheduling is implemented.

## Anatomy and actual API

`GanttUsageDemo.vue` has no props or emits. Refs are `dataset`, `state`, `selected`, `progress` and root element. A rows are Plan 6–10/50%, Build 9–14/0%, Review 13–18/100%, Release 18–18/N/A. B rows are Plan 8–12/25%, Build 12–16/75%, Review 16–22/50%, Release 22–22/N/A. Completion values are reported fixtures, not derived from clock time or measured effort.

The 330×255 SVG maps hour h to x=70+13×(h−6). Grid/ticks 6/10/14/18/22 share that transform. Row i has y=43+45i, track height 24, width 13×(end−start). Overlay shares x/y/height and has width trackWidth×completion/100;0% omits the overlay,100% covers the full planned width. Hiding completion removes only overlays. Milestone path centers at x(start), y=55+45i with 8-unit horizontal/vertical radius; its shape remains visible at 22h without clipping. Selection changes row opacity, not timing or width.

```vue
<script setup>
import GanttUsageDemo from './.vitepress/theme/GanttUsageDemo.vue'
</script>
<template><GanttUsageDemo /></template>
```

Possible host input, not implemented props:

```ts
type PlannedTask = { id: string; start: number; end: number; completion: number | null; kind: 'task' | 'milestone' }
```

Validate finite times, start≤end, explicit milestone vs task kind, domain bounds and completion 0–100 or a documented unknown value. Do not silently turn missing endpoints into zero hours. A date-based host needs timezone-aware instants/calendar rules, working-time vs clock-duration semantics and an overnight/DST policy. Multiple resources, dependencies, constraints, update permissions and server conflicts need their own adapter. This fixed controller has no arbitrary tasks, hierarchy, progress edit, dependency arrows, resource allocation, zoom/pan, today line, drag/resize, export, request or error state.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Shared ChartGallery Gantt studio timeline card with four coach shifts. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Theme wrappers around the same four-shift implementation, not separate scheduling APIs. |
| [Calendar](/calendar), [Bar chart](/bar-chart) | Date-oriented layout or quantity comparison, not task duration/progress APIs. |

ChartGallery declares only `language` String default lustro and renders the collection. No tasks, dates, duration, milestone, completion, selected-task prop or selection emit exists. Native `tasks` is fixed Coach A6–10, B9–14, C13–18, D17–22. Sample A/B does not change those shifts. Duration is represented by end−start, not by the shared `values` time-series arrays.

Native SVG x=75+14×(hour−6), y=33+33i, width 14×(end−start), height 23. Ticks 6/10/14/18/22 use the same mapping, ending at x 299 inside the 320-wide SVG. Labels are at x 4/y 49+33i. Selected row opacity is 1; others .5. Focus/mouseenter on each group and focus/click on four Coach label buttons update persistent start/end readout. No mouseleave reset, explicit selected pressed state, exact table, milestone, completion overlay, dependencies or drag handler exists. Global Ready/Loading/Empty is manual demo state; Show sample data restores ready. Shared Motion mounts cards, refreshes after sample/state and destroys on unmount.

This guide's task labels, changing A/B plans, milestone, reported completion overlay/toggle, exact duration/completion table, one pressed selection and reset are original additions. Native shifts should not be described as an installed Gantt package or a calendar scheduler.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B | Planned intervals/milestone/progress update, fixed time domain and row order. |
| Completion toggle | Hides/shows overlays only; exact values and plan stay intact. |
| Selected task | One pressed native button; row opacity/readout updates without editing. |
| Loading/empty/reset | Withhold/recover plan/table; reset A/Plan/completion on/ready. |

Shared Motion fades tracks/overlays/diamond using explicit fade markers rather than growing start times or inventing task progress. Reduced motion skips entry effects; refresh stops/restores controls and unmount destroys observers/listeners/controls. Exact table, labels, milestone shape, selected opacity/outline on native buttons and keyboard/touch controls supplement color. No hover is required. These checks do not certify screen-reader behavior.

Check A/B start/end/duration/completion, exact track/overlay x/y/width/height,0% omission,100% full width, diamond center/path at 18/22h and matching tick geometry. Check toggle without plan changes, selection/state retention/reset, keyboard/reduced motion/unmount, desktop/mobile chart/table/source-map pixels, filesystem routes, overflow and errors. A live adapter also needs invalid/reversed/unknown intervals, overnight/DST, long labels, many tasks, dependency cycles, working calendars, resource conflicts and stale/error handling.

<style>
@media(max-width:700px){.gantt-guide .vp-doc table:not(.gtusage-data),.gantt-guide .vp-doc table:not(.gtusage-data) tbody,.gantt-guide .vp-doc table:not(.gtusage-data) tr,.gantt-guide .vp-doc table:not(.gtusage-data) td{display:block;width:100%;box-sizing:border-box}.gantt-guide .vp-doc table:not(.gtusage-data) thead{display:none}.gantt-guide .vp-doc table:not(.gtusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.gantt-guide .vp-doc table:not(.gtusage-data) td{overflow-wrap:anywhere}.gantt-guide .vp-doc table:not(.gtusage-data) tr{margin-bottom:12px}}
</style>
