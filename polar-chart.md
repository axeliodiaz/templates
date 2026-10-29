---
pageClass: polar-chart-guide
---
<script setup>
import PolarChartUsageDemo from './.vitepress/theme/PolarChartUsageDemo.vue'
</script>

# Polar chart

A polar chart maps observations around a center. In a polar bar or rose chart, angular position identifies a direction/category and radial length or sector area encodes value. Choose it when cyclic or directional structure matters. Use ordinary bars for easier magnitude comparison across unrelated categories, a radar polygon for profiles across axes, or progress rings for independent completion fractions. Those encodings are not interchangeable.

## Try radial length versus area

<PolarChartUsageDemo />

Switch A/B/All zero, select a direction and change Radius-linear/Area-linear. Category order and values stay fixed; radial mapping and matching grid rings change. Equal64-degree sectors leave26-degree gaps. Radius-linear uses radius proportional to value, so area grows quadratically. Area-linear uses square-root radius, so equal-angle sector area is proportional to value. Zero contributes no sector area; a center presence dot is not positive magnitude. Loading/Empty withhold graph/table; Ready restores choices. Reset returns A, North, Radius-linear and ready. No request or record changes.

## How to use it

1. Decide what angle means. These four labels have directional positions; this is not a timestamp parser, wind model or bearing sensor.
2. Keep category angles and widths stable. This fixture places North/East/South/West at0/90/180/270 degrees clockwise from up, each64 degrees wide. Width never changes with value.
3. State whether radius or area encodes magnitude. A radius-linear sector with twice the value has four times the area. Do not call it area-proportional without the square-root mapping.
4. Keep zero at the center and a common domain. Both mappings use values0–100 and maximum radius80. Grid radii must follow the same mapping as marks.
5. Avoid long labels, many slices and unnecessary overlap. A bar chart often communicates exact comparisons better.
6. Preserve missing versus zero and negative policy. This nonnegative controller does not implement missing directions or signed inward/outward bars.
7. Supply exact values and keyboard selection outside SVG; touch and keyboard should not require hovering a wedge.

## Anatomy and actual API

`PolarChartUsageDemo.vue` exposes no props or emits. Refs are `dataset`, `state`, `selected` and `encoding`. Values are A25/50/75/100, B80/60/40/20 or four zeros. `radius(v)` is0.8v for radius mode or80√(v/100) for area mode. No data/angle/domain adapter is implemented.

The320×240 SVG centers on160,115. A point at angle a is(160+r cos(a−90°),115+r sin(a−90°)). Each sector runs from center to its start point at90i−32°, follows a clockwise64° circular arc and closes to center. Rings use the same radius function for25/50/75/100. All-zero renders no sector paths, only center dots, exact zeros and zero radii in text/table. Selection changes sector opacity/outline, never magnitude or angular order.

```vue
<script setup>
import PolarChartUsageDemo from './.vitepress/theme/PolarChartUsageDemo.vue'
</script>
<template><PolarChartUsageDemo /></template>
```

A possible host shape, not implemented props:

```ts
type PolarItem = { id: string; label: string; angle: number; value: number | null }
type PolarSeries = {
  unit: string; maximum: number; encoding: 'radius' | 'area'; items: PolarItem[]
}
```

Validate finite nonnegative values, positive maximum, stable IDs and unambiguous angles. Define angular units, orientation, category bandwidth and wraparound. Do not silently clamp values or replace null with zero. Variable-width sectors require a different area calculation; the square-root formula here assumes equal widths. Keep selected IDs through sorting/filtering. Long labels, many sectors, signed values and arbitrary domains are outside this fixture.

Native direction buttons select on focus or activation and expose pressed state. Dataset/encoding/state changes retain selection because category identity is fixed. Readout/table and SVG share the radius function and values. No timer, request, listener, subscription or external animation handle exists.

## Source coverage and actual gallery behavior

| Source | Actual implementation and limits |
|---|---|
| [Lustro gallery](/graphs), [Felix charts](/felix/components/charts) | Card named Polar radial pillars actually shares the concentric progress-ring branch. |
| [Lumen](/lumen/charts), [Scopecraft](/scopecraft/charts), [PulseFit](/pulsefit/charts), [Pawprint](/pawprint/charts) | Shared-gallery theme wrappers, not independent polar data APIs. |
| [Bar chart](/bar-chart), [Dumbbell chart](/dumbbell-chart) | Cartesian magnitudes or paired values rather than angular sectors. |

ChartGallery declares only `language` String default lustro and renders the whole gallery. There is no polar-only, angle, values, encoding, maximum or selected-direction prop and no selection emit. A/B and Ready/Loading/Empty are gallery-global.

Despite the card description saying pillars radiate from center, native `polar` enters the same branch as `rings`: three concentric circular tracks centered160,100, radii76/59/42, width10. Arc fraction is v/100 with full circumference2πr and−90° rotation. A uses35/48/41 and B42/36/55 from the first three primary values; readout calls them Ring1/2/3 percentages. These are completion arcs, not directional wedge lengths or areas. Do not infer a rose-chart API from the card name.

Native focus/mouseenter groups and Item1/2/3 buttons select a ring. Readout names ring/value; selection persists with no mouseleave reset. There is no native radial/area toggle or directional dataset. This guide deliberately adds a separate original polar-sector controller, exact table and zero fixture, not a claim that the native card already has those controls.

Manual Loading/Empty are global demonstration states, not requests; Show sample data restores ready. Shared Motion mounts on cards, refreshes after dataset/state and destroys on unmount. CSS transitions are separate. Theme wrappers do not imply an installed chart package or a universal data API.

## States, motion and accessibility

| State/part | New example behavior |
|---|---|
| A/B/zero | Values, sectors, exact text and table update together on fixed0–100. |
| Radius/area | Same values/angles; grid and radius mapping change together. |
| Selected direction | One pressed button, stronger sector outline and exact status. |
| Loading/empty/reset | Values withheld/recovered; reset A/North/radius/ready. |

SVG entrance fades over200ms when dataset/encoding remounts; reduced motion removes it. Values do not animate through fabricated observations. Angular labels, outlines, readout and exact table supplement color. SVG describes the encoding; native controls handle keyboard input. This is not screen-reader certification.

Check A/B/zero table/readout, exact radii/sector paths in both encodings, equal widths and fixed angular order, mapped grid rings, no zero-area paths, selection retention, focus/Enter/Space, loading/empty/recovery/reset, reduced motion, chart/labels/table/source-map readability, actual filesystem body routes, overflow and console errors. A real adapter needs missing/nonfinite/signed values, variable bandwidth, wraparound, long labels, many items, duplicate IDs and stale/error cases.

<style>
@media(max-width:700px){.polar-chart-guide .vp-doc table:not(.plusage-data),.polar-chart-guide .vp-doc table:not(.plusage-data) tbody,.polar-chart-guide .vp-doc table:not(.plusage-data) tr,.polar-chart-guide .vp-doc table:not(.plusage-data) td{display:block;width:100%;box-sizing:border-box}.polar-chart-guide .vp-doc table:not(.plusage-data) thead{display:none}.polar-chart-guide .vp-doc table:not(.plusage-data) td:first-child{font-weight:650;background:var(--vp-c-bg-soft)}.polar-chart-guide .vp-doc table:not(.plusage-data) td{overflow-wrap:anywhere}.polar-chart-guide .vp-doc table:not(.plusage-data) tr{margin-bottom:12px}}
</style>
