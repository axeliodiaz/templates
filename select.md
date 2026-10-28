---
pageClass: select-guide
---
<script setup>
import SelectUsageDemo from './.vitepress/theme/SelectUsageDemo.vue'
</script>

# Select

A select chooses a value from a known list. Use native select for a compact, constrained choice; use radios when a short list should remain visible. An input with suggestions is different: it can accept text outside the suggestions. Do not treat the two as interchangeable.

## Try local choices

Choose a size and an interval, then submit the local sample. The placeholder cannot satisfy the required field and Yearly is disabled. The optional tag uses a native datalist: enter a suggested value or your own fictitious text. Native popup and suggestion presentation vary by browser. Nothing is sent or saved.

<SelectUsageDemo />

## How to use it

1. **Define stable values.** Store an ID or code, not the translated display label. Keep labels understandable without surrounding context.
2. **Label the control.** Associate a persistent label with a unique ID. A placeholder option is not the label.
3. **Set an honest default.** Choose a real safe default or an empty placeholder requiring a choice. Do not silently select a paid or consequential option.
4. **Explain unavailable options.** Disable native options where appropriate and give a visible reason. Do not rely on disabled styling alone.
5. **Choose constrained versus free text.** Select limits choices to the option set; datalist suggests text without enforcing membership.
6. **Submit deliberately.** Update local selection on change, but avoid unexpected navigation or saving until the intended action is clear.

## Anatomy

| Part | Purpose |
|---|---|
| Label | Persistent visible and accessible name. |
| Select / input | Native keyboard, focus and popup behavior. |
| Options | Stable values with clear labels; disabled choices where needed. |
| Placeholder option | An empty initial state, not a submitted value. |
| Helper/error text | Constraints and corrections associated with the field. |
| Submit/result | Explicit operation and feedback, separate from changing a value. |

## Data shape

`SelectUsageDemo.vue` has no props or emits. Its actual values are:

```ts
const options = [
  { value: 'weekly', label: 'Weekly sample' },
  { value: 'monthly', label: 'Monthly sample' },
  { value: 'yearly', label: 'Yearly sample', disabled: true }
]
// selected: string = ''
// size: string = 'default' // small/default/large via the native select
// suggestion: string = ''
// result: string = 'Fictitious local choices. Nothing is saved.'
```

`submit()` prints the selected code and optional suggestion locally. The select's native `required` constraint prevents the empty initial choice from submitting. Suggestions are static strings. There is no remote option loading, filtering service, custom combobox, route change, multi-select or persistence.

For a consuming application, keep the value contract explicit:

```ts
type Option = { value: string; label: string; disabled?: boolean }
type Selection = string | null
// Validate membership and current availability on the server too.
```

This is a suggested model, not a shared Select API across these catalogs.

## Usage

### Vue native select

```vue
<label for="interval">Reporting interval</label>
<select id="interval" v-model="selected" required>
  <option disabled value="">Choose an interval</option>
  <option v-for="option in options" :key="option.value"
    :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
</select>
```

Define `selected` and `options` in your application. Include a form/name when submitting native form data, and scope IDs for repeated instances. Handle an existing value becoming unavailable instead of silently choosing a replacement.

### Optional suggestions, not a closed list

```html
<label for="tag">Tag</label>
<input id="tag" list="tags" aria-describedby="tag-help">
<datalist id="tags"><option value="Design"><option value="Review"></datalist>
<p id="tag-help">Choose a suggestion or enter another tag.</p>
```

Datalist support and assistive-technology behavior vary. Test target browsers. If membership is required, use a select or a fully tested combobox with explicit validation; do not pretend datalist enforces it.

## States and variants

- **Default / chosen:** show the current label and preserve its stable value.
- **Empty / required:** use an empty option and native or custom error handling. A placeholder must not count as a valid required choice.
- **Sizes:** align with neighboring fields and maintain useful touch targets. Small/default/large in this guide remain at least 44px high.
- **Disabled control:** native disabled state removes ordinary editing and submission. Explain availability outside the control.
- **Disabled option:** do not offer it as selectable. This guide names why Yearly is unavailable in helper text.
- **Suggestions:** free-text input with datalist; extra text is allowed, not proof of an existing record.
- **Invalid / pending / loading:** show actual errors or loading from the real data source. Keep a previous valid selection while reconciling updates, and avoid stale async responses.
- **Multiple:** native multiple selection has different interaction and value shape (an array). It is not implemented by this single-choice demo.

## Template map

| Surface | Implementation and limits |
|---|---|
| Lustro expanded | [Select variants](/lustro/components-more#select-variants): native default/small/large/disabled specimens with scoped `.inp.sel` styles. |
| Felix expanded | [Select variants](/felix/components-more#select-variants): corresponding native specimens scoped to Felix. |
| Lumen expanded | [Select variants](/lumen/components-more#select-variants) links to its bundled gallery. |
| Scopecraft expanded | [Select variants](/scopecraft/components-more#select-variants): separate native examples and styles. |
| Felix molecules | [Select](/felix/components/molecules#select): native country select inside a label. Source design notes mention `@felix/ui`; that does not establish an installed/exported package in this repository. |
| Lustro base | [UI kit](/ui-kit#forms), [components](/components#forms), [guide](/lustro/guide-components#forms): general native form/select context. |
| Studio catalogs | [Relay](/relay/components), [Folio](/folio/components), [Pace](/pace/components), [Spark](/spark/components): native Reporting interval select shares the local `radio` ref with the radio sample. Integrators should separate unrelated fields rather than assume independent state. |

Language select has its own component and task. The generic select here does not change site language or routing.

## Motion and accessibility

The guide uses a 120ms border-color transition; reduced motion removes it. Native select popups remain browser-controlled. Do not animate a custom imitation over the native popup or replace keyboard behavior just to style it.

Tab reaches enabled controls. Native arrow/type-ahead, open and commit behavior varies by platform; keep it intact. Use visible labels, helper associations and focus outlines. Test longest option text and mobile pickers. Do not claim a datalist is a complete custom ARIA combobox.

## Integration notes

Import `SelectUsageDemo.vue` for this exact sample. Preserve each template's scoped wrapper/tokens; there is no universal shared Select package API. Validate selected codes against the current authorized option set on the server. Treat labels and free text as untrusted text, handle stale options and network failures, and do not infer a save from a value change. All guide choices are fictitious and local.

<style>
.select-guide .vp-doc table { width:100%; table-layout:fixed }
.select-guide .vp-doc td, .select-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .select-guide .vp-doc table, .select-guide .vp-doc tbody, .select-guide .vp-doc tr, .select-guide .vp-doc td { display:block; width:100% }
  .select-guide .vp-doc thead { display:none }
  .select-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .select-guide .vp-doc td { border:0 }
  .select-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .select-guide .vp-doc td + td { padding-top:4px }
}
</style>
