---
pageClass: steps-keys-guide
---
<script setup>
import StepsKeysUsageDemo from './.vitepress/theme/StepsKeysUsageDemo.vue'
</script>

# Steps and keyboard keys

A step indicator shows position in a finite sequence. It does not prove validation, saving or completion. Keyboard key styling shows what to press; drawing a keycap does not register a shortcut. Keep these two patterns separate in behavior even when they share a specimen section.

## Try step layouts and key notation

<StepsKeysUsageDemo />

Details starts current, with Review and Complete upcoming. Continue and Back move within the three local sample positions. Earlier positions are labelled Completed in sample, never real completed work. Back is disabled at the first position, Continue at the last. Layout can be horizontal with wrapping or vertical; it does not change current state. Reset restores the first position and horizontal layout. All data is fictitious. No form, validation, navigation or server effect exists.

## How to use it

1. Give each step a meaningful name. Use an ordered list and aria-current=step for the current item; use visible text for completed/current/upcoming states.
2. Decide whether progress is informational or navigable. This guide's list is informational. Only Back and Continue change the sample, not clicking a step label.
3. Enforce required validation in the host before advancing. A checked marker is not a validation engine or authorization to skip work.
4. Keep focus reachable at boundaries. Here reaching the first/last position moves focus to Step layout because the activated boundary button becomes disabled.
5. Use native kbd elements for key names. Give shortcut notation nearby text and a platform-aware alternative where needed.
6. Implement shortcuts separately with clear scope, conflict handling and cleanup. This sample registers none; Ctrl+K and Command+K are notation only.

## Anatomy and actual API

`StepsKeysUsageDemo.vue` has no props or emits. `steps` is the fixed string array Details/Review/Complete. `current` starts zero, `variant` horizontal. `move(delta)` changes the current index; the disabled native buttons prevent moving beyond the fixed bounds. At a boundary it focuses the layout select after the DOM update. `reset()` restores defaults. The list labels earlier indices done, the current one active and later ones upcoming. The decorative number/check is aria-hidden because visible state text explains the meaning.

```vue
<script setup>
import StepsKeysUsageDemo from './.vitepress/theme/StepsKeysUsageDemo.vue'
</script>
<template><StepsKeysUsageDemo /></template>
```

The kbd content is static markup. No keydown listeners, timers, requests or storage exist, so unmount needs no cleanup. The only keyboard behavior is native buttons/select. Suggested host data is `{ steps: { id, label, status }[], currentId, canAdvance }`; status could include error or skipped when the actual workflow supports it. Those are integration suggestions, not repository package exports. Use stable IDs and clamp state when steps change.

## States and variants

| State | Actual behavior |
|---|---|
| Current | One aria-current=step and explicit Current sample step text. |
| Completed in sample | Earlier index with decorative check, not proof of real completion. |
| Upcoming | Later index, no click navigation. |
| First/last | One boundary button disabled; focus returns to layout select after reaching that boundary. |
| Horizontal/vertical | Wrapping row or stacked list, same state model. |
| Keyboard notation | Static kbd labels for native Tab/Enter/Space and example Ctrl/Command+K. |
| Error/skipped/loading | Not simulated. Add honest state and recovery to a real host workflow. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Lustro expanded](/lustro/components-more#steps-and-keyboard-keys), [Felix expanded](/felix/components-more#steps-and-keyboard-keys), [Scopecraft expanded](/scopecraft/components-more#steps-and-keyboard-keys) | Static step spans start Account done, Details current, Review upcoming. bsx-live delegated click changes done/cur classes and number/check markup. It is a visual selector, not this guide's ordered-list/button keyboard contract or a validated form flow. Keycaps use styled spans. |
| [Lumen expanded](/lumen/components-more#steps-and-keyboard-keys) | Separate linked gallery specimen. Do not infer this guide's navigation or keyboard behavior from the matching section title. |

The source's Ctrl+K to search caption does not by itself establish a keyboard listener. This guide does not claim that shortcut exists. A Stepper family may also appear elsewhere in the catalogs; this page covers the expanded-set Steps and keyboard keys specimen without renaming all step workflows into one installed API.

## Motion, accessibility and integration

State background/border changes transition over 160ms. Reduced motion removes those transitions. No moving progress line, loading pulse or focus animation is required. Native Enter/Space activates the focused button; Tab moves normally. No arrow shortcuts or global key bindings are added. The current sample position is announced through one role=status.

Test boundaries, state labels, current attribute, Back/Continue, reset, layout switch, keyboard focus at boundaries, keycap semantics and narrow wrapping. If adding shortcuts, avoid editable fields and reserved browser commands, document actual scope, remove listeners on unmount and do not use a decorative keycap as evidence that a command runs. Keep server validation, save outcomes and navigation independent from visual progress.

<style>
@media(max-width:700px){.steps-keys-guide .vp-doc table,.steps-keys-guide .vp-doc tbody,.steps-keys-guide .vp-doc tr,.steps-keys-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.steps-keys-guide .vp-doc thead{display:none}.steps-keys-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.steps-keys-guide .vp-doc td{overflow-wrap:anywhere}.steps-keys-guide .vp-doc tr{margin-bottom:12px}}
</style>
