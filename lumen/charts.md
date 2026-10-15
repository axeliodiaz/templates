---
aside: false
pageClass: lmn-page
---

<script setup>
import SankeyFunnel from '../.vitepress/theme/SankeyFunnel.vue'
import ChartGallery from '../.vitepress/theme/ChartGallery.vue'
import SeriesTrend from '../.vitepress/theme/SeriesTrend.vue'
</script>

# Charts

Animated chart patterns in the Lumen palette (violet, amber, cyan on white). Synthetic data, hover and keyboard readouts, reduced-motion support, Ready/Loading/Empty states.

## All charts

### Trends over time

- [Spline line · single / dual](/lumen/charts#mono-line)
- [Gradient spline area](/lumen/charts#mono-area)
- [Step progression](/lumen/charts#mono-step)
- [Stream wave](/lumen/charts#mono-stream)
- [Min/max range band](/lumen/charts#mono-range)
- [Pill bars + spline](/lumen/charts#mono-hybrid)
- [Dual-axis · revenue / occupancy](/lumen/charts#mono-combo)
- [Financial candlesticks](/lumen/charts#mono-candle)
- [Telemetry sparklines](/lumen/charts#mono-telemetry)
- [Series filter + bars + trend](/lumen/charts#series-filter-bars-trend)

### Comparison

- [Pill bars · column / row](/lumen/charts#mono-bars)
- [Stacked tones](/lumen/charts#mono-stacked)
- [Dumbbell · plan / actual](/lumen/charts#mono-dumbbell)
- [Bullet targets](/lumen/charts#mono-bullet)
- [Waterfall steps](/lumen/charts#mono-waterfall)
- [Polar radial pillars](/lumen/charts#mono-polar)
- [Radar web](/lumen/charts#mono-radar)
- [Grouped radial arcs](/lumen/charts#mono-radial)

### Parts of a whole

- [Rounded donut](/lumen/charts#mono-donut)
- [Tile treemap](/lumen/charts#mono-treemap)
- [Sunburst · expense hierarchy](/lumen/charts#mono-sunburst)
- [Tier pyramid](/lumen/charts#mono-pyramid)

### Distribution and relationships

- [Scatter matrix](/lumen/charts#mono-scatter)
- [Bubble clusters](/lumen/charts#mono-bubble)
- [Histogram · attendance distribution](/lumen/charts#mono-histogram)
- [Box plot · revenue spread](/lumen/charts#mono-boxplot)

### Activity and time grids

- [Activity heatmap · Emerald](/lumen/charts#mono-heat-green)
- [Activity heatmap · Sky](/lumen/charts#mono-heat-blue)
- [Activity heatmap · Violet](/lumen/charts#mono-heat-purple)
- [Dot-matrix heatmap](/lumen/charts#mono-matrix)
- [Day × hour · studio occupancy](/lumen/charts#mono-hourmap)
- [Cohort · member retention](/lumen/charts#mono-cohort)
- [Gantt · studio timeline](/lumen/charts#mono-gantt)

### KPIs and progress

- [KPI with sparkline](/lumen/charts#mono-kpi)
- [Speedometer](/lumen/charts#mono-speed)
- [Arc meter](/lumen/charts#mono-arc)
- [Concentric progress rings](/lumen/charts#mono-rings)

### Flows and funnels

- [Sankey flow](/lumen/charts#mono-sankey)
- [Stage funnel](/lumen/charts#mono-funnel)

## Chart gallery

<ChartGallery language="lumen" />

## Series filter + bars + trend

Bars per month with a segmented filter ("All" sums the series). The trend is a least-squares line over complete months only, so the current month is left out, and it needs 3 or more months with data. A missing month shows a dash and no bar. Fictitious data. Motion replays when the filter changes and stops with reduced motion.

<SeriesTrend language="lumen" />

## Conversion funnel (Sankey)

Multi-stage conversion flow with drop-offs, date ranges, play/pause and keyboard focus. It inherits this template's colors and works with synthetic data. Replace the stage counts with your own source of truth.

<SankeyFunnel title="Conversion funnel" />
