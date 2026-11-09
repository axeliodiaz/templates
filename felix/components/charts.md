<script setup>
import FelixJsonChart from '../../.vitepress/theme/FelixJsonChart.vue'
import chartExamples from '../../.vitepress/theme/felix-chart-examples.json'
</script>

# Charts

Every Felix chart is defined by a JSON spec and a named local source. Switch between Preview, Spec and Example to inspect or edit the same chart. All samples are fictitious. [Read the JSON contract](/felix/components/chart-json).

## All charts

### Trends over time

- [Line · single / comparison](/felix/components/charts#mono-line)
- [Cumulative area](/felix/components/charts#mono-area)
- [Step progression](/felix/components/charts#mono-step)
- [Stream wave](/felix/components/charts#mono-stream)
- [Min/max range band](/felix/components/charts#mono-range)
- [Bars + comparison line](/felix/components/charts#mono-hybrid)
- [Dual-axis · revenue / occupancy](/felix/components/charts#mono-combo)
- [Financial candlesticks](/felix/components/charts#mono-candle)
- [Telemetry lines](/felix/components/charts#mono-telemetry)
- [Line](/felix/components/charts#basic-line)
- [Area](/felix/components/charts#basic-area)
- [Sparkline](/felix/components/charts#basic-sparkline)
- [Series filter + bars + trend](/felix/components/charts#series-filter-bars-trend)

### Comparison

- [Column bars](/felix/components/charts#mono-bars)
- [Stacked tones](/felix/components/charts#mono-stacked)
- [Dumbbell · plan / actual](/felix/components/charts#mono-dumbbell)
- [Bullet targets](/felix/components/charts#mono-bullet)
- [Waterfall steps](/felix/components/charts#mono-waterfall)
- [Polar radial pillars](/felix/components/charts#mono-polar)
- [Radar web](/felix/components/charts#mono-radar)
- [Grouped radial arcs](/felix/components/charts#mono-radial)
- [Column bar](/felix/components/charts#basic-column-bar)
- [Horizontal bar](/felix/components/charts#basic-horizontal-bar)
- [Grouped bar](/felix/components/charts#basic-grouped-bar)
- [Stacked bar](/felix/components/charts#basic-stacked-bar)
- [Waterfall](/felix/components/charts#basic-waterfall)
- [Radar](/felix/components/charts#basic-radar)

### Parts of a whole

- [Donut](/felix/components/charts#mono-donut)
- [Tile treemap](/felix/components/charts#mono-treemap)
- [Sunburst · expense hierarchy](/felix/components/charts#mono-sunburst)
- [Tier pyramid](/felix/components/charts#mono-pyramid)
- [Pie](/felix/components/charts#basic-pie)
- [Donut](/felix/components/charts#basic-donut)

### Distribution and relationships

- [Scatter matrix](/felix/components/charts#mono-scatter)
- [Bubble clusters](/felix/components/charts#mono-bubble)
- [Histogram · attendance distribution](/felix/components/charts#mono-histogram)
- [Box plot · revenue spread](/felix/components/charts#mono-boxplot)
- [Scatter](/felix/components/charts#basic-scatter)
- [Bubble](/felix/components/charts#basic-bubble)
- [Histogram](/felix/components/charts#basic-histogram)

### Activity and time grids

- [Activity heatmap · sample A](/felix/components/charts#mono-heat-green)
- [Activity heatmap · sample B](/felix/components/charts#mono-heat-blue)
- [Activity heatmap · sample C](/felix/components/charts#mono-heat-purple)
- [Dot-matrix heatmap](/felix/components/charts#mono-matrix)
- [Day × hour · studio occupancy](/felix/components/charts#mono-hourmap)
- [Cohort · member retention](/felix/components/charts#mono-cohort)
- [Gantt · studio timeline](/felix/components/charts#mono-gantt)
- [Heatmap](/felix/components/charts#basic-heatmap)

### KPIs and progress

- [KPI with sparkline](/felix/components/charts#mono-kpi)
- [Half-circle gauge](/felix/components/charts#mono-speed)
- [Arc meter](/felix/components/charts#mono-arc)
- [Concentric progress rings](/felix/components/charts#mono-rings)
- [Gauge](/felix/components/charts#basic-gauge)

### Flows and funnels

- [Sankey flow](/felix/components/charts#mono-sankey)
- [Stage funnel](/felix/components/charts#mono-funnel)
- [Funnel](/felix/components/charts#basic-funnel)
- [Dependent task cards](/felix/components/charts#dependent-task-cards)
- [Process graph](/felix/components/charts#process-graph)
- [Animated Mermaid](/felix/components/charts#animated-mermaid)
- [Conversion funnel (Sankey)](/felix/components/charts#conversion-funnel-sankey)

Looking for dashboards built from these charts? See the [Reports example](/felix/reports).


## Chart gallery

<h3 id="mono-heat-green">Activity heatmap · sample A</h3>

<FelixJsonChart :spec="chartExamples.examples['heatmap']" :sources="chartExamples.sources" />

<h3 id="mono-heat-blue">Activity heatmap · sample B</h3>

<FelixJsonChart :spec="chartExamples.examples['heatmap-b']" :sources="chartExamples.sources" />

<h3 id="mono-heat-purple">Activity heatmap · sample C</h3>

<FelixJsonChart :spec="chartExamples.examples['heatmap-c']" :sources="chartExamples.sources" />

<h3 id="mono-line">Line · single / comparison</h3>

<FelixJsonChart :spec="chartExamples.examples['line']" :sources="chartExamples.sources" />

<h3 id="mono-bars">Column bars</h3>

<FelixJsonChart :spec="chartExamples.examples['column']" :sources="chartExamples.sources" />

<h3 id="mono-area">Cumulative area</h3>

<FelixJsonChart :spec="chartExamples.examples['area']" :sources="chartExamples.sources" />

<h3 id="mono-donut">Donut</h3>

<FelixJsonChart :spec="chartExamples.examples['donut']" :sources="chartExamples.sources" />

<h3 id="mono-hybrid">Bars + comparison line</h3>

<FelixJsonChart :spec="chartExamples.examples['hybrid']" :sources="chartExamples.sources" />

<h3 id="mono-scatter">Scatter matrix</h3>

<FelixJsonChart :spec="chartExamples.examples['scatter']" :sources="chartExamples.sources" />

<h3 id="mono-candle">Financial candlesticks</h3>

<FelixJsonChart :spec="chartExamples.examples['candlestick']" :sources="chartExamples.sources" />

<h3 id="mono-kpi">KPI with sparkline</h3>

<FelixJsonChart :spec="chartExamples.examples['kpi']" :sources="chartExamples.sources" />

<h3 id="mono-pyramid">Tier pyramid</h3>

<FelixJsonChart :spec="chartExamples.examples['pyramid']" :sources="chartExamples.sources" />

<h3 id="mono-radial">Grouped radial arcs</h3>

<FelixJsonChart :spec="chartExamples.examples['radial']" :sources="chartExamples.sources" />

<h3 id="mono-speed">Half-circle gauge</h3>

<FelixJsonChart :spec="chartExamples.examples['speed']" :sources="chartExamples.sources" />

<h3 id="mono-bullet">Bullet targets</h3>

<FelixJsonChart :spec="chartExamples.examples['bullet']" :sources="chartExamples.sources" />

<h3 id="mono-sankey">Sankey flow</h3>

<FelixJsonChart :spec="chartExamples.examples['sankey']" :sources="chartExamples.sources" />

<h3 id="mono-step">Step progression</h3>

<FelixJsonChart :spec="chartExamples.examples['step']" :sources="chartExamples.sources" />

<h3 id="mono-stacked">Stacked tones</h3>

<FelixJsonChart :spec="chartExamples.examples['stacked']" :sources="chartExamples.sources" />

<h3 id="mono-radar">Radar web</h3>

<FelixJsonChart :spec="chartExamples.examples['radar']" :sources="chartExamples.sources" />

<h3 id="mono-rings">Concentric progress rings</h3>

<FelixJsonChart :spec="chartExamples.examples['rings']" :sources="chartExamples.sources" />

<h3 id="mono-funnel">Stage funnel</h3>

<FelixJsonChart :spec="chartExamples.examples['funnel']" :sources="chartExamples.sources" />

<h3 id="mono-matrix">Dot-matrix heatmap</h3>

<FelixJsonChart :spec="chartExamples.examples['matrix']" :sources="chartExamples.sources" />

<h3 id="mono-telemetry">Telemetry lines</h3>

<FelixJsonChart :spec="chartExamples.examples['telemetry']" :sources="chartExamples.sources" />

<h3 id="mono-bubble">Bubble clusters</h3>

<FelixJsonChart :spec="chartExamples.examples['bubble']" :sources="chartExamples.sources" />

<h3 id="mono-treemap">Tile treemap</h3>

<FelixJsonChart :spec="chartExamples.examples['treemap']" :sources="chartExamples.sources" />

<h3 id="mono-stream">Stream wave</h3>

<FelixJsonChart :spec="chartExamples.examples['stream']" :sources="chartExamples.sources" />

<h3 id="mono-arc">Arc meter</h3>

<FelixJsonChart :spec="chartExamples.examples['arc']" :sources="chartExamples.sources" />

<h3 id="mono-waterfall">Waterfall steps</h3>

<FelixJsonChart :spec="chartExamples.examples['waterfall']" :sources="chartExamples.sources" />

<h3 id="mono-polar">Polar radial pillars</h3>

<FelixJsonChart :spec="chartExamples.examples['polar']" :sources="chartExamples.sources" />

<h3 id="mono-range">Min/max range band</h3>

<FelixJsonChart :spec="chartExamples.examples['range']" :sources="chartExamples.sources" />

<h3 id="mono-histogram">Histogram · attendance distribution</h3>

<FelixJsonChart :spec="chartExamples.examples['histogram']" :sources="chartExamples.sources" />

<h3 id="mono-gantt">Gantt · studio timeline</h3>

<FelixJsonChart :spec="chartExamples.examples['gantt']" :sources="chartExamples.sources" />

<h3 id="mono-hourmap">Day × hour · studio occupancy</h3>

<FelixJsonChart :spec="chartExamples.examples['hourmap']" :sources="chartExamples.sources" />

<h3 id="mono-cohort">Cohort · member retention</h3>

<FelixJsonChart :spec="chartExamples.examples['cohort']" :sources="chartExamples.sources" />

<h3 id="mono-boxplot">Box plot · revenue spread</h3>

<FelixJsonChart :spec="chartExamples.examples['boxplot']" :sources="chartExamples.sources" />

<h3 id="mono-combo">Dual-axis · revenue / occupancy</h3>

<FelixJsonChart :spec="chartExamples.examples['combo']" :sources="chartExamples.sources" />

<h3 id="mono-dumbbell">Dumbbell · plan / actual</h3>

<FelixJsonChart :spec="chartExamples.examples['dumbbell']" :sources="chartExamples.sources" />

<h3 id="mono-sunburst">Sunburst · expense hierarchy</h3>

<FelixJsonChart :spec="chartExamples.examples['sunburst']" :sources="chartExamples.sources" />


## Chart types

<h3 id="basic-line">Line</h3>

<FelixJsonChart :spec="chartExamples.examples['line']" :sources="chartExamples.sources" />

<h3 id="basic-area">Area</h3>

<FelixJsonChart :spec="chartExamples.examples['area']" :sources="chartExamples.sources" />

<h3 id="basic-column-bar">Column bar</h3>

<FelixJsonChart :spec="chartExamples.examples['column']" :sources="chartExamples.sources" />

<h3 id="basic-horizontal-bar">Horizontal bar</h3>

<FelixJsonChart :spec="chartExamples.examples['bar']" :sources="chartExamples.sources" />

<h3 id="basic-grouped-bar">Grouped bar</h3>

<FelixJsonChart :spec="chartExamples.examples['grouped']" :sources="chartExamples.sources" />

<h3 id="basic-stacked-bar">Stacked bar</h3>

<FelixJsonChart :spec="chartExamples.examples['stacked']" :sources="chartExamples.sources" />

<h3 id="basic-pie">Pie</h3>

<FelixJsonChart :spec="chartExamples.examples['pie']" :sources="chartExamples.sources" />

<h3 id="basic-donut">Donut</h3>

<FelixJsonChart :spec="chartExamples.examples['donut']" :sources="chartExamples.sources" />

<h3 id="basic-scatter">Scatter</h3>

<FelixJsonChart :spec="chartExamples.examples['scatter']" :sources="chartExamples.sources" />

<h3 id="basic-bubble">Bubble</h3>

<FelixJsonChart :spec="chartExamples.examples['bubble']" :sources="chartExamples.sources" />

<h3 id="basic-sparkline">Sparkline</h3>

<FelixJsonChart :spec="chartExamples.examples['sparkline']" :sources="chartExamples.sources" />

<h3 id="basic-radar">Radar</h3>

<FelixJsonChart :spec="chartExamples.examples['radar']" :sources="chartExamples.sources" />

<h3 id="basic-heatmap">Heatmap</h3>

<FelixJsonChart :spec="chartExamples.examples['heatmap']" :sources="chartExamples.sources" />

<h3 id="basic-gauge">Gauge</h3>

<FelixJsonChart :spec="chartExamples.examples['rings']" :sources="chartExamples.sources" />

<h3 id="basic-histogram">Histogram</h3>

<FelixJsonChart :spec="chartExamples.examples['histogram']" :sources="chartExamples.sources" />

<h3 id="basic-funnel">Funnel</h3>

<FelixJsonChart :spec="chartExamples.examples['funnel']" :sources="chartExamples.sources" />

<h3 id="basic-waterfall">Waterfall</h3>

<FelixJsonChart :spec="chartExamples.examples['waterfall']" :sources="chartExamples.sources" />

<h2 id="series-filter-bars-trend">Series filter + bars + trend</h2>

<FelixJsonChart :spec="chartExamples.examples['series-trend']" :sources="chartExamples.sources" />

## Graphs and flows

<h2 id="dependent-task-cards">Dependent task cards</h2>

<FelixJsonChart :spec="chartExamples.examples['dependency']" :sources="chartExamples.sources" />

<h2 id="process-graph">Process graph</h2>

<FelixJsonChart :spec="chartExamples.examples['process']" :sources="chartExamples.sources" />

<h2 id="animated-mermaid">Animated Mermaid</h2>

<FelixJsonChart :spec="chartExamples.examples['flowchart']" :sources="chartExamples.sources" />

The diagram now uses validated JSON nodes and dependencies, not executable Mermaid text. Select a node to inspect its data.

<FelixJsonChart :spec="chartExamples.examples['state-diagram']" :sources="chartExamples.sources" />

<h2 id="conversion-funnel-sankey">Conversion funnel (Sankey)</h2>

<FelixJsonChart :spec="chartExamples.examples['sankey']" :sources="chartExamples.sources" />

<h2 id="status-gauge-and-funnel">Status gauge and funnel</h2>

<FelixJsonChart :spec="chartExamples.examples['status-gauge']" :sources="chartExamples.sources" />

<FelixJsonChart :spec="chartExamples.examples['status-funnel']" :sources="chartExamples.sources" />
