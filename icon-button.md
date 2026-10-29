---
pageClass: icon-button-guide
---
<script setup>
import IconButtonUsageDemo from './.vitepress/theme/IconButtonUsageDemo.vue'
</script>

# IconButton

An icon button is a native button with a compact visual symbol and a clear accessible action name. Use it for familiar, repeated actions in a toolbar or card. Prefer a [text button](/buttons) when the action is unfamiliar, risky or hard to recognize. An icon alone is not a label; a tooltip is not a substitute for an accessible name.

## Try a named toggle action

<IconButtonUsageDemo />

The bookmark toggles one fictitious saved state. Five visual variants and three control sizes do not change what the action does. Disable example action prevents activation; Reset clears the state, count and controls. The nearby action description makes the meaning visible even when the icon font cannot load. No account or server changes.

## How to use it

1. Use a button for an action and an anchor for navigation. Set type=button inside forms unless submitting is intentional.
2. Give the button a concise action name through visible text, aria-label or aria-labelledby. Hide a decorative icon from assistive technology so its font name is not announced.
3. Distinguish a toggle from a one-shot action. This demo keeps the stable name Save example item and exposes saved state through aria-pressed; an ordinary Edit or Delete button should not receive aria-pressed.
4. Keep the target usable even if the symbol is small. This example uses 44/48/56px targets with distinct focus outlines, not the source's exact dimensions.
5. Disable real unavailable actions with native disabled, and explain why nearby. Do not rely on a muted color or a click handler alone.
6. Do not treat danger color as confirmation or permission. A real destructive action needs its own label, scope, authority and appropriate confirmation/undo flow.

## Anatomy and actual API

`IconButtonUsageDemo.vue` has no props or emits. Local refs are `variant` (primary/secondary/ghost/line/danger), `size` (sm/md/lg), `disabled`, `saved` and `activations`. `toggle()` guards disabled state, flips saved and increments accepted activations. Reset restores primary/md/enabled/not-saved/zero. There are no timers, requests, listeners or persisted settings to clean up.

The native button has type=button, a stable aria-label, aria-pressed and a supplemental title. Its Font Awesome bookmark is aria-hidden; the visible action explanation sits alongside the control. One status paragraph describes local state and accepted activations. Native disabled removes the action from normal keyboard focus; the checkbox and Reset remain available.

```vue
<script setup>
import IconButtonUsageDemo from './.vitepress/theme/IconButtonUsageDemo.vue'
</script>
<template><IconButtonUsageDemo /></template>
```

Suggested host contract, not a verified package export:

```ts
type IconAction = {
  id: string
  label: string
  icon: string
  disabled: boolean
  pressed?: boolean // only for a toggle action
  onActivate: () => void
}
```

A production action owns permission checks, request state and errors separately. If it starts async work, prevent duplicates, expose meaningful status and preserve a recovery route. Do not assume that a successful click, pressed styling or an icon change proves a server write occurred.

## States and visual variants

| State/variant | Behavior |
|---|---|
| Default | Named, enabled bookmark toggle. |
| Pressed | aria-pressed=true, filled bookmark and local saved text. |
| Disabled | Native disabled plus guard, no accepted activations. |
| Keyboard focus | Visible outline; Enter and Space activate the enabled native button. |
| Primary/secondary/ghost/line/danger | Local presentation only; all keep the same action name and toggle meaning. |
| sm/md/lg | Local 44/48/56px target, 16/18/22px glyph. |
| Reset | Restores initial controls and zero accepted activations. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix IconButton](/felix/components/atoms#iconbutton) | Native type=button specimens with aria-label and aria-hidden Font Awesome pen/trash icons. Five visual variants and sm/md/lg classes are shown. These specimens have no edit/delete handler, toggle state or disabled example; their labels do not establish working account actions. |
| [Felix Button](/felix/components/atoms#button) | Related visual button classes. Shared styling does not prove a shared installed API or action controller. |
| [Buttons guide](/buttons) | General action, disabled and local interaction guidance. This guide focuses on icon-only naming, target size and toggle semantics. |

Felix prose names @felix/ui, icon, variant and size props. Those are design-source usage claims, not verified installed exports in this repository. This demo is an isolated original Vue teaching implementation. It does not silently add handlers to source specimens or reproduce their exact CSS size/brand tokens.

## Motion, accessibility and checks

The enabled button lifts 2px on hover and scales to .95 while pressed, with a 150ms transition. The bookmark switches state without a looping animation. Reduced motion removes transitions and transforms; pressed state and status remain. Keyboard users get focus indication without needing hover. A title may be helpful on pointer hover, but the stable accessible name and visible explanation do not depend on it.

Test all variants and sizes, repeated toggle clicks, accurate aria-pressed, disabled guard, reset, Enter/Space activation, visible focus, reduced motion and mobile wrapping. Test with the icon font unavailable: the control must keep its name and the surrounding description must remain readable. A real destructive action must never be inferred from this non-destructive color preview.

<style>
@media(max-width:700px){.icon-button-guide .vp-doc table,.icon-button-guide .vp-doc tbody,.icon-button-guide .vp-doc tr,.icon-button-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.icon-button-guide .vp-doc thead{display:none}.icon-button-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.icon-button-guide .vp-doc td{overflow-wrap:anywhere}.icon-button-guide .vp-doc tr{margin-bottom:12px}}
</style>
