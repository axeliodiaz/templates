---
pageClass: felix-scoped-guide
---
<script setup>
import FelixJsonChart from '../../.vitepress/theme/FelixJsonChart.vue'
import chartExamples from '../../.vitepress/theme/felix-chart-examples.json'
</script>

# Polar chart

[Back to Felix charts](/felix/components/charts) · [JSON chart contract](/felix/components/chart-json)

A polar chart maps observations around a center. In a polar bar or rose chart, angular position identifies a direction/category and radial length or sector area encodes value. Choose it when cyclic or directional structure matters. Use ordinary bars for easier magnitude comparison across unrelated categories, a radar polygon for profiles across axes, or progress rings for independent completion fractions. Those encodings are not interchangeable.

## Preview, spec and editable example

<FelixJsonChart :spec="chartExamples.examples['polar']" :sources="chartExamples.sources" />

The preview is rendered from the JSON in **Spec**. Open **Example** to edit the component, source, encoding and options, then choose **Render JSON**. The source registry is separately editable so you can try your own labels and values without embedding numbers in the chart spec. Nothing is sent, saved or fetched. Invalid input reports a field path and keeps the last valid preview.

## Wire contract

This example selects `felix-polar`. The spec uses `component`, optional `title`, `subtitle` and `insight`, a named `data.source`, `encoding` and component-specific `options`. Data filters, stable sorting and limits are applied before rendering. The source holds `headers` and `rows`; every encoding names a real source column.

```json
{
  "component": "felix-polar",
  "title": "Polar",
  "subtitle": "Fictitious local data",
  "data": {
    "source": "sample.polar"
  },
  "encoding": {
    "category": "Category",
    "value": "Value"
  },
  "options": {}
}
```

### Encoding

| Channel | Source column |
| --- | --- |
| `category` | `Category` |
| `value` | `Value` |

### Options

This Felix extension supports `highlight`, `max`, `unit`, `currentPeriod`, `weights` and `polarEncoding` where meaningful to the selected renderer. Unused controls are not an implied API.

## Data, interaction and accessibility

Hover, focus, click, Enter or Space on a mark to read its exact source row. **Data view** shows the same filtered and sorted source rows in a scrollable table. **Replay motion** replays the entrance; reduced motion removes it. Ready/Loading/Empty are local demonstration states only and never invent a network result. The controls and spec tabs support keyboard use, including Left/Right, Home and End in the tab list.

Felix chart colors adapt to light and dark appearance. Turquoise leads; slate supports the comparison. Highlight names, labels, a focus outline and the exact data remain available without relying only on color. Sources are local and bounded to 2,000 rows. Unknown components, sources, fields and options fail visibly. There is no HTML, JavaScript or remote URL execution in a spec.

## Integration

```vue
<script setup>
import FelixJsonChart from './FelixJsonChart.vue'
const spec = /* validated chart spec from your application */ {}
const sources = /* named local source registry */ {}
</script>

<template>
  <FelixJsonChart :spec="spec" :sources="sources" />
</template>
```

`resolveSpec(spec, sources)` validates and resolves a chart model; `chartGeometry(model)` derives marks from that model. The documentation wrapper owns editor drafts and the last valid preview. Your application owns data fetching, authorization, refresh/error state and persistence. This local example is not a live data service. See the [contract and supported renderers](/felix/components/chart-json) before adapting production data.
