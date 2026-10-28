---
pageClass: close-button-guide
---
<script setup>
import CloseButtonUsageDemo from './.vitepress/theme/CloseButtonUsageDemo.vue'
</script>

# Close button

A close button dismisses its current surface. It is not a delete, cancel-save or discard action unless the product explicitly defines and explains that effect. Use a native button with a clear name and a generous hit area. An × glyph alone is not a useful accessible name.

## Try panel and dialog dismissal

<CloseButtonUsageDemo />

The optional local panel starts visible. Dismissing it removes the panel and moves focus to Restore sample panel; restoring mounts it again without moving focus. Open sample dialog uses native showModal. Its close button or Escape closes it, and focus returns to the opener. The disabled close specimen is noninteractive. There is no remote save, deletion or data loss. All sample content is fictitious.

## How to use it

1. Use type=button so the control does not accidentally submit a surrounding form.
2. Name the target: Dismiss sample optional panel or Close sample dialog. Hide the decorative glyph from assistive technology.
3. Keep at least a 44px hit area in this guide even when the glyph is small. Do not shrink the clickable region to the icon outline.
4. Decide where focus goes when the button disappears. Inline panels need a stable destination; dialogs generally return to the opener.
5. Separate dismissal from destructive effects. If closing would discard work, preserve the data or explain and confirm the consequence under the host's policy.
6. Use the containing surface's behavior. A dialog's Escape/focus containment comes from the dialog, not from an × character.

## Anatomy and actual API

`CloseButtonUsageDemo.vue` has no props or emits. `visible` starts true. `dismiss()` sets it false then focuses Restore after the DOM update. The button sets it true again. `open()` calls the dialog ref's showModal; `closed()` returns focus to the opener on its close event. The disabled specimen has native disabled. The labelled dialog title uses a guide-specific ID; scope it per instance before mounting multiple copies.

```vue
<script setup>
import CloseButtonUsageDemo from './.vitepress/theme/CloseButtonUsageDemo.vue'
</script>
<template><CloseButtonUsageDemo /></template>
```

No timers, global listeners, storage or requests exist, so unmount needs no cleanup. This is not an installed CloseButton prop/event API. A host could provide `{ label, disabled, onClose }`, but close effects and focus belong to that surface, not a universal glyph controller.

## States and usage

| State/context | Actual behavior or integration rule |
|---|---|
| Default/hover/pressed/focus | Native button, 44px minimum area, visible focus ring and restrained feedback. |
| Disabled | Native disabled prevents activation and removes normal Tab stop. Provide a reason nearby when this matters in the host. |
| Inline panel | Removes local content, focus to Restore. No Escape handler. |
| Modal dialog | Native modal behavior, explicit close and Escape, return to opener. No outside-click dismissal implemented. |
| Toast | Use per-item dismiss ID and clear its timer. See [Toasts](/toasts); a close action must not remove unrelated messages. |
| Offcanvas | Use that surface's modal/nonmodal and focus policy. See [Offcanvas](/offcanvas), not a shared assumption that every side panel is modal. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#close-button), [Components](/components#close-button), [Lustro guide](/lustro/guide-components#close-button) | The existing Close sample panel button calls showToast('Sample panel closed'); it demonstrates acknowledgement, not removal of the displayed panel. Its name does not prove a panel was actually dismissed. |

That catalog feedback shares the local toast timer system. This guide's actual panel removal and native-dialog example teach integration without silently changing the existing specimen or claiming a universal installed API.

## Motion and accessibility

Guide hover background changes over 140ms and press scales to 96% over 120ms. Panel/dialog entrances fade and move 4px over 160ms. Reduced motion removes all transitions/entrances. Closing is immediate with no delayed exit or focus transfer. Native Enter/Space activates the button. The glyph is aria-hidden, and the accessible name names the surface.

Test panel dismiss/restore, disabled behavior, dialog close/Escape, focus return, keyboard, hit area, reduced motion and narrow wrapping. Test real unsaved-content policies in the host before wiring close to navigation or disposal. Do not report a save, cancellation or deletion from a close animation alone.

<style>
@media(max-width:700px){.close-button-guide .vp-doc table,.close-button-guide .vp-doc tbody,.close-button-guide .vp-doc tr,.close-button-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.close-button-guide .vp-doc thead{display:none}.close-button-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.close-button-guide .vp-doc td{overflow-wrap:anywhere}.close-button-guide .vp-doc tr{margin-bottom:12px}}
</style>
