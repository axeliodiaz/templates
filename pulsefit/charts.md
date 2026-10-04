<script setup>
import ChartGallery from '../.vitepress/theme/ChartGallery.vue'
import ReportsDashboard from '../.vitepress/theme/ReportsDashboard.vue'
</script>



# Charts (PulseFit)

## Animated chart catalog

30 patterns from the [Amicro reference](https://amicro.vercel.app/mono-charts), adapted to this template. Each card has synthetic data, hover/focus readouts, keyboard buttons and reduced-motion support. Dataset A/B updates time-series charts; allocation, target and flow examples use their own labeled fixtures. Existing chart examples remain below.

<ChartGallery language="pulsefit" />

### Integration notes

Import ChartGallery.vue for a demo or extract a single card into your application. Replace the synthetic arrays, label units, handle missing data, and add loading/empty/error states before live use. Sankey band width encodes flow; treemap tile area encodes share; waterfall bars encode signed deltas; candlesticks expose open/high/low/close in the readout. Charts should supplement, not replace, accessible data tables. The three colored activity grids are variants of one chart family.



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
