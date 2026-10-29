---
pageClass: calendar-picker-guide
---
<script setup>
import CalendarUsageDemo from './.vitepress/theme/CalendarUsageDemo.vue'
</script>

# Calendar date selection

An inline calendar chooses a date directly on a page. It is different from the [calendar planning template](/calendar), which arranges events, and from a [date field](/date-picker), which may use a browser picker. Selecting a date does not book, pay, schedule or establish availability.

## Try a local single-date calendar

<CalendarUsageDemo />

Browse the twelve months of the fixed fictitious year 2026. Select a day by pointer, Enter or Space; the status gives an ISO date without time or timezone conversion. Selection stays intact when browsing another month. Clear removes selection only; Reset returns to September with focus-day 10 and no selection. There is deliberately no Today shortcut, current-date assertion or availability claim.

## How to use it

1. Define the date domain and bounds. This example is limited to 2026; it does not pretend disabled dates mean vendor availability.
2. Store a date-only value as a date, not an accidental midnight timestamp that shifts under timezone conversion. Resolve the event's timezone separately if time matters.
3. Name every day with its full date, not a bare number. Distinguish the selected date from the current keyboard focus.
4. Support keyboard navigation with visible focus. Do not add grid semantics unless implementing the corresponding grid contract.
5. Keep selection separate from committing an action. A real reservation or transfer needs its own confirmation, authority, current terms and service result.
6. Keep prior selection visible in status while browsing. Clearing and resetting should have distinct, documented effects.

## Anatomy and actual API

`CalendarUsageDemo.vue` has no props or emits. Fixed year is 2026; local refs are `month` (0..11, initially 8), `focusDay` (initially 10) and `selected` (empty or YYYY-MM-DD). Days and Monday-first offset use UTC date arithmetic; Intl labels explicitly use UTC so date-only calculations do not shift with runtime timezone. `useId()` scopes month/day ids per instance.

`move(delta, focus)` rejects out-of-year navigation and clamps the focus day to the destination month's length. Arrow keys move one/seven days within the visible month, clamped at boundaries; Home/End move to the current Monday/Sunday edge, also clamped. Page Up/Down changes month while retaining/clamping day and then focuses it after nextTick. Month toolbar clicks leave focus on the toolbar. Enter/Space use native button activation.

Day buttons form a labelled group, not an ARIA grid. One day is a tab stop, all expose full-date names and aria-pressed for selection. Clear leaves month/focus unchanged; Reset restores September/10/empty. There is no network, timer, document listener or subscription to clean up. Focus lookup is scoped through unique ids, not a global generic calendar selector.

```vue
<script setup>
import CalendarUsageDemo from './.vitepress/theme/CalendarUsageDemo.vue'
</script>
<template><CalendarUsageDemo /></template>
```

Suggested host data, not a package contract:

```ts
type DateSelection = {
  selectedDate: string | null // YYYY-MM-DD, date only
  visibleMonth: string // YYYY-MM
  minDate?: string
  maxDate?: string
  disabledDates?: string[]
}
```

A production calendar must separately define locale/week start, year bounds, unavailable dates, validation and timezone for any later time-based action. Do not treat a local highlight as a confirmed appointment or a service response.

## States and controls

| State/control | Behavior |
|---|---|
| Initial | September 2026, day10 keyboard entry point, no selected date. |
| Selected | One date has aria-pressed=true; ISO date remains in status. |
| Browsing | Visible month changes without overwriting selection. |
| Year bounds | Previous disabled in January, Next disabled in December. |
| Keyboard | Arrows/Home/End clamp within month; Page Up/Down changes month. |
| Clear/reset | Clear selection only, or restore initial month/focus/empty. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Calendar](/felix/components/molecules#calendar) | Initially empty fx-cal markup populated by felix-demos.ts. padCalendar renders Monday-first September2026 with day10 on; click handler only changes the on class. No month navigation, full-date names, roving focus, stored selected-date output or booking action is supplied. |
| [Felix DatePicker](/felix/components/molecules#datepicker) | Separate popup around a fixed month. Its field behavior is distinct from the standalone calendar. |
| [Calendar planning template](/calendar) | Event arrangement is a different outcome from choosing one date. |

Felix prose names @felix/ui, mode=single, selected and onSelect. Those are design-source usage claims, not verified installed exports. This original Vue teaching controller is not a package adapter and does not silently upgrade the source's class-only selection handler.

## Motion, accessibility and checks

The visible month fades in over 150ms on initial display and month changes. Day selection does not replay the month animation. Reduced motion removes it. Focus and selection do not depend on animation completion. Status announces the chosen date, not every animation frame; month navigation has a visible title and each day names its full date.

Test actual day counts and Monday offsets, short-month clamping, month/year boundaries, selection persistence, full-date names, single tab stop, pointer/Enter/Space, arrows/Home/End/Page Up/Down, clear/reset, multiple-instance ids, reduced motion and mobile wrapping. Check locale and timezone rules separately in a real host. This example has no range selection, time selection, event editor or availability integration.

<style>
@media(max-width:700px){.calendar-picker-guide .vp-doc table,.calendar-picker-guide .vp-doc tbody,.calendar-picker-guide .vp-doc tr,.calendar-picker-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.calendar-picker-guide .vp-doc thead{display:none}.calendar-picker-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.calendar-picker-guide .vp-doc td{overflow-wrap:anywhere}.calendar-picker-guide .vp-doc tr{margin-bottom:12px}}
</style>
