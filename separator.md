---
pageClass: separator-guide
---
<script setup>
import SeparatorUsageDemo from './.vitepress/theme/SeparatorUsageDemo.vue'
</script>

# Separator

A separator creates a boundary between related content. Most visual hairlines are decoration. A meaningful thematic boundary can use native hr or non-focusable separator semantics. Neither is a draggable splitter: a resize handle needs its own keyboard, range and sizing contract. For conversation annotations or dated boundaries see [Marker](/marker).

## Try orientation and semantics

<SeparatorUsageDemo />

Choose horizontal or vertical. Horizontal shows an optional literal caption; vertical separates two real local links. The semantic switch exposes a named, non-focusable separator with explicit orientation; decorative mode hides the divider from assistive technology. Replay layout entrance is explicit, not automatic on each edit. Reset restores horizontal/decorative/or. All content and destinations are fictitious and local.

## How to use it

1. Prefer spacing and clear headings before adding lines everywhere. A divider must not substitute for a meaningful section title.
2. Decide whether the boundary conveys structure or only appearance. Hide purely decorative lines; use a semantic separator only where the boundary helps reading order.
3. Keep orientation explicit for vertical semantic dividers. Avoid giving static separators tabindex, button behavior or range values.
4. Use real anchors for navigation. A border between footer items does not make styled spans into links.
5. Treat caption text as visible content with a clear meaning. This demo hides the entire decorative divider including its caption, so meaningful alternate-choice text should instead remain outside an aria-hidden decoration in a real form.
6. Let narrow layouts wrap without clipping the caption or leaving a misleading line. If a vertical divider no longer makes sense after wrapping, the host should remove or change that decoration with its layout.

## Anatomy and actual API

`SeparatorUsageDemo.vue` has no props or emits. Local refs are `orientation`, `semantic`, `text` and `replay`. The horizontal caption permits 80 characters and uses Vue interpolation, not HTML. Its input is disabled in vertical mode while preserving the value. Replay increments the keyed stage; Reset restores horizontal/false/or/zero. No timers, requests, subscriptions or global listeners need cleanup.

Horizontal hairlines use CSS pseudo-elements. Vertical uses a 1px-wide, 24px-high span between two anchors. Semantic mode supplies role=separator, aria-orientation and an explicit name, with Section boundary as an empty-caption fallback. Decorative mode uses aria-hidden=true and no role. Neither mode is focusable. Status describes local presentation outside the preview.

```vue
<script setup>
import SeparatorUsageDemo from './.vitepress/theme/SeparatorUsageDemo.vue'
</script>
<template><SeparatorUsageDemo /></template>
```

Suggested host data, not a package API:

```ts
type DividerSpec = {
  orientation: 'horizontal' | 'vertical'
  decorative: boolean
  accessibleName?: string
  caption?: string
}
```

Use native hr for a plain thematic break when appropriate. Do not add keyboard handling to a static separator merely to make it feel interactive. Focusable adjustable separators are a different component, with controlled pane size and keyboard support that this example deliberately does not implement.

## States and variants

| State/variant | Behavior |
|---|---|
| Horizontal | Two hairlines with optional caption between content blocks. |
| Vertical | Short line between real local links; caption control disabled. |
| Decorative | Whole divider hidden from accessibility tree; nearby content remains. |
| Semantic | Named role=separator, explicit orientation, no focus or resizing. |
| Empty caption | No visible caption; semantic fallback name remains. |
| Replay/reset | Explicit whole-layout entrance or restore local defaults. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix Separator](/felix/components/atoms#separator) | Horizontal fx-sep div with a span and two CSS pseudo-element lines. Vertical fx-sep-v is a row of Inicio/Envíos/Perfil spans with left borders between items, not three working navigation links. No role, orientation attribute, resize handler or focus behavior is attached. |
| [Felix Marker](/felix/components/atoms#marker) | Separate conversation annotation specimens. A system/date annotation carries meaning beyond a generic visual divider. |

Felix prose names @felix/ui, orientation and label props. Those are design-source usage claims, not verified installed exports here. This original local Vue example adds explicit semantics and actual local anchors without claiming the source spans already provide them or silently changing the gallery.

## Motion, accessibility and checks

Replay layout entrance fades/moves the whole stage 4px over 180ms. Initial display, caption edits and orientation changes do not animate. Reduced motion removes that entrance, leaving structure and text unchanged. Divider lines are never animated continuously or used as progress indicators.

Test both orientations, semantics toggle, explicit orientation/name, absence of focus/resize behavior, caption preservation, literal/empty/long text, actual local link destinations, keyboard navigation, replay versus edits, reset, reduced motion and mobile wrapping. Screen-reader testing should confirm that decorative mode omits the divider and semantic mode does not create a misleading adjustable control.

<style>
@media(max-width:700px){.separator-guide .vp-doc table,.separator-guide .vp-doc tbody,.separator-guide .vp-doc tr,.separator-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.separator-guide .vp-doc thead{display:none}.separator-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.separator-guide .vp-doc td{overflow-wrap:anywhere}.separator-guide .vp-doc tr{margin-bottom:12px}}
</style>
