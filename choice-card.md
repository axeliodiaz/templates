---
pageClass: choice-card-guide
---
<script setup>
import ChoiceCardUsageDemo from './.vitepress/theme/ChoiceCardUsageDemo.vue'
</script>

# Choice card

A choice card is a radio option with room for a title and description. Use it for a small set of mutually exclusive choices that need explanation. Use checkboxes for independent choices, not a radio group disguised as multi-select. Avoid card grids for long lists.

## Try selection and unavailable options

<ChoiceCardUsageDemo />

Weekly starts selected. Click either available card, or focus a radio and use native arrow keys. Instant updates is disabled and cannot become selected. Reset to weekly restores the initial value. The status shows only local state; this demo does not change notification settings.

## How to use it

1. Put related native radios inside a fieldset with a meaningful legend.
2. Give every radio in that group the same name and a distinct value. Keep other instances in separate groups; this demo uses Vue useId for its group name.
3. Wrap each radio and its text in one label for a large click target. Do not put links or buttons inside that label.
4. Bind the selected value to one source of truth. Reflect selection with the native checked state, a border and text, not color alone.
5. Explain why an option is unavailable. Disabled options remain visible but cannot be selected or receive normal keyboard focus.
6. Separate selecting from committing a setting or purchase. Add explicit review/confirmation when the host action needs it.

## Anatomy and actual API

`ChoiceCardUsageDemo.vue` has no props or emits. `options` is a fixed array of `{ value, title, description, disabled }`; `selected` is a local string initialized to weekly. Native v-model updates it. `reset()` restores weekly. The generated name isolates multiple mounted groups. There are no listeners on document, timers or subscriptions to clean up.

```vue
<script setup>
import ChoiceCardUsageDemo from './.vitepress/theme/ChoiceCardUsageDemo.vue'
</script>
<template><ChoiceCardUsageDemo /></template>
```

Suggested host contract, not an installed component export:

```ts
type ChoiceOption = {
  value: string
  title: string
  description: string
  disabled?: boolean
}
// selected: string | null, changed by a native radio group
```

Validate a saved value against the current enabled options. Decide explicitly whether no initial choice is allowed. A disabled option becoming unavailable after selection needs a host policy; do not silently keep an invalid purchase choice.

## States and variants

| State | Demo behavior |
|---|---|
| Selected | Checked radio, accented surface/border and Selected text. |
| Unselected | Available native radio; card click selects it. |
| Focus | Visible outline around the containing card. |
| Disabled | Native disabled input plus Unavailable text and muted surface. |
| Reset | Returns to weekly; no server reset. |
| Empty/error/loading | Not simulated. Add these only with the host's validation and loading rules. |

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [UI kit](/ui-kit#choice-card), [Lustro guide](/lustro/guide-components#choice-card) | Two labeled native radios, weekly initially checked, with fixed name delivery. Browser provides exclusivity and keyboard behavior; no bound state or setting-save handler. Instance-scope the name when reusing this markup. |
| [Felix molecules](/felix/components/molecules#choicecard) | Two buttons styled as cards. Delegated click removes on from peers and adds it to the clicked card. It does not implement native radios, aria-checked, a radio keyboard pattern or a value-change event. |

Felix prose describes ChoiceCardGroup/ChoiceCard package props, but the preview enhancer only establishes local class changes. This guide demonstrates native semantics rather than claiming those exports exist here.

## Motion, accessibility and checks

Card border/background changes take 160ms; press settles 1px and the selected marker fades/moves 2px over 160ms. Reduced motion removes these effects. No animated layout or delayed state commit occurs. Native radios retain Tab, arrows and Space behavior; the whole label is a pointer target. The status is polite, and selection text remains visible without relying on animation.

Test card-label selection, one checked value, arrows across enabled radios, disabled skipping, Space, reset, isolated group names, focus visibility, reduced motion, long descriptions and mobile layout. Check your target browsers and assistive technology before using a custom radio implementation. No local demo state proves a notification preference was saved.

<style>
@media(max-width:700px){.choice-card-guide .vp-doc table,.choice-card-guide .vp-doc tbody,.choice-card-guide .vp-doc tr,.choice-card-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.choice-card-guide .vp-doc thead{display:none}.choice-card-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.choice-card-guide .vp-doc td{overflow-wrap:anywhere}.choice-card-guide .vp-doc tr{margin-bottom:12px}}
</style>
