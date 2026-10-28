---
pageClass: sheet-guide
---
<script setup>
import SheetUsageDemo from './.vitepress/theme/SheetUsageDemo.vue'
</script>

# Sheet

A sheet is a secondary surface that holds detail or a short flow beside the current view. A side sheet keeps more visual context than a centered modal, but its position does not decide modality. Use a centered modal for a compact decision, a sheet for longer contextual detail, and an inline region when both surfaces must stay interactive.

## Try a read-only sheet

Choose compact or wide, then open the fictitious transfer details. Both widths are guide variants, not Felix package props. Close starts focused; Tab/Shift+Tab stay between Close and Acknowledge. Escape or Close returns focus to the opener. Acknowledge changes local feedback only. Backdrop clicks intentionally leave this sample open. No money moves, no recipient is contacted and no transfer is approved.

<SheetUsageDemo />

## How to use it

1. **Keep context explicit.** Name the selected item and distinguish a review from a real operation. Do not imply that displaying payment detail grants payment permission.
2. **Choose side sheet or centered modal.** A sheet gives a longer reading region; a modal keeps a short decision centered. Neither should become a second application hidden over the first.
3. **Choose modal or nonmodal behavior.** This guide uses native showModal with an inert background. A persistent nonmodal inspector needs a different focus policy.
4. **Pick a width for content.** Compact is capped at 440px, wide at 640px, both at the viewport. Preserve readable wrapping and internal scrolling rather than clipping.
5. **Name the surface and safe exit.** A visible title labels the dialog; Close is autofocus. Provide Escape and a deliberate unsaved-work policy before adding forms.
6. **Keep one controller.** Native dialog owns the guide's open/close lifecycle. Do not layer another overlay controller over it.

## Anatomy

| Part | Purpose |
|---|---|
| Opener | Opens local detail and receives restored focus. |
| Header | Visible title and enabled Close action. |
| Body | Read-only fictitious amount, destination and fee. |
| Footer | Acknowledge sample, explicitly not a transaction. |
| Scrim | Background stays visible but inert; no click-dismiss here. |
| Size choice | Local guide demonstration, not an application setting. |

## Actual data and API

`SheetUsageDemo.vue` exposes no props or emits. `selected` is the local size string, initially `'compact'`; `'wide'` adds a CSS class. `sheet` and `opener` are element refs; `notice` is local feedback. `show()` calls showModal. `close()` calls close; the close event restores opener focus. The Tab edge handler wraps the two enabled buttons. `inspect()` sets an acknowledgement string and closes. Unmount closes the sheet. Escape is native cancel behavior; there is no backdrop click handler, server, storage or transfer API.

```vue
<script setup>
import SheetUsageDemo from './.vitepress/theme/SheetUsageDemo.vue'
</script>
<template><SheetUsageDemo /></template>
```

A possible application shape is `{ open: boolean, itemId: string | null, size: 'compact' | 'wide', state: 'loading' | 'ready' | 'error' }`. This is host guidance only. It is not a shipped Felix Sheet API. Scope IDs per instance and choose a logical return target if the opener is removed.

## States and variants

- **Closed/open:** preserves page context visually; background interaction is blocked in this modal guide.
- **Compact/wide:** 440/640px maximum, viewport-capped, scrollable height at 100dvh. These are demonstrative local variants.
- **Read-only review:** implemented here; acknowledgement is not a save or transfer.
- **Loading/empty/error:** show truthful content and a safe recovery without hiding Close. Not simulated in this sample.
- **Editable/dirty:** preserve draft values after failure and define discard before allowing dismissal. Not implemented here.
- **Nonmodal/persistent:** keep background usable without falsely declaring aria-modal. Separate controller/focus policy, not implemented here.
- **Bottom sheet:** a related mobile presentation, not supplied by this Felix specimen or this guide. See [Offcanvas](/offcanvas) for a local bottom-edge example.

## Felix source map

[Felix molecules: Sheet](/felix/components/molecules#sheet) has a right-edge `.fx-scrim.fx-scrim-end` wrapping `.fx-sheet`. `data-open` and `data-close` buttons operate it through `felix-demos.ts`. The live body contains sample amount, exchange rate, fee and arrival text. It does not execute a transfer or fetch a rate.

The shared overlay enhancer adds dialog role, accessible name from its bold title, aria-modal, initial action focus, Tab edge wrapping, Escape/backdrop dismissal and opener focus return. Its div-based scrim does not itself make the document background inert. Verify isolation if adapting that pattern; aria-modal is a declaration, not an inert implementation.

The source prose names Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody and SheetFooter from `@felix/ui`. Treat this as design-source usage text, not proof of installed exports. The actual repository specimen is local DOM/class behavior. It has no documented size prop contract; do not invent one from the names. This guide adds a separate native example, not a silent rewrite of that specimen.

## Motion and accessibility

The guide arrives from the right by 8px over 180ms. Reduced motion removes the arrival animation while keeping content and focus behavior. Opening focus does not wait for motion. Close remains reachable with scrolling, zoom and a virtual keyboard; long headers must wrap rather than push it away.

Test Tab/Shift+Tab, initial Close, Escape, Close/Acknowledge focus return, both sizes and backdrop nondismissal. Test the Felix specimen's backdrop dismissal separately: its policy differs from this guide. A visual side panel must not trap focus unless it is actually modal, and a modal must not leave background controls reachable.

## Integration notes

Keep visibility, selected record and server state separate. Cancel stale loads when the item changes, avoid showing old detail under a new title, and retain drafts on recoverable failures. Preserve Felix tokens when adapting its specimen. Every amount and action on this page is fictitious; real actions need validated data and confirmed results.

<style>
@media(max-width:700px){.sheet-guide .vp-doc table,.sheet-guide .vp-doc tbody,.sheet-guide .vp-doc tr,.sheet-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.sheet-guide .vp-doc thead{display:none}.sheet-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.sheet-guide .vp-doc td{overflow-wrap:anywhere}.sheet-guide .vp-doc tr{margin-bottom:12px}}
</style>
