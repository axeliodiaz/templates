---
pageClass: date-picker-guide
---
<script setup>
import DatePickerUsageDemo from './.vitepress/theme/DatePickerUsageDemo.vue'
</script>

# Date picker

A date picker chooses a calendar date. Use it for a due date or birthday; add a local time only when the task needs one. A date is not an instant. A local date/time does not name a timezone and does not confirm a booking.

## Try date, local time and validation

<DatePickerUsageDemo />

This self-contained demo uses native date and datetime-local inputs. Its fixed example window is October 2026, not current availability. Date starts at 2026-10-15 and is required; local date/time starts empty and is optional. Review selection runs only after native required/min/max validation passes. It prints the raw local values, without a request, persistence or timezone conversion. Clear empties both fields; Use example fills an explicit date and 14:30 local time.

## How to use it

1. Choose date-only or local date/time from the actual task. Do not add a time when only a date matters.
2. Give the control a visible label. Explain required/optional fields and the permitted window before entry.
3. Bind date strings as YYYY-MM-DD; use YYYY-MM-DDTHH:mm for minute-precision local time. The browser may display localized text while the value uses these formats.
4. Set min/max from your own verified rules. They are client-side constraints, not server enforcement or evidence of availability.
5. Keep edits separate from confirmation. This demo clears review feedback on input, so old success text does not describe a new value.
6. For an appointment, collect the venue timezone, check availability and confirm the result separately. Do not parse a date-only string into an instant just to format it.

## Anatomy and actual API

`DatePickerUsageDemo.vue` has no props or emits. `date`, `localTime` and `feedback` are instance-local refs. `save()` writes a review message only. `clear()` empties refs; `example()` restores fixed example strings. Form submission uses native validation before the submit handler. There are no watchers, timers, document listeners or network calls to clean up on unmount.

```vue
<script setup>
import DatePickerUsageDemo from './.vitepress/theme/DatePickerUsageDemo.vue'
</script>
<template><DatePickerUsageDemo /></template>
```

Suggested host data, not an exported component contract:

```ts
type DateChoice = {
  date: string // YYYY-MM-DD or empty
  localDateTime?: string // YYYY-MM-DDTHH:mm, not UTC
  timeZone?: string // IANA venue zone when resolving an instant
}
```

Keep date-only values as calendar dates. Resolve local time in the intended zone at the integration boundary, including ambiguous/nonexistent daylight-saving times. Native inputs do not settle that decision.

## States and variants

| State | Demo behavior |
|---|---|
| Initial | Required date filled, optional local date/time empty. |
| Empty | Clear removes values and review text; native required blocks review until a date exists. |
| Outside window | Browser min/max validation blocks form submission. No custom error text is claimed. |
| Edited | Values update; review feedback clears. |
| Reviewed | Polite local-only summary, no save or appointment promise. |
| Disabled/read-only/range | Not shown in this demo. Add and test only when the host needs them. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#date-picker), [Lustro guide](/lustro/guide-components#date-picker) | Shared ComponentCatalog native date input with fixed 2026-10-15 value and empty datetime-local input. No v-model, validation rules, submission or booking API in that specimen. |
| [Felix molecules](/felix/components/molecules#datepicker) | Button opens a custom month popup. Enhancer fixes September 2026, initially day 10; clicking a day updates the Spanish button label, selected styling and closes the popup. No month navigation, range, timezone, minimum/maximum or documented value emission in the enhancer. |

Felix's specimen does not implement a complete calendar keyboard grid, Escape/outside-dismiss or focus recovery. Its package-style prose does not prove installed exports. Prefer the native control unless you can implement and verify those interactions. This guide adds a separate native teaching demo, not a silent replacement of source specimens.

## Motion and accessibility

Review feedback fades and moves 3px over 160ms; buttons change background over 150ms and settle 1px on press. Reduced motion removes animation, transitions and press movement. The browser owns the native picker popup, its keyboard behavior and any system animation. The demo does not claim to control that popup.

Labels wrap native controls; Tab moves through fields and buttons. Form validation remains native, and review text is a polite status. Native picker layout and manual entry vary across browsers/devices. Verify the browsers you support, empty/required and out-of-range values, optional local time, repeated edits, clear, keyboard, reduced motion and narrow layouts. A DOM value test cannot verify every operating-system picker popup.

<style>
@media(max-width:700px){.date-picker-guide .vp-doc table,.date-picker-guide .vp-doc tbody,.date-picker-guide .vp-doc tr,.date-picker-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.date-picker-guide .vp-doc thead{display:none}.date-picker-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.date-picker-guide .vp-doc td{overflow-wrap:anywhere}.date-picker-guide .vp-doc tr{margin-bottom:12px}}
</style>
