---
pageClass: modal-guide
---
<script setup>
import ModalUsageDemo from './.vitepress/theme/ModalUsageDemo.vue'
</script>

# Modal

A modal interrupts the current view for a focused decision or short task. Use it when the decision needs attention before continuing, not for information that fits inline. A visible overlay is not automatically modal: focus, background interaction, naming and dismissal must all work.

## Try a native modal

Open the fictitious sample. Cancel receives initial focus; Tab stays inside the native modal. Escape, Cancel or clicking the backdrop dismisses it. Confirm updates local feedback only. Closing returns focus to the opener. Nothing is saved, deleted or sent.

<ModalUsageDemo />

## How to use it

1. **Keep the task narrow.** State the decision, consequence and available recovery. Avoid opening a modal for routine success messages.
2. **Use the modal API.** Native `dialog.showModal()` provides top-layer placement, background inertness and focus containment. An open attribute alone does not do the same.
3. **Name and describe it.** Connect a visible title with aria-labelledby. Use aria-describedby for a short explanation, not a whole complex document.
4. **Choose initial focus.** This guide starts on Cancel, a safe action. Long content may need a focusable heading; do not focus a destructive default blindly.
5. **Make dismissal predictable.** Escape and an explicit Cancel should work. Backdrop dismissal is suitable only when losing work is safe; guard unsaved data in real flows.
6. **Report confirmed outcomes.** Keep pending, failure and success distinct. Do not close on a failed real save or claim a deletion from a local click.

## Anatomy

| Part | Purpose |
|---|---|
| Opener | A real button and return-focus target. |
| Dialog | Native modal container with a visible accessible title. |
| Description/body | Decision context and any fields or consequences. |
| Actions | Clear safe dismissal and a separately named confirmation. |
| Backdrop | Blocks background interaction; optionally dismisses safe transient content. |
| Result | Local feedback or confirmed application outcome after closing. |

## Data shape

`ModalUsageDemo.vue` has no props or emits. Actual refs are `dialog: HTMLDialogElement | null`, `trigger: HTMLButtonElement | null`, and `result: string` initialized to the fictitious notice. `show()` calls showModal. `finish(confirmed)` sets local result and calls close. A Tab/Shift+Tab edge handler cycles the two enabled actions, avoiding a browser focus stop outside the content. The close event focuses the opener. Native cancel handles Escape; its handler changes only the local notice and does not prevent default closure.

Backdrop handling checks that the click target is the dialog and the coordinates lie outside its content rectangle. A click inside empty dialog padding must not dismiss. On unmount the dialog is closed. There is no request, storage or destructive operation.

Suggested application state, not shared catalog props:

```ts
type ModalState = 'closed' | 'editing' | 'pending' | 'error'
type Decision = { id: string; title: string; description: string }
```

Keep the record and server result separate from the dialog's visibility.

## Usage

```vue
<script setup>
import { ref } from 'vue'
const dialog = ref(null)
</script>
<template>
  <button type="button" @click="dialog.showModal()">Review</button>
  <dialog ref="dialog" aria-labelledby="review-title">
    <h2 id="review-title">Review sample</h2>
    <button type="button" autofocus @click="dialog.close()">Cancel</button>
  </dialog>
</template>
```

This fragment shows the native opening path. Import `ModalUsageDemo.vue` for full guide focus return, safe backdrop check and result handling. Scope IDs for repeated instances, close on unmount, and test the actual consuming browser. Do not replace showModal with `:open` and continue claiming native modal behavior.

## States and variants

- **Closed/open:** opening moves focus inside; closing restores the logical opener.
- **Small/large/centered:** visual width does not change modality. Keep content within viewport margins.
- **Scrollable:** scroll the body/container without hiding the title, actions or focus. Test zoom and on-screen keyboards.
- **Backdrop:** this safe sample dismisses on an actual outside click. A form with unsaved work needs a deliberate discard policy.
- **Pending:** prevent duplicate requests, preserve values and expose status. If dismissal is blocked, explain why and restore dismissal afterward.
- **Failure:** keep the modal open with specific correction/retry. Do not replace a failed request with a success toast.
- **Nested modal:** avoid stacking unless necessary; focus and return targets must follow the active layer. Not implemented here.

## Template map

| Surface | Actual implementation |
|---|---|
| Lustro base | [Guide](/lustro/guide-components#modal), [components](/components#modal), [UI kit](/ui-kit#modal): guide/components use a visual open-attribute/backdrop example, not showModal focus containment. UI kit uses ComponentCatalog with showModal, opener focus restoration, cancel/confirm and native Escape. This guide adds a separate native modal example without silently changing that specimen. |
| Lustro expanded | [Modals](/lustro/components-more#modals): static div/span specimens for anatomy and small/large/centered/scrollable treatments. They do not create real modal semantics. |
| Felix expanded | [Modals](/felix/components-more#modals): corresponding visual examples. |
| Lumen expanded | [Modals](/lumen/components-more#modals): bundled gallery link. |
| Scopecraft expanded | [Modals](/scopecraft/components-more#modals): corresponding static treatments. |
| Felix molecules | [Dialog](/felix/components/molecules#dialog): overlay div/buttons specimen. Source package prose is not proof of an installed shared Dialog API. |
| Studio catalogs | [Relay](/relay/components), [Folio](/folio/components), [Pace](/pace/components), [Spark](/spark/components): native centered dialog with local confirm and Cancel plus a separate native drawer. No shared Dialog props API is exposed. |
| Bastion / PulseFit | [Bastion dialog](/bastion/components#dialog), [PulseFit modal](/pulsefit-template/components.html#modal-dialog): native dialogs using showModal and dialog-form closure; Bastion supplies a title and native Escape. PulseFit standalone uses its own DOM IDs and listeners. |

## Motion and accessibility

The guide dialog fades/translates 5px over 120ms on open; reduced motion removes the animation. Native focus containment and inert background remain active without motion. The backdrop is not a substitute for focus management.

Test initial focus, repeated Tab/Shift+Tab, Escape, safe/confirm actions, backdrop versus inside clicks and return focus. Dialog content must remain readable at phone sizes and zoom. Do not assign aria-modal to a div while allowing focus into the background and call it complete.

## Integration notes

Preserve each template's scoped styles. Use actual server authorization and confirmed results for consequential actions, and retain entered work on failure. A modal is a presentation boundary, not user approval or an operation guarantee. All guide actions are fictitious and local.

<style>
@media(max-width:700px){.modal-guide .vp-doc table,.modal-guide .vp-doc tbody,.modal-guide .vp-doc tr,.modal-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.modal-guide .vp-doc thead{display:none}.modal-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.modal-guide .vp-doc td{overflow-wrap:anywhere}.modal-guide .vp-doc tr{margin-bottom:12px}}
</style>
