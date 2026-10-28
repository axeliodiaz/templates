---
pageClass: stepper-guide
---
<script setup>
import StepperUsageDemo from './.vitepress/theme/StepperUsageDemo.vue'
</script>

# Stepper

A stepper shows progress through a finite workflow. Use it when later stages depend on earlier input. It is not a tab bar: advancing may require validation, while going back should normally preserve work. See [Steps and keys](/steps-keys) for passive progress and keyboard-key specimens.

## Try validation, review and back

<StepperUsageDemo />

Details starts active. Continue refuses an empty or whitespace-only title and focuses the field. Enter in that field follows the same validation path. Review preserves the title; Complete example advances to a local Done panel. Back moves one stage without deleting the title. Restart clears it and returns to Details. No record, booking or request is created.

## How to use it

1. Define stable step IDs, labels and order. Display an ordered list and identify one current step with aria-current="step".
2. Keep workflow state separate from its progress decoration. A colored step is not proof a server accepted anything.
3. Validate the current stage before moving forward. Preserve input on Back; decide whether changes invalidate later stages.
4. Move focus to the new panel heading after an explicit transition. Keep errors next to their input and focus the field that needs attention.
5. Disable Back at the first step and Continue at the last. Do not make future steps clickable unless jumping is supported and validated.
6. For a real final action, wait for verified server success before calling it complete. Explain pending and failed states rather than faking progress.

## Anatomy and actual API

`StepperUsageDemo.vue` has no props or emits. `step` is a zero-based ref from 0 to 2, `title` is a string capped at 120 input characters and `error` starts empty. `forward()` trims the title for the required check, then calls `move(next)`. `move()` updates the index, clears errors and focuses the new heading after Vue nextTick. `restart()` clears title and moves to zero. Heading/input refs remain instance-local. No timers, network calls or document listeners need cleanup.

```vue
<script setup>
import StepperUsageDemo from './.vitepress/theme/StepperUsageDemo.vue'
</script>
<template><StepperUsageDemo /></template>
```

Suggested host model, not an exported package API:

```ts
type WorkflowStep = { id: string; label: string }
type WorkflowState = {
  currentStepId: string
  values: Record<string, unknown>
  errors: Record<string, string>
  submission: 'idle' | 'pending' | 'failed' | 'succeeded'
}
```

This example derives Passed from position only. That label does not record independent server completion. A production host must define invalidation, persistence, retry, duplicate-submit protection and resume behavior.

## States and variants

| State | Actual behavior |
|---|---|
| Details | Required native text input, Back disabled. |
| Invalid | Inline alert and aria-invalid, title input focused; no advance. |
| Review | Trimmed title summary; Back preserves original input. |
| Done | Local-only completion message; Continue disabled, Back still available. |
| Restart | Clears title and error, resets index and focuses heading. |
| Pending/failed server action | Not simulated; no network success claim. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#stepper), [Lustro guide](/lustro/guide-components#stepper) | Shared ComponentCatalog uses a one-based step ref and three list labels. Back/Continue decrement/increment with endpoint disabled states; current item gets aria-current and badge styling. No data entry, validation, stage panels or submission in that specimen. |
| [Felix molecules](/felix/components/molecules#stepper) | Fixed Monto/Destino/Listo buttons, second styled active and first done. Generic select-one enhancer changes the on class on click; done remains static. No workflow validation, stage panels or authoritative completion tracking. |

Felix prose describes a package activeIndex/Stepper.Step contract. That is not established by the HTML preview and generic enhancer. This guide adds a bounded teaching flow rather than silently changing the source catalog.

## Motion, accessibility and checks

New panels fade and move 4px over 180ms; current-step surface changes take 160ms. Reduced motion removes both. Focus changes happen immediately after the panel is rendered, not after animation. Step labels are not links or fake tabs. Buttons retain native keyboard behavior and disabled semantics. Each panel heading is programmatically focusable, and errors use an alert plus aria-invalid.

Test empty and whitespace titles, Enter and button validation, review/back data preservation, boundary buttons, restart, heading/error focus, long input, reduced motion and mobile wrapping. Real asynchronous workflows need separate loading, failure and cancellation tests; this demo does not cover them.

<style>
@media(max-width:700px){.stepper-guide .vp-doc table,.stepper-guide .vp-doc tbody,.stepper-guide .vp-doc tr,.stepper-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.stepper-guide .vp-doc thead{display:none}.stepper-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.stepper-guide .vp-doc td{overflow-wrap:anywhere}.stepper-guide .vp-doc tr{margin-bottom:12px}}
</style>
