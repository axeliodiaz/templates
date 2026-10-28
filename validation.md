---
pageClass: validation-guide
---
<script setup>
import ValidationUsageDemo from './.vitepress/theme/ValidationUsageDemo.vue'
</script>

# Validation and field states

Validation tells people what needs correction and preserves their work. Use visible helper text before entry, specific feedback after a field is visited or a form is submitted, and a confirmed result only after the relevant checks finish. A green border is not proof that an email exists or that a server accepted a record.

## Try local validation

Submit empty, type an invalid sample, then use sample@example.test. Leaving the field marks it visited. Submit focuses the invalid field; correct input shows a sample format message. Reset returns the neutral state. All data is fictitious and local. Nothing is sent or saved.

<ValidationUsageDemo />

## How to use it

1. **State the rule first.** Keep the label and helper visible. Required, length and format rules should not be a surprise.
2. **Choose when to show errors.** Do not label an untouched empty form as failed. After blur or submit, show the current correction next to the field.
3. **Associate the feedback.** Use unique IDs and `aria-describedby` for both help and feedback. Set `aria-invalid="true"` for a known invalid state.
4. **Use clear language.** Say what to change. Do not rely on color, a cross icon or a generic "Invalid" badge alone.
5. **Keep values and restore a path forward.** On failed submit, focus the first invalid field or a linked error summary for long forms. Do not erase user work.
6. **Separate local format from server outcome.** The server owns authorization, business rules and final acceptance. A matching pattern proves only that pattern matched.

## Anatomy

| Part | Purpose |
|---|---|
| Label and required hint | Persistent field name and expectation. |
| Native control | Editable value, focus and keyboard behavior. |
| Helper text | Format guidance available before an error. |
| Feedback text | Specific error or qualified valid-state message. |
| Submit result | Operation-level feedback, distinct from each field's correction. |
| Error summary | For longer forms, links to invalid fields after submit. Not needed for this single-field example. |

## Data shape

`ValidationUsageDemo.vue` has no props or emitted events. Its actual refs/computed values are:

```ts
// email: string = ''
// touched: boolean = false
// submitted: boolean = false
// result: string = 'Fictitious local validation. Nothing is sent.'
// field: HTMLInputElement | null
// error: computed string, empty when the sample pattern matches
// show: computed boolean, touched || submitted
```

The sample rejects an empty trimmed value, then tests `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` against the untrimmed value. This intentionally simple rule is not a complete email-address parser or ownership check. Surrounding whitespace is rejected by the format check. The form uses `novalidate` so this one custom feedback path, rather than native validation popups, runs on submit. The native email type still supplies semantics and the input remains required.

`submit()` marks submitted, updates local result, waits for Vue's render and focuses the invalid field. `reset()` clears refs. No timers, network requests, asynchronous validation or server state exist here.

An application can model more than one field explicitly:

```ts
type FieldState = { value: string; touched: boolean; error: string | null }
type Submission = 'idle' | 'pending' | 'success' | 'error'
```

This is an integration model, not a universal validation API across the catalogs.

## Usage

### Link hints and a real error

```html
<label for="sample-email">Email (required)</label>
<input id="sample-email" type="email" required
  aria-invalid="true" aria-describedby="sample-help sample-error">
<p id="sample-help">Use the address you want associated with this record.</p>
<p id="sample-error">Enter an email address in the expected format.</p>
```

Render the error and invalid state only when a check has failed. Remove the invalid state when the value is no longer invalid. With multiple instances, scope all IDs. A class named invalid has no accessibility effect by itself.

### Custom submit lifecycle

```ts
async function submit() {
  submitted.value = true
  if (error.value) {
    await nextTick()
    field.value?.focus()
    return
  }
  // Run the real authorized save here, with pending/error recovery.
  // Announce success only after the server confirms it.
}
```

Import the Vue functions and refs from your application. For many fields, validate all relevant values and provide a linked summary rather than repeatedly moving focus while typing. If using native constraint validation instead, avoid duplicate custom/native announcements and test the chosen flow.

## States and variants

- **Neutral:** label and helper present; no premature error on untouched fields.
- **Touched:** the user left the field; show a correction if invalid. Do not seize focus on blur.
- **Invalid:** visible error text plus `aria-invalid`, with `aria-describedby` pointing at the rendered feedback.
- **Valid:** a qualified local format message, not a claim of identity or successful saving. Do not announce every keystroke as a new alert.
- **Submitted with errors:** preserve input; focus the first error or summary. A summary should link to each control.
- **Pending:** for real async checks, guard against stale responses, duplicate submits and race conditions. This demo has no pending work.
- **Server error:** distinguish field errors from connection/permission errors. Keep data, allow retry and never display success from a click alone.
- **Disabled / read-only:** neither means valid. Explain unavailability; do not use a disabled field to hide a required correction.

## Template map

| Surface | What it actually shows |
|---|---|
| Lustro expanded | [Validation](/lustro/components-more#forms-validation): `.inp.ok` / `.inp.bad` visual specimens and hint colors. Fixed sample values do not run validation. |
| Felix expanded | [Validation](/felix/components-more#forms-validation): corresponding valid/invalid specimen styles. Wire label IDs and real feedback when integrating. |
| Lumen expanded | [Validation](/lumen/components-more#forms-validation) links to the bundled gallery. Inspect the actual controls there. |
| Scopecraft expanded | [Validation](/scopecraft/components-more#forms-validation): separate template-scoped visual specimens. |
| Lustro base | [UI kit](/ui-kit#forms), [components](/components#forms), [guide](/lustro/guide-components#forms): related general form context, not a shared validation engine. |
| Relay / Folio / Pace / Spark | [Relay](/relay/components), [Folio](/folio/components), [Pace](/pace/components), [Spark](/spark/components) use StudioCatalog. The atom preview marks any nonempty email as a sample error; it does not parse valid addresses. The form layout uses native required constraints. Keep those distinct from this guide's pattern check. |

Legacy specimens are visual references, not production-ready validation contracts. This guide documents their limits without silently rewriting their behavior.

## Motion and accessibility

The border changes over 120ms; reduced motion removes that transition. Text explains every valid/invalid state. The local result uses a polite status region, while field feedback is associated with the input. This avoids turning every typed character into an assertive alert.

Tab follows native controls. Enter submits. Invalid submit focuses the field only after feedback is rendered. Do not move focus as someone types, erase their value or make color the only signal. Test keyboard, zoom, screen-reader descriptions and a narrow viewport with long translated errors.

## Integration notes

Import `ValidationUsageDemo.vue` for this exact local example. Keep validation logic separate from presentation, use safe text rendering and validate on the server as well. Async checks must ignore stale responses and handle timeout/cancellation. Do not log private input or paste it into demo fields. All addresses and results here are fictitious; no mailbox is contacted or verified.

<style>
.validation-guide .vp-doc table { width:100%; table-layout:fixed }
.validation-guide .vp-doc td, .validation-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .validation-guide .vp-doc table, .validation-guide .vp-doc tbody, .validation-guide .vp-doc tr, .validation-guide .vp-doc td { display:block; width:100% }
  .validation-guide .vp-doc thead { display:none }
  .validation-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .validation-guide .vp-doc td { border:0 }
  .validation-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .validation-guide .vp-doc td + td { padding-top:4px }
}
</style>
