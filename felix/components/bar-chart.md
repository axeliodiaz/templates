---
pageClass: felix-scoped-guide
---
<script setup>
import FelixJsonChart from '../../.vitepress/theme/FelixJsonChart.vue'
import chartExamples from '../../.vitepress/theme/felix-chart-examples.json'
</script>

# Bar chart

[Back to Felix charts](/felix/components/charts) · [JSON chart contract](/felix/components/chart-json)

A bar chart compares magnitudes using length from a common baseline. Use rows for long category names or columns for a short ordered sequence. Start magnitude bars at zero; cropping the baseline can distort the comparison. Use a line for continuous trend, a histogram for numeric buckets, stacked bars for parts of a total or a waterfall for running changes. These are distinct encodings, not alternate names for a basic bar.

## Preview, spec and editable example

<FelixJsonChart :spec="chartExamples.examples['bar']" :sources="chartExamples.sources" />

The preview is rendered from the JSON in **Spec**. Open **Example** to edit the component, source, encoding and options, then choose **Render JSON**. The source registry is separately editable so you can try your own labels and values without embedding numbers in the chart spec. Nothing is sent, saved or fetched. Invalid input reports a field path and keeps the last valid preview.

## Wire contract

This example selects `bar`. The spec uses `component`, optional `title`, `subtitle` and `insight`, a named `data.source`, `encoding` and component-specific `options`. Data filters, stable sorting and limits are applied before rendering. The source holds `headers` and `rows`; every encoding names a real source column.

```json
{
  "component": "bar",
  "title": "Bar",
  "subtitle": "Fictitious local data",
  "data": {
    "source": "sample.bar"
  },
  "encoding": {
    "category": "Period",
    "value": "Primary"
  },
  "options": {
    "highlight": "Apr"
  }
}
```

### Encoding

| Channel | Source column |
| --- | --- |
| `category` | `Period` |
| `value` | `Primary` |

### Options

Supported contract options: `highlight`. These are validated by component; unknown fields are rejected. This renderer supports a conservative subset and rejects options that are not implemented rather than ignoring them. See [current renderer scope](/felix/components/chart-json#current-renderer-scope).

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
