<script setup>
import SankeyFunnel from '../.vitepress/theme/SankeyFunnel.vue'
import ChartGallery from '../.vitepress/theme/ChartGallery.vue'
import SeriesTrend from '../.vitepress/theme/SeriesTrend.vue'
</script>



# Charts (PulseFit)

## All charts

### Trends over time

- [Spline line · single / dual](/pulsefit/charts#mono-line)
- [Gradient spline area](/pulsefit/charts#mono-area)
- [Step progression](/pulsefit/charts#mono-step)
- [Stream wave](/pulsefit/charts#mono-stream)
- [Min/max range band](/pulsefit/charts#mono-range)
- [Pill bars + spline](/pulsefit/charts#mono-hybrid)
- [Dual-axis · revenue / occupancy](/pulsefit/charts#mono-combo)
- [Financial candlesticks](/pulsefit/charts#mono-candle)
- [Telemetry sparklines](/pulsefit/charts#mono-telemetry)
- [Series filter + bars + trend](/pulsefit/charts#series-filter-bars-trend)

### Comparison

- [Pill bars · column / row](/pulsefit/charts#mono-bars)
- [Stacked tones](/pulsefit/charts#mono-stacked)
- [Dumbbell · plan / actual](/pulsefit/charts#mono-dumbbell)
- [Bullet targets](/pulsefit/charts#mono-bullet)
- [Waterfall steps](/pulsefit/charts#mono-waterfall)
- [Polar radial pillars](/pulsefit/charts#mono-polar)
- [Radar web](/pulsefit/charts#mono-radar)
- [Grouped radial arcs](/pulsefit/charts#mono-radial)

### Parts of a whole

- [Rounded donut](/pulsefit/charts#mono-donut)
- [Tile treemap](/pulsefit/charts#mono-treemap)
- [Sunburst · expense hierarchy](/pulsefit/charts#mono-sunburst)
- [Tier pyramid](/pulsefit/charts#mono-pyramid)

### Distribution and relationships

- [Scatter matrix](/pulsefit/charts#mono-scatter)
- [Bubble clusters](/pulsefit/charts#mono-bubble)
- [Histogram · attendance distribution](/pulsefit/charts#mono-histogram)
- [Box plot · revenue spread](/pulsefit/charts#mono-boxplot)

### Activity and time grids

- [Activity heatmap · Emerald](/pulsefit/charts#mono-heat-green)
- [Activity heatmap · Sky](/pulsefit/charts#mono-heat-blue)
- [Activity heatmap · Violet](/pulsefit/charts#mono-heat-purple)
- [Dot-matrix heatmap](/pulsefit/charts#mono-matrix)
- [Day × hour · studio occupancy](/pulsefit/charts#mono-hourmap)
- [Cohort · member retention](/pulsefit/charts#mono-cohort)
- [Gantt · studio timeline](/pulsefit/charts#mono-gantt)

### KPIs and progress

- [KPI with sparkline](/pulsefit/charts#mono-kpi)
- [Speedometer](/pulsefit/charts#mono-speed)
- [Arc meter](/pulsefit/charts#mono-arc)
- [Concentric progress rings](/pulsefit/charts#mono-rings)

### Flows and funnels

- [Sankey flow](/pulsefit/charts#mono-sankey)
- [Stage funnel](/pulsefit/charts#mono-funnel)

## Chart gallery

Includes 30 patterns adapted from the [Amicro reference](https://amicro.vercel.app/mono-charts), plus eight dashboard patterns (histogram, Gantt, day/hour heatmap, cohort retention, box plot, dual-axis combo, dumbbell and sunburst). Each card has synthetic data, hover/focus readouts, keyboard buttons and reduced-motion support. Dataset A/B updates time-series charts; allocation, target and flow examples use their own labeled fixtures. Existing chart examples remain below.

<ChartGallery language="pulsefit" />

### Integration notes

Import ChartGallery.vue for a demo or extract a single card into your application. Replace the synthetic arrays, label units, handle missing data, and use the Ready/Loading/Empty selector to preview chart states, and add error handling before live use. Sankey band width encodes flow; treemap tile area encodes share; waterfall bars encode signed deltas; candlesticks expose open/high/low/close in the readout. Charts should supplement, not replace, accessible data tables. The three colored activity grids are variants of one chart family.



Reusable chart patterns in the PulseFit design language. Data is fictitious.

Looking for dashboards built from these charts? See the [Reports example](/pulsefit/reports).

## Series filter + bars + trend

Bars per month with a segmented filter ("All" sums the series). The trend is a least-squares line over complete months only, so the current month is left out, and it needs 3 or more months with data. A missing month shows a dash and no bar. Fictitious data. Motion replays when the filter changes and stops with reduced motion.

<SeriesTrend language="pulsefit" />

## Conversion funnel (Sankey)

Multi-stage conversion flow with drop-offs, date ranges, play/pause and keyboard focus. It inherits this template's colors and works with synthetic data. Replace the stage counts with your own source of truth.

<SankeyFunnel title="Conversion funnel" />
