---
pageClass: popover-guide
---
<script setup>
import PopoverUsageDemo from './.vitepress/theme/PopoverUsageDemo.vue'
</script>

# Popovers

A popover is a small anchored surface opened by a deliberate action. Unlike a tooltip it can contain buttons or other interactive content. Use it for secondary detail, a compact choice or a short contextual task. Use a modal when background interaction must stop, and an inline disclosure when the content belongs in the reading flow.

## Try an interactive note

Choose top or bottom, then open the fictitious workspace note. Close starts focused. Close or Acknowledge returns to the opener. Escape and outside click use the browser's auto-popover dismissal; an outside click does not steal focus back from the control you clicked. Background controls stay interactive, Tab is not trapped, and Acknowledge changes local feedback only. There is no save, transfer or message.

<PopoverUsageDemo />

## How to use it

1. **Use a real trigger.** Give it a visible name, expanded state, controls relationship and the right popup type. This example contains actions, so it uses a named nonmodal dialog, not role=tooltip or a menu.
2. **Choose focus deliberately.** This guide focuses Close on open. A form might focus its first field instead. Keep a logical route back without trapping users in a nonmodal panel.
3. **Make dismissal predictable.** Native auto popover handles outside clicks and Escape here. Close and completion explicitly return focus. Do not apply this light-dismiss policy to unsaved work without a discard plan.
4. **Keep the surface anchored and bounded.** Placement is a preference; measure, flip and clamp near viewport edges. The top layer avoids ordinary stacking clipping but is not a positioning engine.
5. **Keep the task small.** Move long forms, multi-step flows and required instructions to an appropriate surface. A popover should not hide the only path to an essential action.

## Anatomy

| Part | Purpose |
|---|---|
| Trigger | Native popovertarget button, expanded/controls state. |
| Surface | popover=auto in the browser top layer, nonmodal dialog role. |
| Title | Visible heading used by aria-labelledby. |
| Close | Autofocus and explicit focus return. |
| Body/action | Fictitious note and local-only acknowledgement. |
| Outside target | Demonstrates that background interaction is not blocked. |

## Actual data and API

`PopoverUsageDemo.vue` exposes no props or emits. `panel` and `trigger` are element refs. `opened` follows the native toggle event's newState. `placement` starts at `'bottom'` with `'top'` as the other preference. `position` stores fixed left/top pixels. `notice` is local feedback.

The trigger's native popovertarget toggles `popover-guide-panel`. `sync()` updates expanded state and calls `locate()` after rendering. The position function uses the trigger/surface rectangles, an 8px gap and 12px viewport margin; it tries the other vertical side before clamping. Resize and capture-phase scroll remeasure. `close()` calls hidePopover and restores trigger focus. `acknowledge()` updates feedback and closes. Unmount hides the panel and removes listeners. There is no network, storage or installed Popover package.

```vue
<script setup>
import PopoverUsageDemo from './.vitepress/theme/PopoverUsageDemo.vue'
</script>
<template><PopoverUsageDemo /></template>
```

A host might supply `{ id: string, title: string, body: string, preferredSide: 'top' | 'bottom' }`. This is suggested integration data, not this component's prop contract. Generate unique trigger/panel/title IDs for multiple instances. Native Popover API support is required for this example; supply an intentional inline disclosure fallback for older browsers rather than showing an unpositioned imitation. This is a small viewport-aware positioner, not a full nested-overlay/RTL library.

## States and variants

- **Closed/open:** native popover visibility and toggle-driven expanded state.
- **Top/bottom:** requested placement, flipped or clamped when space is limited.
- **Interactive:** Close and Acknowledge, without modal focus trapping.
- **Light dismiss:** outside pointer activation and Escape through popover=auto.
- **Local completion:** acknowledgement string changes, panel closes, nothing persists.
- **Form/loading/error:** not simulated. Keep work on recoverable errors, show status truthfully and define dismissal before allowing edits.
- **Manual or nested popovers:** not implemented; choose their dismissal and focus contracts separately.

## Template coverage and real behavior

| Source | Actual implementation |
|---|---|
| [Lustro UI kit](/ui-kit#popovers) | ComponentCatalog native details/summary with an adjacent .l-menu.l-popover text panel. It is a disclosure, not this guide's top-layer popover. |
| [Components](/components#popovers), [Lustro guide](/lustro/guide-components#popovers) | Native details/summary; click, Enter or Space toggles. Do not infer native Popover API focus/dismissal from similar styling. |
| [Lustro expanded](/lustro/components-more#popovers), [Felix expanded](/felix/components-more#popovers), [Scopecraft expanded](/scopecraft/components-more#popovers) | Already-visible .pop specimens, with and without header. Shared bsx click toggles dim styling, not a floating interactive controller. |
| [Lumen expanded](/lumen/components-more#popovers) | Gallery iframe contains visible popover-style cards, not a native auto-popover trigger in this section. |
| [Felix molecule](/felix/components/molecules#popover) | Native details.fx-menu/summary with a sample exchange-rate .fx-pop. The rate is fixed sample text, not live financial data. |
| StudioCatalog / StudioExtended | Catalog has a local menu boolean rendering action buttons that close and set local notice; Extended includes a native details disclosure. Do not treat them as one universal Popover API. |

Felix's prose names Popover, PopoverTrigger and PopoverContent from `@felix/ui`. Those are design-source names, not verified package exports in this repository. Existing disclosure handlers/styles and this guide's native controller are separate paths. Inspect the source you actually reuse and test its outside/Escape policy rather than borrowing guarantees from this page.

## Motion and accessibility

This guide uses a 160ms opacity/4px entrance, removed for reduced motion. Focus begins independently of the animation. The panel is named, nonmodal and scrollable; it must not declare aria-modal or make the background inert. Top-layer presentation alone does not give it dialog semantics.

Test trigger click/Enter/Space, initial focus, Tab out, Escape, Close, outside dismissal, focus return and local completion. Test actual placement after scroll/resize on mobile, text wrapping and visible focus rings. Verify native Popover API behavior in your supported browsers and assistive technology; automated interaction tests do not certify every screen reader. If content is a menu, use its complete menu keyboard pattern instead of mislabeling arbitrary buttons.

## Integration notes

Keep selected record, visibility and server state separate. Sanitize external content, use scoped IDs and preserve draft/error state if adding a form. Do not let opening the panel perform the real action. Remove listeners and close the surface on unmount. All content and actions here are fictitious and local.

<style>
@media(max-width:700px){.popover-guide .vp-doc table,.popover-guide .vp-doc tbody,.popover-guide .vp-doc tr,.popover-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.popover-guide .vp-doc thead{display:none}.popover-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.popover-guide .vp-doc td{overflow-wrap:anywhere}.popover-guide .vp-doc tr{margin-bottom:12px}}
</style>
