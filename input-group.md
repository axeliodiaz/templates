---
pageClass: input-group-guide
---
<script setup>
import InputGroupUsageDemo from './.vitepress/theme/InputGroupUsageDemo.vue'
</script>

# Input group

An input group attaches a short prefix, suffix or related action to a native field. Use it when the extra context belongs to that value: a username prefix, currency unit or search action. It is not a replacement for a visible label, field validation or a form.

## Try a local group

Change the size, edit the fictitious username or amount, then search for a sample term. Search updates only the local result. The currency group neither parses nor converts money; nothing is sent, charged or saved.

<InputGroupUsageDemo />

## How to use it

1. **Keep the label outside the group.** Give the native input a unique ID and an associated label. A prefix such as @ is insufficient as the field name.
2. **Choose the addon.** Plain text for a unit or prefix; a real button for an action. A styled span is not interactive.
3. **Explain the value format.** Specify whether the user should type a prefix, decimal separator or unit. Add help via `aria-describedby`.
4. **Keep one visual boundary.** Match heights, join borders and preserve a visible focus indication for the actual input and button.
5. **Wire actual state.** Bind to the consuming form. Buttons need a deliberate type: submit for the associated form, button for independent actions.
6. **Test narrow layouts.** Allow the field to shrink with `min-width:0`. Stack an action if its label and the field cannot fit. Never hide essential units.

## Anatomy

| Part | Purpose |
|---|---|
| Label | Names the field, including units when necessary. |
| Leading addon | Short context before the value; often decorative if repeated in the label/help. |
| Native input | Editing, value, focus and keyboard behavior. |
| Trailing addon | Unit or suffix after the value. |
| Action button | An optional real action with an explicit accessible name. |
| Help/error | Explains constraints or correction outside the visual row, associated with the input. |

## Data shape

`InputGroupUsageDemo.vue` has no props or emits. Its exact refs are:

```ts
// username: string = 'sample'
// amount: string = '24.00'
// query: string = ''
// size: string = 'default' // select limits it to small/default/large
// result: string = 'Fictitious local values. Nothing is sent or saved.'
```

`search()` trims `query` and sets the local result or a request to enter a term. `amount` remains a string. `inputmode="decimal"` suggests a mobile keyboard, not numeric validation. There is no formatter, currency API, remote search, loading state or shared component package.

For application code, an optional configuration model might be:

```ts
type GroupSize = 'small' | 'default' | 'large'
type InputGroupModel = {
  id: string; label: string; value: string
  prefix?: string; suffix?: string; describedBy?: string
  disabled?: boolean; size?: GroupSize
}
```

This is a suggested application model, not the props of the existing catalogs. Keep callbacks and submitted values separate from decorative addons.

## Usage

### Native prefix with a real label

```html
<label for="username">Username</label>
<div class="input-group">
  <span aria-hidden="true">@</span>
  <input id="username" name="username" aria-describedby="username-help">
</div>
<p id="username-help">Enter your username without the @ prefix.</p>
```

Use your template's wrapper/input classes and provide the actual form submit path. Hiding the repeated prefix from assistive technology avoids duplicate speech; meaningful context must still be present in the label or help.

### Action inside the group

```vue
<form @submit.prevent="search">
  <label for="search-query">Search records</label>
  <div class="input-group">
    <input id="search-query" v-model="query">
    <button type="submit">Search</button>
  </div>
</form>
```

Define `query` and `search` in the application. Scope IDs per instance, handle empty results and failures, and expose async pending/result state only when a real request exists.

## States and variants

- **Prepended / appended:** use one or both addons when each adds context. Do not force a long sentence into a narrow addon.
- **Sizes:** small/default/large should apply consistently to the field and addon. This guide retains 44px minimum controls even in the small visual variant.
- **Button addon:** Tab reaches the real button after the field. Enter submits this guide's search form. Keep unrelated actions out of the group.
- **Disabled:** disable the native field, and any dependent action, not just its wrapper. Explain why it is unavailable outside the disabled control.
- **Read-only:** allow inspection/copy where appropriate; do not present it as disabled. A read-only field may still be submitted.
- **Invalid / valid:** associate text with the input and set `aria-invalid` only for a real validation outcome. Do not communicate correctness with a colored border alone. See the separate validation task.
- **Pending:** prevent duplicate requests for actual async actions, keep the value, and provide a retry path on failure. The local demo has no pending request.

## Template map

| Surface | Implementation and limits |
|---|---|
| Lustro expanded | [Input groups](/lustro/components-more#forms-input-groups): `.ig`, `.pre`, `.inp` and `.ig.post` specimens with leading @ / $, trailing .00 and a styled Go span. The span is visual, not a functioning button. |
| Felix expanded | [Input groups](/felix/components-more#forms-input-groups): the same specimen structures scoped to Felix. Copy the chosen style only with real labels and actions. |
| Lumen expanded | [Input groups](/lumen/components-more#forms-input-groups) links to the bundled Bootstrap gallery. Inspect the native gallery controls when integrating. |
| Scopecraft expanded | [Input groups](/scopecraft/components-more#forms-input-groups): separately scoped `.ig` / `.pre` / `.inp` specimens. |
| Lustro base | [UI kit](/ui-kit#forms), [components](/components#forms), [form guide](/lustro/guide-components#forms) supply general form controls. They are related form context, not a complete grouped-input API. |

The page above adds an interactive, labeled local example without silently changing the legacy specimens or claiming a universal library API.

## Motion and accessibility

A 120ms group border-color transition tracks focus; reduced motion removes it. No animation is required to understand units or results. Native inputs and buttons preserve their keyboard behavior, with a separate focus-visible outline. The result uses a polite status region; field-level errors belong to the input, not only that result.

Test the longest label, addon and translated button text at mobile widths. Preserve input labels, logical DOM order, meaningful disabled explanations and adequate contrast. Avoid a role of group unless the grouping itself needs an accessible name; do not create a custom widget just to join borders.

## Integration notes

Import `InputGroupUsageDemo.vue` for this exact local example. It uses scoped styles and native controls. Existing `.ig` classes belong to their own template scope; preserve each template's tokens rather than applying all catalogs globally. Validate and authorize data on the server. Prefixes and suffixes are presentation, not trusted submitted values. All values here are fictitious and local.

<style>
.input-group-guide .vp-doc table { width:100%; table-layout:fixed }
.input-group-guide .vp-doc td, .input-group-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .input-group-guide .vp-doc table, .input-group-guide .vp-doc tbody, .input-group-guide .vp-doc tr, .input-group-guide .vp-doc td { display:block; width:100% }
  .input-group-guide .vp-doc thead { display:none }
  .input-group-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .input-group-guide .vp-doc td { border:0 }
  .input-group-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .input-group-guide .vp-doc td + td { padding-top:4px }
}
</style>
