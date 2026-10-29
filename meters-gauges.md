---
pageClass: meters-gauges-guide
---
<script setup>
import MetersUsageDemo from './.vitepress/theme/MetersUsageDemo.vue'
</script>

# Meters and gauges

A meter shows a measurement within a known range, such as load, temperature or fuel. A gauge is a visual encoding of that range using an arc or needle. Neither implies a process is completing. For task completion and unknown work, use the separate [Progress guide](/progress). Choose a plain number or bar when a dial would make precise comparison harder.

## Try a bounded measurement

<MetersUsageDemo />

Move the native range control through 0–100. Choose arc, needle or both. The decorative SVG dial and the native meter describe the same sample load; text states the value and threshold category. Turn Measurement available off to remove both representations rather than displaying an invented zero. Its last value is retained locally and returns when available is restored. Reset returns to 62%, arc and available. No sensor, CPU, financial account or remote system changes.

## How to use it

1. Define min, max and units from a real measurement contract. Validate that max is greater than min, values are finite and the unit is correct before rendering a gauge.
2. Distinguish measurement from completion. A temperature or load meter is not a progressbar, even when its range is expressed as a percent.
3. State thresholds in text and name their meaning. This example's load cutoffs are illustrative, not universal operating limits or alerts.
4. Make missing data explicit. Unknown/offline is not zero. Decide whether to hide a stale value or retain it with an as-of and stale label.
5. Use a readable number beside the graphic. Color, needle angle and animation should never be the only source of meaning.
6. Avoid misleading animation. The new example updates truthful text immediately and only transitions the decorative dial. It does not count through fictitious measurements.
7. Do not use a gauge as an input. A separate native range control changes this sample; the SVG is a display, not an unlabeled draggable dial.

## New example's actual API

`MetersUsageDemo.vue` has no props or emits. `value` is an integer from the native range input, `mode` is arc/needle/both, and `available` controls whether the measured display exists. The scale is fixed 0–100. Low is below 60, elevated is 60–84 and high is at least 85. `level` supplies that text. Reset restores value/mode/availability. No timers, listeners, subscriptions or external animations are created, so Vue unmount needs no extra cleanup.

The arc uses SVG pathLength=100 and a dasharray of value followed by 100. At zero no fill is drawn; at 100 the full half-circle is drawn. Needle angle is `-90 + value * 1.8` degrees, with endpoints derived from sine/cosine around the center. Min is left, midpoint up, max right. The SVG is decorative/aria-hidden to avoid duplicating the labeled native meter and visible text.

```vue
<script setup>
import MetersUsageDemo from './.vitepress/theme/MetersUsageDemo.vue'
</script>
<template><MetersUsageDemo /></template>
```

A real host data shape could be the following; it is not an implemented public prop API:

```ts
type Measurement = {
  value: number | null
  min: number
  max: number
  unit: string
  asOf: string
  status: 'current' | 'stale' | 'unavailable'
}
```

## Existing Gauge and GaugeLab API

The repository also has `Gauge.vue`, used by `GaugeLab.vue`. They are real Vue components, not a universal installed package. GaugeLab accepts only `theme`, default pulsefit, with lustro/felix/pulsefit/scopecraft/lumen token sets and pulsefit fallback. It renders eight presets plus a playground; no measurement feed or emits exist.

| Gauge prop | Default and effect |
|---|---|
| value/min/max | 50/0/100. Numeric value and scale; geometry clamps value, but displayed text uses the animated raw value. |
| start/end | -135/135 degrees. SVG angular extent; not a validated full-circle API. |
| mode | arc. Arc, needle or both are intended; no enum validation. |
| ticks/labels | 0/empty array. Tick intervals generate ticks+1 marks; label strings distribute evenly across the angles, not at numeric label-derived positions. |
| zones | Empty array. from/to/color entries draw outer arcs and supply first matching inclusive zone color. Boundary overlap resolves by array order. |
| unit/label | Empty strings. Visible unit/caption and figure description. No unit conversion. |
| width/cap/size | 12/round/180. Stroke width, SVG line cap and square size in pixels. |
| decimals | 0. toFixed precision for displayed value; caller must validate. |

GaugeLab starts at value62, min0, max100, start-135/end135, width12, mode both, ticks10, round cap. Its sliders/selects/number inputs update those local refs; Random value uses Math.random within the current range. The eight presets are separately fixed values, not selections that overwrite the playground. Its unused cur/p selection state is not an implemented preset-picker API.

The existing Gauge clamps only angle geometry, not raw numeric text. Out-of-range values can therefore disagree with the needle. It does not validate reversed/equal bounds, NaN, invalid decimals or extreme angles. A zero denominator fallback prevents one division error but does not define a valid equal-bound scale. A nearly full ring preset uses end359.9 because a single SVG arc should not be assumed to draw an exact 360-degree ring. These are caller responsibilities, not guarantees to advertise.

### Existing motion lifecycle limitations

Gauge animates `shown` with Motion spring stiffness90/damping14, first from min on mount and on value changes. It stops a previous animation before starting another and checks reduced motion when each animation starts. The same animated value drives visible text and figure aria-label, so those change through intermediate values. It has no on-unmount animation stop and no reactive matchMedia listener for a preference change mid-animation. This guide does not silently fix or use that lifecycle in its new example. A production wrapper needs validation, current-value text/accessibility and animation cleanup before relying on it for live readings.

## Source coverage

| Source | Actual implementation and limits |
|---|---|
| [Felix gauges](/felix/gauges), [Lumen](/lumen/gauges), [Scopecraft](/scopecraft/gauges), [Lustro](/lustro/gauges), [Pulsefit](/pulsefit/gauges) | Theme variants of shared GaugeLab/Gauge, with local controls, eight presets and no telemetry API. |
| [Felix basic gauge](/felix/components/charts#basic-gauge) | Static 72% SVG with descriptive label; no native meter or controller. |
| [Chart gallery speedometer](/felix/components/charts#mono-speed) and [arc meter](/felix/components/charts#mono-arc) | Fixed 84% sample drawing/readout with local chart gallery exploration. Not live sensors or independently calculated targets. |
| [Progress guide](/progress) | Separate native progress/meter and goal-ring explanation. This guide owns dial/needle/scale-specific guidance rather than a second generic progress issue. |

## States, accessibility and checks

| State | New example behavior |
|---|---|
| Min/mid/max | 0/50/100 positions agree with text, fill and needle. |
| Arc/needle/both | Style changes representation, not value or category. |
| Thresholds | Low below60, elevated60–84, high85+; visible text accompanies native low/high/optimum metadata. Browser-native meter colors can vary. |
| Unavailable | No measured dial or meter; input disabled, stored sample value preserved. |
| Reset | 62%, arc, available. |

Decorative fill/needle transitions last200ms, with no transitions under reduced motion. Native range/select/checkbox/button and labeled meter retain semantics; no fake progressbar or custom drag keyboard model is introduced. Native meter range metadata describes a measurement, not completion or a promise that higher is better. Tests are not screen-reader certification.

Check0/50/59/60/84/85/100 values, needle endpoints/midpoint, arc fill, mode changes, threshold text, native meter value/range/name, unavailable/restore/reset, keyboard range/checkbox use, reduced motion, console errors and narrow layout/source-map readability. Real hosts also need invalid/reversed bounds, nonfinite/negative values, units/precision, stale sources, resizing and animation unmount tests.

<style>
@media(max-width:700px){.meters-gauges-guide .vp-doc table,.meters-gauges-guide .vp-doc tbody,.meters-gauges-guide .vp-doc tr,.meters-gauges-guide .vp-doc td{display:block;width:100%;box-sizing:border-box}.meters-gauges-guide .vp-doc thead{display:none}.meters-gauges-guide .vp-doc td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.meters-gauges-guide .vp-doc td{overflow-wrap:anywhere}.meters-gauges-guide .vp-doc tr{margin-bottom:12px}}
</style>
