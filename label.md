---
pageClass: label-guide
---
<script setup>
import LabelUsageDemo from './.vitepress/theme/LabelUsageDemo.vue'
</script>

# Label

A label gives a form control a visible, programmatic name. It tells someone what to enter or choose and, for an enabled native input, clicking the connected label focuses that input. A styled span may look like a label without naming anything. Use a real label/control association, not proximity or placeholder text alone.

## Try the association and states

<LabelUsageDemo />

Click Example name to focus its field. Toggle required or disabled, type fictitious text and validate locally. Empty required text produces an error; optional empty text passes. A disabled field is skipped. Reset clears text, validation and control choices. Nothing submits or persists. Whitespace-only required text is rejected by this demo's extra local rule, not by a label.

## How to use it

1. Give each control a unique id and connect label for to it. Vue templates use for; React uses htmlFor. A wrapping label can also associate a single labelable control.
2. Keep names visible and specific. Placeholders and decorative icons do not replace a persistent field name.
3. Put required and disabled on the control itself. A required marker or disabled-looking label alone does not enforce either state.
4. Link help and active errors through aria-describedby. Keep the name separate from long instructions; expose invalid state on the control when validation fails.
5. Use fieldset and legend for a group of related choices. A lone label must not pretend to name an entire radio group or arbitrary div.
6. Test the actual association with keyboard and pointer, including multiple copies. Reused ids silently send label clicks or descriptions to the wrong field.

## Anatomy and actual API

`LabelUsageDemo.vue` has no props or emits. `useId()` produces an instance-specific base for the input, help and error ids. Local refs are `value`, `required`, `disabled`, `attempted` and `result`. `error` derives from attempted validation, enabled state, required and trimmed empty text. `validate()` skips disabled fields or records a local failure/pass. Editing or changing state clears attempted validation; Reset restores empty/required/enabled/unattempted and the initial status.

The form uses novalidate because it demonstrates its own inline validation, and submit.prevent prevents navigation/submission. The input still has native required/disabled attributes. Its max length is 80; active errors add aria-invalid and their id to aria-describedby. A separate status reports the last validation outcome; the inline error itself is not another live region. There are no timers, requests or subscriptions to clean up.

```vue
<script setup>
import LabelUsageDemo from './.vitepress/theme/LabelUsageDemo.vue'
</script>
<template><LabelUsageDemo /></template>
```

Suggested integration data, not a package prop contract:

```ts
type FieldDescription = {
  controlId: string
  label: string
  required: boolean
  disabled: boolean
  helpId?: string
  errorId?: string
}
```

The host owns validation, values, errors and submission. A Label component must forward its association attribute to an actual label element and match the actual control id. Do not treat styling classes or a package name as proof of that connection.

## States and variants

| State/variant | Behavior |
|---|---|
| Required | Visible required text and native required on input; local validation rejects trimmed empty text. |
| Optional | Visible optional text, no required constraint; empty value can pass. |
| Disabled | Input disabled, label still readable; validation skips it. |
| Error | Label retained, error linked through description, input marked invalid. |
| Editing | Attempted validation clears; persistent status still names the last validation outcome. |
| Reset | Empty text, required/enabled, no active error, initial status. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Label](/felix/components/atoms#label) | Four static fx-label spans with required/default/optional/disabled classes. These specimens contain no label element, for/id association or control. Their appearance alone does not provide an accessible name or native required/disabled behavior. |
| [Felix Input](/felix/components/atoms#input) | Separate input specimens wrap a span and input inside a native label. That wrapping association differs from the standalone styled spans. |
| [Felix Checkbox](/felix/components/atoms#checkbox) | A separate native wrapping-label example. A generic label prop claim does not turn every styled span into that markup. |

Felix prose says to pair Label with Input, Checkbox, RadioGroup and Switch via id/htmlFor and import from @felix/ui. Those are design-source usage claims, not verified installed exports here. This guide's Vue for/id implementation is an isolated teaching example, not a package adapter or a silent repair of the source gallery.

## Motion, accessibility and checks

The input border/background transition over 150ms when error styling changes. Reduced motion removes that transition. Error meaning remains in text and aria-invalid, never in animation or color alone. The label does not move or disappear while typing. Disabled controls are not normal tab stops; the controlling checkbox and reset remain reachable.

Test label click focus, exact for/id match, help/error ids, required/optional and disabled behavior, empty/whitespace/valid text, validation by button and Enter, editing after error, reset, unique ids across instances, reduced motion and mobile wrapping. Screen-reader testing should confirm the computed name, description and invalid state on the input; visual similarity is not enough.

<style>
@media(max-width:700px){.label-guide .vp-doc table,.label-guide .vp-doc tbody,.label-guide .vp-doc tr,.label-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.label-guide .vp-doc thead{display:none}.label-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.label-guide .vp-doc td{overflow-wrap:anywhere}.label-guide .vp-doc tr{margin-bottom:12px}}
</style>
