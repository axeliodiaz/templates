---
pageClass: button-group-guide
---
<script setup>
import ButtonGroupUsageDemo from './.vitepress/theme/ButtonGroupUsageDemo.vue'
</script>

# Button group

A button group keeps related actions or choices together. The visual grouping does not define its behavior: a group may contain ordinary commands, one active view or several independent toggles. Choose that behavior before adding the joined border. For an individual action, see [Buttons](/buttons).

## Try the patterns

Design, Code and Preview select one local view. Bold and Italic toggle independently. Export sample changes a message, while More sample actions is a native disclosure containing another command and a disabled action. These are fictitious examples; no export, clipboard write, network request or persistence occurs.

<ButtonGroupUsageDemo />

## How to use it

1. **Group one idea.** Keep view choices together and export commands together. Do not put unrelated settings in one connected strip just to save space.
2. **Choose a selection model.** Independent commands have no pressed state. Toggle buttons expose `aria-pressed`. If a submitted form requires one answer, use native radios in a fieldset; use checkboxes for multiple answers.
3. **Give the group a name.** Use `role="group"` and a useful `aria-label` or `aria-labelledby`. Keep a visible heading when the name is important to understand the choices.
4. **Keep labels stable.** A toggle named Bold stays Bold when selected. Communicate state with `aria-pressed`, contrast and a visible selected style.
5. **Keep the layout usable.** Use one size within a group, preserve touch targets and wrap or switch to a vertical layout on narrow screens. Do not shrink labels until they become unreadable.
6. **Separate action from disclosure.** A main command must not accidentally open its adjacent menu. Name the disclosure and do not let a decorative chevron become an unnamed click target.

## Anatomy

| Part | Purpose |
|---|---|
| Named container | Identifies related controls without changing their native behavior. |
| Native button | A command or toggle with a readable name and explicit type. |
| Selected treatment | Indicates the active mode or independent on/off state. |
| Group border / spacing | Connects the controls visually while preserving separate focus rings. |
| Optional disclosure | Reveals secondary commands; it has its own name and state. |
| Result / selected content | Explains the outcome outside the controls. |

## Data shape

This is the guide demo's actual state model, not a universal catalog API:

```ts
const modes: string[] = ['Design', 'Code', 'Preview']
// Vue refs:
// mode: string = 'Design'
// bold: boolean = false
// italic: boolean = false
// message: string = 'No sample action yet.'
```

`ButtonGroupUsageDemo.vue` has no props or emits. A mode click sets `mode`; formatting clicks invert their own boolean. Export and Copy only set `message`. The native details element owns its open state. Everything resets when the component is recreated. It does not implement tabs, roving tabindex, a menu widget, radio semantics, keyboard shortcuts or backend operations.

For an application, keep stable IDs separate from translated labels:

```ts
type GroupItem = { id: string; label: string; disabled?: boolean }
type Selection = { selectedId: string } // exclusive toggle group
// For independent toggles, use a Set<string> of selected IDs instead.
```

## Usage

### Exclusive display modes with ordinary toggle buttons

```vue
<script setup>
import { ref } from 'vue'
const items = ['Design', 'Code', 'Preview']
const choice = ref('Design')
</script>
<template>
  <div class="l-segment" role="group" aria-label="Display mode">
    <button type="button" v-for="item in items" :key="item"
      :aria-pressed="choice === item"
      :class="{ 'is-active': choice === item }"
      @click="choice = item">{{ item }}</button>
  </div>
  <p role="status">Selected view: {{ choice }}</p>
</template>
```

This matches the native-button approach in the Lustro catalogs. Each button is a Tab stop; Enter and Space activate it. It is not an ARIA tablist. If the controls really switch linked panels as tabs, add the full tab pattern, including panel relationships and arrow-key focus, rather than changing only the role.

### Form choices

```html
<fieldset>
  <legend>Report format</legend>
  <label><input type="radio" name="format" value="pdf" checked> PDF</label>
  <label><input type="radio" name="format" value="csv"> CSV</label>
</fieldset>
```

Style the labels to look grouped using the consuming theme. Preserve the native inputs, names, values and visible focus. Do not copy BSX span specimens and expect form submission or keyboard selection to work.

## States and variants

- **Basic and sizes:** related commands in a horizontal row. Use consistent sizing; each action remains independently named and focusable.
- **Toolbar:** several related groups separated by space. The demo uses named groups, not `role="toolbar"`; a production toolbar pattern needs its own focus/arrow-key handling.
- **Vertical:** useful when labels are long or width is limited. Preserve logical DOM and reading order.
- **Checkbox style:** multiple selected choices. Use native checkboxes for form data or pressed buttons for independent application toggles.
- **Radio style:** one selected choice. Use native radios for a form; the demo uses an exclusive set of toggle buttons and announces each pressed state.
- **With dropdown:** separate primary action and disclosure. The guide uses native `details`/`summary`, not an ARIA menu. Tab reaches commands when open. Do not claim menu arrow keys or Escape handling that has not been implemented.
- **Disabled:** native disabled buttons cannot activate. Keep the remaining choices reachable and explain a prerequisite nearby when it matters.
- **Pending/error:** prevent duplicate commands at the narrowest useful scope. Do not disable unrelated choices; report an operation's result separately. See [Buttons loading guidance](/buttons#states-and-variants).

## Existing templates and variants

| Template | Source and behavior |
|---|---|
| Lustro | [UI kit](/ui-kit#button-group), [components](/components#button-group), [guide](/lustro/guide-components#button-group): `l-segment` with native pressed buttons and local choice state. |
| Lustro expanded | [Basic and sizes](/lustro/components-more#button-groups-basic-and-sizes), [toolbar/vertical](/lustro/components-more#button-groups-toolbar-and-vertical), [checkbox/radio style](/lustro/components-more#button-groups-checkbox-and-radio-style), [dropdown](/lustro/components-more#button-groups-with-dropdown). Legacy `grp` / `grp v` span specimens illustrate appearance only. |
| Felix | [Expanded groups](/felix/components-more#button-groups-basic-and-sizes), including toolbar, vertical, checkbox/radio and dropdown sections. Scoped `bsx-fx` styles differ from the atoms' `fx-btn` family; do not mix them. |
| Lumen | [Expanded group sections](/lumen/components-more#button-groups-basic-and-sizes) point to the bundled Bootstrap gallery. Use that gallery's native controls and scoped theme. |
| Scopecraft | [Expanded groups](/scopecraft/components-more#button-groups-basic-and-sizes), with all four listed sections. Legacy BSX span groups are not accessible controls. |
| Relay | [Catalog](/relay/components): Studio `sk-group` with Day/Week/Month pressed buttons inside the scoped Bootstrap wrapper. |
| Folio | [Catalog](/folio/components): the same Studio selection structure under Folio tokens. |
| Pace | [Catalog](/pace/components): Studio selection structure with Pace styling. |
| Spark | [Catalog](/spark/components): Studio selection structure with Spark styling. |

The Studio implementation shares its `tab` ref with other catalog examples. That is demo plumbing, not a recommended application model: give unrelated groups separate state. The expanded catalogs show more visual variants than the live guide demo; this page documents them without altering those in-flight source files.

## Motion and accessibility

The guide uses a 120ms color transition for selection feedback; reduced motion removes it. Meaning comes from stable labels, visible state and `aria-pressed`, not from animation. No automatic cycling or animated focus movement occurs.

Tab follows native controls in DOM order. Enter and Space activate a focused button. Disabled native controls are skipped. Focus rings must not be clipped by a joined group's overflow. Native radios bring their own selection keyboard behavior; plain grouped buttons do not automatically get it. Keep destructive actions explicit and do not hide the only recovery action in a disclosure.

## Integration notes

Import `ButtonGroupUsageDemo.vue` for this exact guide example; it relies on the existing Lustro `l-segment`, button and dropdown styles and adds scoped spacing/focus styles. For another theme, use its actual catalog wrapper and classes from the table above. There is no shared installed ButtonGroup package or identical prop API across these catalogs.

Persist application choices only when the product calls for it. Validate submitted IDs on the server and handle permissions/errors separately. Data, labels and results on this page are fictitious and local.

<style>
.button-group-guide .vp-doc table { width:100%; table-layout:fixed }
.button-group-guide .vp-doc td, .button-group-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .button-group-guide .vp-doc table, .button-group-guide .vp-doc tbody, .button-group-guide .vp-doc tr, .button-group-guide .vp-doc td { display:block; width:100% }
  .button-group-guide .vp-doc thead { display:none }
  .button-group-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .button-group-guide .vp-doc td { border:0 }
  .button-group-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .button-group-guide .vp-doc td + td { padding-top:4px }
}
</style>
