---
pageClass: range-guide
---
<script setup>
import RangeUsageDemo from './.vitepress/theme/RangeUsageDemo.vue'
</script>

# Range slider

A range slider chooses a bounded numeric value. Use it for an approximate setting such as a threshold, where the allowed range and step are clear. For exact amounts, dates or long numeric entry, prefer an explicit input or pair the slider with one. Dragging is not the only supported interaction.

## Try a local threshold

Move the fictitious threshold between 10 and 90 percent in steps of 5. The visible value follows the native input. Disable it with the checkbox or reset to 40%. This changes local preview state only. Nothing is sent or saved.

<RangeUsageDemo />

## How to use it

1. **Define the unit and limits.** Label both what changes and its unit. Choose min/max from real constraints, not arbitrary visual endpoints.
2. **Set a useful step.** Each keyboard or pointer adjustment should match a meaningful increment. Avoid invisible rounding surprises.
3. **Show the value in text.** Position is not a precise value or an accessible label. Keep a visible current value without requiring a tooltip.
4. **Preserve native keyboard behavior.** Use input type range unless a custom multi-thumb widget is genuinely needed and fully tested.
5. **Separate preview from commit.** Moving a thumb should not silently spend, save or trigger expensive requests. Explain when a real setting applies.
6. **Test extremes and disabled state.** Keep the value valid when limits change. Explain why a control is unavailable and provide a recovery route.

## Anatomy

| Part | Purpose |
|---|---|
| Label | Names the setting and unit. |
| Track | Shows the available interval, not an independent data series. |
| Thumb | Native focusable value control. |
| Current value | Readable value with units. |
| Helper text | Bounds, step and any consequence or constraint. |
| Disabled/reset controls | Demonstrate unavailability and safe local recovery. |

## Data shape

`RangeUsageDemo.vue` has no props or emits. Actual refs:

```ts
// value: number = 40
// disabled: boolean = false
// native attributes: min=10, max=90, step=5
```

`v-model.number` keeps the local ref numeric. The disable checkbox binds to the input's actual disabled property. Reset sets the value to 40 and re-enables the slider. No save request, timer, persistence, animation loop or custom pointer handling exists.

A suggested application model is:

```ts
type RangeSetting = {
  min: number; max: number; step: number; value: number
  unit: string; disabled?: boolean
}
// Require min < max, step > 0 and a value within the allowed step grid.
```

This is not a universal slider prop API in the catalogs. Validate limits and values again on the server before applying a real setting.

## Usage

```vue
<script setup>
import { ref } from 'vue'
const threshold = ref(40)
</script>
<template>
  <label for="threshold">Threshold: {{ threshold }}%</label>
  <input id="threshold" v-model.number="threshold" type="range"
    min="10" max="90" step="5" aria-describedby="threshold-help">
  <p id="threshold-help">10 to 90 percent in steps of 5.</p>
</template>
```

Scope IDs per instance. Native range controls already expose slider semantics and their numeric limits; do not add contradictory ARIA values. Supply `aria-valuetext` only when the raw number needs a different meaningful spoken representation. If pairing a number field, use one validated source of truth for both controls.

## States and variants

- **Default/current:** visible value matches the native input and its unit.
- **Minimum / maximum:** thumb stops at the bounds. Do not suggest values outside them through labels or formatted output.
- **Step:** this demo uses 5; a real value must lie on the permitted increment grid.
- **Disabled:** native input cannot be changed. The guide's checkbox explains the disabled state; Reset re-enables it.
- **Focus:** keep a visible outline and native keyboard operation. Do not replace it with a decorative thumb lacking focus.
- **Range / two thumbs:** requires two values, ordering constraints, names for both thumbs and collision behavior. Two unrelated native inputs do not automatically form a complete range widget. This demo is single-value only.
- **Pending / failed save:** keep preview separate from confirmed value and support retry/rollback. No pending save exists here.

## Template map

| Surface | Actual implementation |
|---|---|
| Lustro expanded | [Range](/lustro/components-more#range): fixed `.rng` div specimens at 20%, 50% and 85%. Their b/s track/thumb elements are not native interactive sliders. |
| Felix expanded | [Range](/felix/components-more#range): corresponding visual specimens scoped to Felix. |
| Lumen expanded | [Range](/lumen/components-more#range): link to bundled gallery specimens. |
| Scopecraft expanded | [Range](/scopecraft/components-more#range): corresponding scoped fixed visual examples. |
| Felix atoms | [Slider](/felix/components/atoms#slider): native single input and two separate minimum/maximum input specimens. Design-source package prose is not an installed shared API or proof of linked ordering behavior. |
| Lustro base | [UI kit](/ui-kit#forms), [components](/components#forms), [guide](/lustro/guide-components#forms): general form context. |
| Studio catalogs | [Relay](/relay/components), [Folio](/folio/components), [Pace](/pace/components), [Spark](/spark/components): native threshold 0..100 shares its range state with progress examples. |
| Bastion | [Choices](/bastion/components#choices): native threshold 10..90 with a linked local progress preview. |

## Motion and accessibility

The guide transitions disabled opacity for 120ms; reduced motion removes it. The thumb's value stays native and immediate, without a lagging animation. No motion is needed to read the current percentage.

Tab reaches the enabled slider; arrow keys adjust by its native step, Home/End reach bounds on supporting browsers. Test the target platform's behavior rather than overriding it. Use readable units, help, focus and enough vertical space for touch. Avoid a live region that speaks every drag tick; the native slider already announces value changes.

## Integration notes

Import `RangeUsageDemo.vue` for this exact sample. Preserve each template's scoped slider styles. If a real app saves changes, debounce or commit deliberately, ignore stale responses and display confirmed state accurately. Server validation must enforce allowed values and permissions. All guide values are fictitious local previews.

<style>
.range-guide .vp-doc table { width:100%; table-layout:fixed }
.range-guide .vp-doc td, .range-guide .vp-doc th { overflow-wrap:anywhere }
@media(max-width:640px) {
  .range-guide .vp-doc table, .range-guide .vp-doc tbody, .range-guide .vp-doc tr, .range-guide .vp-doc td { display:block; width:100% }
  .range-guide .vp-doc thead { display:none }
  .range-guide .vp-doc tr { margin:12px 0; border:1px solid var(--vp-c-divider) }
  .range-guide .vp-doc td { border:0 }
  .range-guide .vp-doc td:first-child { font-weight:700; padding-bottom:4px }
  .range-guide .vp-doc td + td { padding-top:4px }
}
</style>
