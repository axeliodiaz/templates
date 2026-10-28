---
pageClass: choices-guide
---
<script setup>
import ChoiceUsageDemo from './.vitepress/theme/ChoiceUsageDemo.vue'
</script>

# Checkbox, radio and switch

Checkboxes choose independent values, radios choose one value in a named group, and a switch expresses an on/off setting. Choose the control by the decision, not its appearance. This guide keeps every choice local: no preferences, notifications or accounts change.

## Try fictitious choices

One of two sample filters starts selected, so Select all is indeterminate. Choose both, clear both or toggle each filter. Change the radio channel, then toggle the local sample-alert switch. The status reports actual local state. The disabled checked sample cannot be changed and is not part of the filter count.

<ChoiceUsageDemo />

## How to use it

1. **Choose the right value model.** Independent checkboxes use booleans or an array of selected IDs. Radios share a single value. A switch has one boolean state.
2. **Keep a visible label.** Clicking a native label should toggle the associated control. Name related choices with fieldset and legend.
3. **Use indeterminate for partial selection.** It describes a mixed aggregate, not a third submitted value. Update the parent checkbox from the actual child selection.
4. **Use native controls where possible.** They supply focus, Space and radio arrow behavior. A button switch needs `role="switch"` and accurate `aria-checked`.
5. **Make consequences explicit.** A real instant setting needs pending, failure and rollback behavior. A form checkbox may wait for Save. Neither a label nor a style performs that work.
6. **Preserve state and recovery.** Explain disabled prerequisites. Do not silently opt people into consequential choices or report saving without confirmation.

## Anatomy

| Part | Purpose |
|---|---|
| Control | Native checkbox/radio or a correctly implemented switch. |
| Label | Stable visible action/setting name, not changing between on and off. |
| Group / legend | Names related choices; required for understanding a radio decision. |
| Indicator | Checked, unchecked or partial aggregate state. |
| Helper / error | Explains prerequisites, constraints or correction. |
| Result | Reports actual local state or confirmed application outcome. |

## Data shape

`ChoiceUsageDemo.vue` has no props or emits. Its actual state is:

```ts
// selected: string[] = ['design']
// channel: string = 'email' // radio values: email, inbox
// enabled: boolean = false
const choices = [
  { value: 'design', label: 'Design sample' },
  { value: 'review', label: 'Review sample' }
]
// all = selected.length === choices.length
// mixed = selected.length > 0 && !all
```

`toggleAll()` clears a fully selected array or selects both IDs. The native checkbox's `indeterminate` DOM property follows `mixed`; it is not an HTML attribute or a third boolean. The disabled specimen is independent. Switch click toggles `enabled` only. No backend, storage, network, notification or pending state exists.

For an application, use stable IDs and a clear persistence boundary:

```ts
type Channel = 'email' | 'inbox'
type Settings = { selectedIds: string[]; channel: Channel; alerts: boolean }
// Keep pending/server errors separate from the chosen values.
```

These are integration models, not shared package props.

## Usage

### Native checks and radios

```vue
<label><input type="checkbox" v-model="selected" value="design">Design</label>
<fieldset>
  <legend>Channel</legend>
  <label><input type="radio" name="channel" value="email" v-model="channel">Email</label>
  <label><input type="radio" name="channel" value="inbox" v-model="channel">Inbox</label>
</fieldset>
```

Define `selected` as an array and `channel` as a string. Scope radio names per independent group when multiple instances appear on one page. Disabled native fields are normally excluded from form submission, so do not infer their values from submitted data.

### Switch button

```vue
<button type="button" role="switch" :aria-checked="enabled"
  @click="enabled = !enabled">Enable local sample alerts</button>
```

A native button already activates with Enter and Space. Keep its accessible label stable. This is a local boolean, not a save action. For persistence, commit only after the server confirms and expose failures without losing the previous known state.

## States and variants

- **Unchecked / checked:** the real boolean or selected-ID set, not a decorative checkmark.
- **Indeterminate:** aggregate partial selection. Native property is separate from `checked`; it is not a selectable third value for the children.
- **Radio selected:** exactly one value in a named group; use a legend and avoid unrelated groups sharing a name.
- **Disabled:** disable the actual input/button and give a visible explanation. A `.dis` span does not have disabled keyboard semantics.
- **Switch on/off:** update `aria-checked` from the boolean. Switches do not support a mixed state.
- **Invalid / required:** provide associated text and a clear rule. A required radio group differs from requiring every independent checkbox.
- **Pending / failed:** for real instant settings, prevent duplicate writes and reconcile server state. Do not animate a toggle into a false success.

## Template map

| Surface | Actual implementation |
|---|---|
| Lustro expanded | [Checks/radios](/lustro/components-more#checks-and-radios) and [switches](/lustro/components-more#switches): styled spans show checked, unchecked, indeterminate and disabled visual states. They are not native interactive controls. |
| Felix expanded | [Checks/radios](/felix/components-more#checks-and-radios), [switches](/felix/components-more#switches): corresponding visual span specimens scoped to Felix. |
| Lumen expanded | [Checks/radios](/lumen/components-more#checks-and-radios), [switches](/lumen/components-more#switches): links to bundled gallery specimens. |
| Scopecraft expanded | [Checks/radios](/scopecraft/components-more#checks-and-radios), [switches](/scopecraft/components-more#switches): corresponding scoped visual states. |
| Felix atoms | [Checkbox](/felix/components/atoms#checkbox), [RadioGroup](/felix/components/atoms#radiogroup), [Switch](/felix/components/atoms#switch): native checkbox/radio inputs; the switch is a styled checkbox. Design-source `@felix/ui` prose is not proof of a package installed in this repository. |
| Lustro base | [UI kit](/ui-kit#forms), [components](/components#forms), [guide](/lustro/guide-components#forms): related native form/choice context. |
| Studio catalogs | [Relay](/relay/components), [Folio](/folio/components), [Pace](/pace/components), [Spark](/spark/components): native checks/radios and button switch with `role="switch"` / `aria-checked`. Studio radio and select share local state; separate unrelated values when integrating. |
| Bastion | [Choices](/bastion/components#choices): native include-resolved checkbox and Pager/Mail radios, plus a separate threshold slider. |

## Motion and accessibility

The guide's switch thumb moves over 120ms. Reduced motion removes the transition. Checked state and `aria-checked` remain accurate without motion. No timers or document listeners need cleanup.

Tab reaches native enabled choices; Space toggles a checkbox or switch, and radios retain native arrow navigation within their named group. Labels enlarge the hit area; rows are at least 44px tall. Keep focus visible, meaningful legends and text independent of color. Do not add contradictory ARIA checked values to native checkboxes.

## Integration notes

Import `ChoiceUsageDemo.vue` for this exact local example. Keep each catalog's scoped styles and value model. A static checkmark is not a consent record; validate authorized choices on the server and handle missing/disabled submitted fields intentionally. Preserve the user's previous known setting on failed writes. All labels and values here are fictitious, and no messages or notifications are sent.

<style>
.choices-guide .vp-doc table { width:100%; table-layout:fixed }
.choices-guide .vp-doc td, .choices-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .choices-guide .vp-doc table, .choices-guide .vp-doc tbody, .choices-guide .vp-doc tr, .choices-guide .vp-doc td { display:block; width:100% }
  .choices-guide .vp-doc thead { display:none }
  .choices-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .choices-guide .vp-doc td { border:0 }
  .choices-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .choices-guide .vp-doc td + td { padding-top:4px }
}
</style>
