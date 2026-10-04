<script setup>
import ReportsDashboard from '../.vitepress/theme/ReportsDashboard.vue'
</script>

# Charts (PulseFit)

Reusable chart patterns in the PulseFit design language. Data is fictitious.

## Reporting patterns

These are reusable patterns, not a template or a complete product. The [Reports example](/pulsefit/reports) composes them into a dashboard.

### KPI cards with change and target
Use one main value, an explicit unit, a change badge and a target or sample size. Never communicate change with color alone.

### Two-series line
Compare trends with solid and dashed strokes, a legend and a keyboard-accessible month readout. Keep units explicit; normalize or use separate axes when units differ in real data.

### Ranked category bars
Show count and percentage with each label. Rank the shares and use one common scale.

### Sortable performance table
Offer jobs, response and rating sorts. Keep column labels readable; narrow screens get a keyboard-focusable horizontal scroll region.

<ReportsDashboard language="pulsefit" />

### Usage

```vue
<ReportsDashboard language="pulsefit" />
```

Import the shared ReportsDashboard.vue source and replace the synthetic data. Preserve labels, keyboard focus and the readout; add loading, empty and error states before connecting a backend.
