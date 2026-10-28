---
pageClass: dropdown-guide
---
<script setup>
import DropdownUsageDemo from './.vitepress/theme/DropdownUsageDemo.vue'
</script>

# Dropdowns

A dropdown reveals related secondary actions from a compact trigger. Use it when keeping every action visible would add noise. Use a select for a form value, navigation links for locations and a dialog for a separate decision. Appearance alone does not create an ARIA menu.

## Try local actions

Open Sample actions, Tab to Preview or Duplicate, then activate. Only local feedback changes. Escape closes and returns focus to the trigger; clicking outside closes without moving focus back. The unavailable action is a real disabled button. All actions are fictitious: no record is duplicated or changed.

<DropdownUsageDemo />

## How to use it

1. **Group related actions.** Keep the primary action visible; reserve the dropdown for secondary choices. Name destructive actions plainly and confirm consequential operations separately.
2. **Use a real trigger.** A button exposes expanded state and controls a named panel. Never use a decorative span as an interactive trigger.
3. **Choose the interaction model.** This guide is a disclosure containing ordinary buttons, not role menu/menuitem. It uses Tab, not a claimed arrow-key menu pattern.
4. **Keep focus predictable.** Escape returns to the trigger; action selection closes it. Outside pointer dismissal must not steal focus from the clicked destination.
5. **Place the panel safely.** Keep it in the viewport, above neighboring content, without clipped labels. The guide uses normal flow instead of collision-prone absolute placement.
6. **Wire actual actions.** A selected label is not a confirmed copy, save or deletion. Handle pending, failure and authorization in the application.

## Anatomy

| Part | Purpose |
|---|---|
| Trigger | Native button with expanded state and controlled panel ID. |
| Panel | Related action buttons, optional section label and separator. |
| Action | Real button for an operation; real link for a destination. |
| Disabled action | Native disabled state plus an understandable label/reason. |
| Feedback | Truthful local or confirmed operation result. |

## Data shape

`DropdownUsageDemo.vue` has no props or emits. Actual refs: `open: boolean = false`, `root: HTMLElement | null`, `trigger: HTMLButtonElement | null`, and `result: string` initialized to the fictitious local-action notice. `pick(action)` sets the result and closes with focus return. `close(restore)` hides the panel and optionally focuses the trigger after Vue renders. A document pointerdown listener closes only when the target is outside root; it is removed on unmount.

There is no network, clipboard, storage, route change or record mutation. The panel ID is guide-specific; scope it if rendering multiple copies. A suggested application action model, not shared catalog props:

```ts
type Action = { id: string; label: string; disabled?: boolean; reason?: string }
type ActionState = 'idle' | 'pending' | 'success' | 'error'
```

## Usage

```vue
<button type="button" :aria-expanded="open" aria-controls="sample-actions"
  @click="open = !open">More actions</button>
<div v-if="open" id="sample-actions">
  <button type="button" @click="preview">Preview</button>
</div>
```

Define state and handlers, Escape/focus return and outside dismissal in the application. Import `DropdownUsageDemo.vue` for this exact full local example. If using role menu, implement its complete focus/arrow/Home/End/typeahead behavior and item semantics; do not add the role to this ordinary disclosure while keeping incompatible keyboard behavior.

## States and variants

- **Closed/open:** aria-expanded follows actual panel visibility.
- **Grouped/separated:** headings explain groups; separators are not focusable actions.
- **Split button:** primary action and disclosure trigger remain separate named controls. Not implemented in this guide.
- **Placement:** align to available space; use a tested positioning layer for overlays. Do not clip core actions behind overflow containers.
- **Disabled:** native disabled state, not merely a `.dis` class. Explain prerequisites where needed.
- **Pending/error:** avoid duplicate work, preserve the user's context and report confirmed results. No pending work exists here.

## Template map

| Surface | Actual implementation |
|---|---|
| Lustro base | [Guide](/lustro/guide-components#dropdowns), [components](/components#dropdowns), [UI kit](/ui-kit#dropdowns): native details/summary containing buttons and local feedback. Native details does not by itself supply outside-click/Escape menu behavior. |
| Lustro expanded | [Dropdowns](/lustro/components-more#dropdowns): fixed `.dd`/`.menu` specimens with span triggers and anchors without href. Visual active/grouped/split/disabled treatments, not a functioning action menu. |
| Felix expanded | [Dropdowns](/felix/components-more#dropdowns): corresponding scoped visual specimens. |
| Lumen expanded | [Dropdowns](/lumen/components-more#dropdowns): bundled gallery link. |
| Scopecraft expanded | [Dropdowns](/scopecraft/components-more#dropdowns): corresponding visual specimens. |
| Felix molecules | [DropdownMenu](/felix/components/molecules#dropdownmenu): native details and ordinary buttons. Source `@felix/ui` import prose is not proof of an installed shared package here. |
| Studio catalogs | [Relay](/relay/components), [Folio](/folio/components), [Pace](/pace/components), [Spark](/spark/components): local action disclosure and feedback; inspect full focus/dismissal behavior before production reuse. |

## Motion and accessibility

Action hover background transitions over 120ms; reduced motion removes it. Panel visibility is immediate. The result is a polite status region. Tab reaches enabled native controls; Enter/Space activates buttons, Escape closes. No arrow-menu behavior is claimed. Keep focus visible, panel content readable and touch targets useful. The document listener is cleaned up on unmount.

## Integration notes

Preserve each template's scoped tokens and use real application handlers. Do not treat a menu click as permission for an irreversible action. Server authorization and operation success remain separate from disclosure state. All guide actions and results are fictitious and local.

<style>
.dropdown-guide .vp-doc table { width:100%; table-layout:fixed }
.dropdown-guide .vp-doc td, .dropdown-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .dropdown-guide .vp-doc table, .dropdown-guide .vp-doc tbody, .dropdown-guide .vp-doc tr, .dropdown-guide .vp-doc td { display:block; width:100% }
  .dropdown-guide .vp-doc thead { display:none }
  .dropdown-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .dropdown-guide .vp-doc td { border:0 }
  .dropdown-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .dropdown-guide .vp-doc td + td { padding-top:4px }
}
</style>
