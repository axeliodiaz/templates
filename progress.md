---
pageClass: progress-guide
---
<script setup>
import ProgressUsageDemo from './.vitepress/theme/ProgressUsageDemo.vue'
</script>

# Progress

Progress shows how much work is complete. Use a determinate value only when a real total is known. Use an indeterminate indicator when work is happening but cannot be measured. A meter instead shows a value within a range, such as storage or CPU usage, not completion of a task. A goal ring is another visual encoding of a known percentage, not proof that a process is running.

## Try known, unknown and paused work

Change the local sample percent or advance by 20. At 100 the text says complete and Advance disables. Indeterminate removes the progress value and disables numeric controls; it does not invent a percentage. Error preserves the last value and says paused. Reset restores 40%. The meter stays at a separate sample storage value. The ring mirrors the numeric value only. All data is fictitious; no upload, server process or storage change happens.

<ProgressUsageDemo />

## How to use it

1. **Choose task progress or measurement.** Use progress for completion; use meter for bounded capacity/quality measurements. A CSS class named meter is not native meter semantics.
2. **Keep data truthful.** Compute completed / total only from real work. Clamp invalid values, handle zero totals, and never animate a fake percentage while waiting.
3. **Name the task.** Use a visible label. Native progress supplies its numeric semantics; a custom progressbar needs accessible name, min, max and current value when known.
4. **Omit the value when unknown.** For native progress remove value. For a custom indeterminate progressbar omit aria-valuenow and explain that work is ongoing.
5. **Separate error and completion.** Preserve useful progress on failure, offer recovery and do not imply that 100% upload means server-side validation succeeded.
6. **Keep text with color and shape.** Show percentages or quantities and state text. Avoid frequent live announcements for every fraction of a percent.

## Anatomy and actual API

`ProgressUsageDemo.vue` exposes no props or emits. `value` starts at 40; `state` is determinate, indeterminate or error. `bounded` converts/clamps numeric input to 0..100. `text` derives known, unknown, paused or complete wording. The range and Advance are local controls; no timer simulates progress. Reset restores the defaults.

The native progress has max=100 and omits value only in indeterminate mode. The error example is a paused determinate value, not a native error attribute. The native meter has min=0, max=100, low=25, high=80, optimum=20 and value=65. Its optimal direction is low usage. The decorative SVG ring uses pathLength=100 and stroke-dasharray from the same bounded value; adjacent text carries its meaning. Unmount has no timer/listener cleanup because none are installed.

```vue
<script setup>
import ProgressUsageDemo from './.vitepress/theme/ProgressUsageDemo.vue'
</script>
<template><ProgressUsageDemo /></template>
```

A host model might be `{ completed: number, total: number | null, state: 'running' | 'paused' | 'failed' | 'complete' }`. This is suggested integration data, not a universal installed component interface. Keep transport bytes, processed records and final server confirmation as separate facts when they differ.

## States and variants

| State or variant | Rule |
|---|---|
| 0 / partial / 100 | Valid known completion; the guide shows value and text together. |
| Indeterminate | No current numeric value; never use a made-up percent. |
| Error / paused | Keep the last known amount and state the failure separately. |
| Meter | Bounded measurement, not work completion; thresholds need domain meaning. |
| Goal ring | Known percentage with readable text; SVG is decorative here. |
| Striped, colored, thin, stacked | Visual variants in some catalogs, not new data semantics. Stacked parts need labels and a valid total. |

## Source coverage

| Source | Real implementation |
|---|---|
| [Lustro UI kit](/ui-kit#progress), [Components](/components#progress), [Lustro guide](/lustro/guide-components#progress) | Native labelled progress at a fixed sample 68/100. Copyable markup is local implementation, not an installed package. |
| [Lustro expanded](/lustro/components-more#progress), [Felix expanded](/felix/components-more#progress), [Scopecraft expanded](/scopecraft/components-more#progress) | Styled .pr/.i specimens with widths, colors, striped/thin/tall/stacked variants. Do not assume native progress or ARIA values from visual width. |
| [Lumen expanded](/lumen/components-more#progress) | Gallery iframe provides the actual rendered specimens; inspect that source rather than inferring behavior from the Markdown anchor. |
| [Felix atoms](/felix/components/atoms#progress) | .fx-progress div/span specimens at 25/60/100%. Prose names @felix/ui value usage, but the actual DOM is CSS width, not verified package exports or native progress semantics. |
| Studio catalogs | Catalog native progress is bound to local range/max100 with a numeric accessible label. Extended has native progress at 45% plus a visual stacked bar. |
| [Bastion meters](/bastion/components#meters) | CPU specimens use role=progressbar and explicit 0..100 ARIA values 18/62 plus text. They are not native meter elements despite the section name; capacity semantics should be reviewed when integrating. |
| [Pulsefit HTML](/pulsefit-template/components.html#progress) | Three styled bars at 25/50/75. First declares progressbar min/max/current but lacks a task name; later variants do not carry the same semantic attributes. Do not treat every colored bar as equally accessible. |

### Concentric progress rings

[Graphs: concentric rings](/graphs#mono-rings), [Felix charts](/felix/components/charts#mono-rings), [Lumen charts](/lumen/charts#mono-rings), [Scopecraft charts](/scopecraft/charts#mono-rings), [Pawprint charts](/pawprint/charts#mono-rings) and [Pulsefit charts](/pulsefit/charts#mono-rings) use the shared ChartGallery rings branch. It draws three goal rings from the first three local values. Radii are 76, 59 and 42, stroke width 10, round caps and a -90 degree rotation. Filled arc length is 2πr × value/100; opacity separates rings without changing their values.

Each SVG group is focusable and named Ring N: value%. Hover/focus selects a local item for the gallery detail. These are sample goal percentages, not independent background jobs or live telemetry. Keep named numeric text or an equivalent list for every goal when adapting; concentric color alone is insufficient. The separate ring above is one simple guide encoding, not a replacement of ChartGallery's API or interactions.

## Motion and accessibility

The guide ring transitions stroke length over 180ms; reduced motion removes it. Native progress rendering, including indeterminate visuals, is browser-controlled and may differ across platforms; test the target browser rather than promising a universal still native indicator. State text stays available without motion. A progress display is not an input and does not need a Tab stop; only the sample controls do.

Test 0/100, unknown value omission, failed-state preservation, reset, disabled controls, visible labels, range keyboard behavior and reduced motion. Check ring text and mobile layout. For real work, throttle live announcements and announce meaningful milestones/errors instead of repeatedly interrupting the user. Do not use aria-busy to hide an entire application's useful controls indefinitely.

## Integration notes

Validate totals and units, avoid stale updates after cancellation and keep operation identity with progress. Completion is confirmed by the operation's actual result, not animation end. Preserve meaningful partial state on retry. Every percentage and capacity value on this page is fictitious and local.

<style>
@media(max-width:700px){.progress-guide .vp-doc table,.progress-guide .vp-doc tbody,.progress-guide .vp-doc tr,.progress-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.progress-guide .vp-doc thead{display:none}.progress-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.progress-guide .vp-doc td{overflow-wrap:anywhere}.progress-guide .vp-doc tr{margin-bottom:12px}}
</style>
