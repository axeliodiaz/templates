---
pageClass: drawer-guide
---
<script setup>
import DrawerUsageDemo from './.vitepress/theme/DrawerUsageDemo.vue'
</script>

# Drawer

A drawer is a side panel for detail or a short secondary task. Keep the surrounding page visible to preserve orientation. Use a modal when the main goal is a compact decision, and an inline inspector when users must interact with both regions at once. Drawer, sheet and offcanvas overlap visually; the implementation's focus and state contract is what matters.

## Try record details

Select a fictitious record, then open its details. Close receives focus. Tab and Shift+Tab stay between the drawer's two actions; Escape or Close dismisses and returns focus. Mark viewed updates the local status only. Backdrop clicks intentionally do not dismiss this sample. Nothing is saved, sent or authorized.

<DrawerUsageDemo />

## How to use it

1. **Choose the record outside the drawer.** Keep its stable ID separate from visibility so the host can fetch, retry or navigate without confusing records.
2. **Open with one focus owner.** This guide uses native showModal, which puts the drawer in the top layer and makes the background inert. Do not combine it with a second focus trap or Bootstrap controller.
3. **Name the surface.** A visible record title labels the dialog. Explain whether changes are local or confirmed remotely.
4. **Make safe dismissal reachable.** Focus starts on Close. Native Escape works; the close event restores the opener. Do not rely on an outside click as the only exit.
5. **Keep long content scrollable.** Width is capped at the viewport and height at 100dvh. A real form must remain usable with zoom and a virtual keyboard.
6. **Keep operations honest.** Opening details is not a save. Show pending/error/success from real results, and preserve input after failure.

## Anatomy

| Part | Purpose |
|---|---|
| Record selector | Supplies context; not itself a drawer API. |
| Opener | Real button and return-focus target. |
| Header | Visible title plus safe Close. |
| Body | Selected record's details and local/fictitious scope notice. |
| Footer | Clearly named local or confirmed action. |
| Backdrop | Visible but inert background; not clickable-to-dismiss here. |

## Actual data and API

`DrawerUsageDemo.vue` has no props or emits. `selected: string` starts `'Sample request A'`, with a second fixed sample option. `notice` is a local string; `drawer` and `opener` are native element refs. `show()` calls showModal, `close()` calls close, and the close event returns focus. The Tab edge handler cycles the two enabled buttons. `inspect()` updates notice and closes. Unmount closes any open dialog. There is no fetching, authorization, persistence or real record mutation.

```vue
<script setup>
import DrawerUsageDemo from './.vitepress/theme/DrawerUsageDemo.vue'
</script>
<template><DrawerUsageDemo /></template>
```

A possible application model is `{ open: boolean, recordId: string | null, state: 'loading' | 'ready' | 'error' }`. This is a host integration suggestion, not a shared catalog prop API. Use unique title/description IDs if mounting multiple drawers, and restore focus to a sensible remaining control if the opener disappears.

## States and variants

- **Closed/open:** the selected context remains local; opening moves focus inside and closing returns it.
- **Read-only detail:** implemented in this guide. The viewed result is a local string, not a server write.
- **Start/end:** this guide uses an end/right drawer in LTR. Use logical CSS for RTL; neither source has a universal placement prop.
- **Compact/full-width mobile:** guide width is at most 440px and no wider than the viewport; internal content scrolls.
- **Loading/empty/error:** real data should show distinct status and recovery without losing Close. Not simulated here.
- **Editing/dirty:** define save/discard behavior before adding fields. Do not silently discard a draft on backdrop or Escape.
- **Nonmodal/push:** separate focus policy; do not mark it aria-modal while the background remains interactive. Not implemented here.

## Template map

| Surface | What actually exists |
|---|---|
| Felix molecules | [Drawer](/felix/components/molecules#drawer): a div-based `.fx-scrim` and `.fx-drawer`, opened by `data-open` and closed by `data-close`. `felix-demos.ts` adds dialog role/name/aria-modal, initial focus, Tab edges, Escape/backdrop dismissal and opener focus return. This is not a native inert background; aria-modal alone does not enforce inertness. Test any production adaptation. |
| Felix package prose | The same source describes Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter and DrawerClose from `@felix/ui`. This is design-source usage text, not proof of an installed/exported API in this repository. The live specimen uses local DOM handlers. |
| Studio catalogs | [Folio](/folio/components), [Spark](/spark/components), [Pace](/pace/components), [Relay](/relay/components): `StudioCatalog.vue` has `drawerDialog: HTMLDialogElement | null`; Open drawer calls showModal. `.sk-drawer` sits at the right edge, width min(350px,90vw); autofocus Close calls close. Native Escape applies. There are no Drawer-specific props; the catalog's theme prop selects its visual language. |
| Related patterns | [Offcanvas guide](/offcanvas) demonstrates four edges and optional backdrop dismissal. [Modal](/modals) demonstrates a centered decision. These are related presentations, not aliases for a single installed component. |

## Motion and accessibility

This guide enters by 8px from the right over 180ms, and removes that animation under reduced motion. Opening focus does not wait for the animation. The native top layer blocks background interaction; explicit button-edge handling keeps Tab navigation predictable. Do not replace showModal with an open attribute and claim identical modality.

Test keyboard opening, initial Close focus, Tab/Shift+Tab, Escape, action/Close return focus, viewport/zoom and long content. In the Felix adaptation also test background pointer/focus isolation rather than assuming aria-modal guarantees it. Do not hide the close control or change selected records behind an active editing drawer.

## Integration notes

Keep one owner for visibility, record selection, focus and cleanup. Abort stale fetches on record change/unmount and do not show old results under a new title. Preserve each language's scoped tokens. All guide records/actions are fictitious and local; a real operation needs validated state and confirmed results.

<style>
@media(max-width:700px){.drawer-guide .vp-doc table,.drawer-guide .vp-doc tbody,.drawer-guide .vp-doc tr,.drawer-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.drawer-guide .vp-doc thead{display:none}.drawer-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.drawer-guide .vp-doc td{overflow-wrap:anywhere}.drawer-guide .vp-doc tr{margin-bottom:12px}}
</style>
