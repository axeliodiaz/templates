---
pageClass: care-timeline-guide
---
<script setup>
import CareTimelineUsageDemo from './.vitepress/theme/CareTimelineUsageDemo.vue'
</script>

# Care timeline

A care timeline lists scheduled and recorded care events with dates and clear status words. Use it to review what is recorded, what is due and what is upcoming. It is not a diagnosis, care recommendation, booking or proof that treatment happened. A visual status should come from the right pet's verified record and a defined date boundary, not a CSS color left unchanged over time.

## Try local status, filtering and undo

<CareTimelineUsageDemo />

This original controller uses a fixed as-of date of 2026-10-16 so the example does not silently age. Choose All, Open or Overdue only. Mark a sample record done or undo its completion. The action changes only the local fixture, never a veterinarian's record, reminder or appointment. A completed record can disappear from Open/Overdue immediately; switch to All to undo it. Reset restores the five records and original two completions.

## How to use it

1. Scope the timeline to a verified pet identity. Do not mix similarly named pets, owners or clinical histories.
2. Store dates as date-only values when the event has no time. Define the host's timezone and as-of date for due/overdue calculation; do not parse midnight UTC and display it in a different timezone accidentally.
3. Separate scheduled due date from recorded completion date. A completed record may have been done before or after its planned date.
4. Show words for Done, Overdue, Due today and Upcoming. Color and a vertical dot are supporting cues only.
5. Make mutations explicit, reversible and permission-aware. Real clinical completion needs the right actor, evidence and audit trail; this guide's action is labeled local because it supplies none of those.
6. Provide filter recovery and keep full context available. A disappearing item is not deleted just because it no longer matches Open.
7. Keep booking, notifications and clinical guidance separate. Marking done here does not book a visit, send a reminder or determine whether a treatment is appropriate.

## Anatomy and actual API

`CareTimelineUsageDemo.vue` has no props or emits. It holds `items`, `filter`, a status `message` and a fixed `asOf`. Items have id/title/due/completed. Completion is either a date-only string or empty. `status(item)` prioritizes completion, then compares zero-padded ISO due dates lexically against asOf: earlier is Overdue, equal is Due today, later is Upcoming. This works for these valid fixed ISO date fixtures; it is not a general input-date validator.

`visible` filters then sorts a copy by planned due date ascending. The timeline is due-date order, not completion chronology. Completed September 3 therefore appears before overdue September 19 even though the raw fixture is unsorted. Completed count always covers all records, not just the filtered view. Mark done sets the completion date to the fixed asOf; undo removes it and recalculates status from the original due date. Undo on an originally done fixture removes its old completion too; Reset restores that original date.

```ts
type CareEntry = {
  id: string
  title: string
  due: string        // valid YYYY-MM-DD date-only fixture
  completed: string  // date-only value, or empty for open
}
// Local fixture shape, not an installed component API or clinical record schema.
```

```vue
<script setup>
import CareTimelineUsageDemo from './.vitepress/theme/CareTimelineUsageDemo.vue'
</script>
<template><CareTimelineUsageDemo /></template>
```

No requests, persistence, timers, subscriptions or document listeners are created. Vue owns the event handlers; there is nothing external to cancel on unmount. Production needs server-validated identity, authorization, dates, audit metadata, optimistic-update rollback and clinical source references. Do not treat the fictitious task titles or dates as a recommended care schedule.

## States and layout

| State/part | Behavior |
|---|---|
| Header | Explicit sample identity and fixed as-of date, never a live care claim. |
| Entry | Title, status word, due date and optional marked-done date. Dates have datetime attributes. |
| Done | Any completion date takes precedence over overdue calculation. |
| Open | Completed records hidden; overdue, due-today and upcoming remain. |
| Overdue only | Uncompleted dates before asOf; completion can empty the view. |
| Empty filter | Recovery text points to All; records are not removed from storage. |
| Undo/reset | Local reversibility; reset restores original completions and filter. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Pawprint Care timeline](/pawprint/components#care-timeline) | Static ul/ li with title and small date text; due/late classes color pseudo-element dots. No timeline props, computed status, date sorting or completion handler. |
| [Pawprint dashboard](/pawprint/dashboard) | Related Upcoming care list plus hard-coded 62% care-plan bar. The percent is not computed from this list or from this guide's five records. |
| [Progress guide](/progress) | Separate completion/meter semantics. A timeline list should not be recast as progress just because a dashboard places a bar next to it. |

The source's Done/Due/Overdue wording and dates are static specimens. They do not track today's date, fetch care history or establish a treatment's validity. The source uses a general pet-care design language, not an installed clinical API. This guide adds an original isolated controller and does not change those specimens or their dashboard bar.

## Motion, accessibility and checks

Entries fade/move 4px over 180ms when mounted, including after a filter remount. Reduced motion removes that animation. Status changes update text immediately; there is no fake saving or delayed clinical confirmation. An ordered list preserves chronology, decorative dots are hidden from assistive technology, dates are explicit, native select/buttons retain keyboard behavior and a concise live status reports local actions. No screen-reader certification is claimed.

Test initial due-date sorting and 2/5 count, all four status words, mark/undo on original and new completions, count across filters, overdue-filter empty/recovery, open-filter removal, reset, unique button names, native keyboard activation, reduced motion and narrow overflow. A real host also needs pet/account authorization, date validation and timezone/day-boundary tests, server failures and audit/clinical-record verification.

<style>
@media(max-width:700px){.care-timeline-guide .vp-doc table,.care-timeline-guide .vp-doc tbody,.care-timeline-guide .vp-doc tr,.care-timeline-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.care-timeline-guide .vp-doc thead{display:none}.care-timeline-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.care-timeline-guide .vp-doc td{overflow-wrap:anywhere}.care-timeline-guide .vp-doc tr{margin-bottom:12px}}
</style>
