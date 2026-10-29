---
pageClass: form-guide
---
<script setup>
import FormUsageDemo from './.vitepress/theme/FormUsageDemo.vue'
</script>

# Forms

Forms collect related values for one clear outcome. Inputs, textarea and file pickers need labels, sensible defaults and a predictable submission path. A visual field is not a complete form: the application still owns validation, authorization, saving, errors and recovery.

## Try a local form

Edit the fictitious workspace name and notes. Submit local sample uses native required/length validation, then changes only the result text. An empty name is blocked by the browser. Selecting a sample file displays its name only: contents are neither read nor uploaded. Use a harmless test file, not private data. Reset sample restores the defaults and clears the file selection.

<FormUsageDemo />

## How to use it

1. **Start with the outcome.** Collect only values necessary for it. Split unrelated settings into separate forms rather than using one giant Save button.
2. **Label every field.** Associate a persistent label with the control's ID. Placeholder text can suggest a format, but it is not the label.
3. **Explain constraints before submission.** Mark required versus optional, units, format and length. Link helper text with `aria-describedby`.
4. **Choose the native control.** Text input for a short value, textarea for longer text, file input for an explicit file choice. Use appropriate input types and autocomplete when the real data warrants them.
5. **Submit through the form.** A submit button and form submit handler support Enter and keyboard use. Prevent duplicate requests and expose pending state for real async operations.
6. **Preserve work on failure.** Keep entered values, explain how to recover and associate field errors. The separate validation guide/task covers richer validation patterns; do not invent server success from a local click.

## Anatomy

| Part | Purpose |
|---|---|
| Form / fieldset | Groups one operation or related choices; a legend names a fieldset. |
| Label | Provides the persistent visible and accessible field name. |
| Input / textarea / file picker | Owns native editing, selection and keyboard behavior. |
| Helper text | Explains format, units, privacy or length constraints. |
| Error text | Identifies the problem and correction near the field when validation fails. |
| Action row | Gives a clear submit action and a separate safe reset/cancel action when needed. |
| Result region | Reports outcome without replacing field-level errors or stealing focus for routine updates. |

## Data shape

`FormUsageDemo.vue` has no props or emitted events. Actual local state:

```ts
// form: HTMLFormElement | null
// name: string = 'Sample workspace'
// notes: string = ''
// filename: string = 'No file selected.'
// message: string = 'Fictitious local form. Nothing is sent or stored.'
```

The native name input is required with maxlength 80; notes has maxlength 240. A file change reads `input.files?.[0]?.name`, not the file bytes. `submit()` sets local text; `reset()` resets refs and the native form, including the file picker. Read-only SAMPLE-024 is presentation only. There is no network, upload, storage, async save, schema validator or server-side check in this demo.

A real application may separate fields from submission state:

```ts
type FormValues = { workspace: string; notes: string }
type SubmitState = 'idle' | 'pending' | 'success' | 'error'
type FieldErrors = Partial<Record<keyof FormValues, string>>
// File selection belongs to the native input / an explicit File value,
// not to a trusted server path inferred from its filename.
```

These are integration models, not universal Forms props across the template catalogs.

## Usage

### Native field with helper text

```html
<form>
  <label for="workspace-name">Workspace name (required)</label>
  <input id="workspace-name" name="workspace" required maxlength="80"
    aria-describedby="workspace-help">
  <p id="workspace-help">Use the name shown to workspace members.</p>
  <button type="submit">Save workspace</button>
</form>
```

Attach the consuming application's submit handler or a real form action; this markup alone does not save anything. Use unique IDs when rendering multiple forms. Do not reuse the guide demo IDs twice on one page.

### Vue local state

```vue
<script setup>
import { ref } from 'vue'
const name = ref('Sample workspace')
const result = ref('')
function submit() { result.value = `Local sample: ${name.value}` }
</script>
<template>
  <form @submit.prevent="submit">
    <label for="sample-name">Name</label>
    <input id="sample-name" v-model="name" required>
    <button type="submit">Submit local sample</button>
  </form>
  <p role="status">{{ result }}</p>
</template>
```

For a real save, validate on the server, handle authorization and errors, and report success only after confirmation. Native required validation does not reject whitespace-only text or enforce business rules. The guide intentionally does not claim otherwise.

## States and listed variants

- **Text input:** choose a meaningful type, name and autocomplete policy. Do not use number fields for identifiers that can start with zero.
- **Sizes:** small/default/large are visual density choices; keep readable text and useful touch targets. The guide uses at least 44px control height.
- **Textarea:** allow multiple lines and adequate vertical space. A character counter should match the same limit the field actually enforces.
- **File:** a filename is not a verified type, path or safe file. `accept` can guide selection but is not validation. Production upload needs type/size/security checks, progress, cancellation and retry policy. This demo does not upload.
- **Floating label:** keep a real associated label and verify its filled, empty, autofill, focus and error states. It must not overlap a typed value or depend on placeholder text as its only name. Existing expanded specimens show this layout; the guide uses conventional labels.
- **Layout:** align related fields on wide screens, stack them on narrow screens, and keep DOM order logical. Avoid fixed widths that clip long labels or file controls.
- **Read-only:** value is focusable/selectable but not editable. It differs from disabled, which normally leaves sequential focus and is not submitted.
- **Disabled:** explain prerequisites where useful; styling a span with a disabled attribute does not create a disabled form control.
- **Pending/success/error:** preserve field values and a visible recovery path. A pending submit must not create duplicate records. Never disable an entire form forever after a failed request.

## Template map

| Template / surface | Source and implementation |
|---|---|
| Lustro | [UI kit](/ui-kit#forms), [components](/components#forms), [guide](/lustro/guide-components#forms): labels, native inputs/select/textarea and choices, with scoped `l-form` and helper classes. |
| Lustro expanded | [Text inputs](/lustro/components-more#forms-text-inputs), [sizes/textarea/file](/lustro/components-more#forms-sizes-textarea-and-file), [floating/layout](/lustro/components-more#forms-floating-labels-and-layout). Legacy visual specimens are not a complete submission workflow. |
| Felix | [Expanded forms](/felix/components-more#forms-text-inputs) and the corresponding sizes, textarea/file and floating/layout sections, under separately scoped styles. |
| Lumen | [Expanded forms](/lumen/components-more#forms-text-inputs) link to the bundled Bootstrap gallery. Keep its actual native controls and scoped styles. |
| Scopecraft | [Expanded forms](/scopecraft/components-more#forms-text-inputs), including sizes, textarea/file and floating/layout specimens. |
| Pawprint | [Forms](/pawprint/components#forms): `pp-field` labels with native inputs, select and date fields inside a card. |
| Relay | [Catalog](/relay/components): Studio input/label/helper and textarea/select examples use native controls with Bootstrap `form-control` and local refs. |
| Folio | [Catalog](/folio/components): the same Studio field structure under Folio tokens. |
| Pace | [Catalog](/pace/components): Studio fields and form layout examples under Pace tokens. |
| Spark | [Catalog](/spark/components): Studio fields and form layout examples under Spark tokens. |
| Bastion | [Forms](/bastion/components#forms): Bootstrap alpha native fields and Bastion-scoped styles. |
| PulseFit | [Standalone forms](/pulsefit-template/components.html#forms): bundled native field specimens and layouts. |

Input group, validation, select, checks/radios/switches and date picker have their own documentation tasks. This page covers the general form container and text/textarea/file/layout family without marking those separate tasks complete.

## Motion and accessibility

The guide uses a 120ms border-color transition on editable controls; reduced motion removes it. Labels and helper text stay visible, and no motion communicates validity by itself.

Tab follows the native field/action order. Textarea Enter inserts a newline; form submission and multiline editing must not conflict. Associate errors and hints with the correct control, keep focus visible and distinguish required/optional in text. Do not rely on placeholder, color or an icon alone. Native validation is browser-provided and localized; test the consuming app's custom errors and screen-reader flow separately.

## Integration notes

Import `FormUsageDemo.vue` for the exact local example. It uses scoped native field styling and existing Lustro action styles; other catalogs retain their own wrappers/classes. No universal Forms package or shared prop API exists here. Existing specimens do not supply a backend or prove validation correctness.

Do not store sensitive field contents in a demo, URL or log. Render user text safely, validate permissions/data server-side, and treat filename and client-side constraints as untrusted inputs. All guide values are fictitious; local submission never sends them anywhere.

<style>
.form-guide .vp-doc table { width:100%; table-layout:fixed }
.form-guide .vp-doc td, .form-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .form-guide .vp-doc table, .form-guide .vp-doc tbody, .form-guide .vp-doc tr, .form-guide .vp-doc td { display:block; width:100% }
  .form-guide .vp-doc thead { display:none }
  .form-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .form-guide .vp-doc td { border:0 }
  .form-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .form-guide .vp-doc td + td { padding-top:4px }
}
</style>
