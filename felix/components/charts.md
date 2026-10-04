<script setup>
import ChartGallery from '../../.vitepress/theme/ChartGallery.vue'
import ReportsDashboard from '../../.vitepress/theme/ReportsDashboard.vue'
</script>



# Charts

## Animated chart catalog

38 patterns: 30 adapted from the [Amicro reference](https://amicro.vercel.app/mono-charts), plus eight dashboard patterns (histogram, Gantt, day/hour heatmap, cohort retention, box plot, dual-axis combo, dumbbell and sunburst). Each card has synthetic data, hover/focus readouts, keyboard buttons and reduced-motion support. Dataset A/B updates time-series charts; allocation, target and flow examples use their own labeled fixtures. Existing chart examples remain below.

<ChartGallery language="felix" />

### Integration notes

Import ChartGallery.vue for a demo or extract a single card into your application. Replace the synthetic arrays, label units, handle missing data, and use the Ready/Loading/Empty selector to preview chart states, and add error handling before live use. Sankey band width encodes flow; treemap tile area encodes share; waterfall bars encode signed deltas; candlesticks expose open/high/low/close in the readout. Charts should supplement, not replace, accessible data tables. The three colored activity grids are variants of one chart family.



Data graphics in the Felix palette. Series order: turquoise `#2bf2f1`, cactus `#42b552`, mango `#f19d38`, blueberry `#6e58d8`, papaya `#f77b42`, lime `#dcff00`. Numbers below are a sample of monthly transfers, not live data.

<div class="fx-charts">

<section class="fx-chart">
<h3>Line</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Line chart, monthly transfers from 42 to 80">
<path d="M28 120 H320 M28 80 H320 M28 40 H320" fill="none" stroke="#efebe7"/>
<polyline points="28,100.8 84,80 140,91.2 196,56 252,67.2 308,40" fill="none" stroke="#0f8c8b" stroke-width="3" stroke-linejoin="round"/>
<circle cx="28" cy="100.8" r="4" fill="#2bf2f1"/><circle cx="84" cy="80" r="4" fill="#2bf2f1"/><circle cx="140" cy="91.2" r="4" fill="#2bf2f1"/><circle cx="196" cy="56" r="4" fill="#2bf2f1"/><circle cx="252" cy="67.2" r="4" fill="#2bf2f1"/><circle cx="308" cy="40" r="4" fill="#2bf2f1"/>
<text x="28" y="148">Ene</text><text x="84" y="148">Feb</text><text x="140" y="148">Mar</text><text x="196" y="148">Abr</text><text x="252" y="148">May</text><text x="308" y="148">Jun</text>
</svg>
</section>

<section class="fx-chart">
<h3>Area</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Area chart of monthly transfers">
<path d="M28 120 H320 M28 80 H320 M28 40 H320" fill="none" stroke="#efebe7"/>
<path d="M28,100.8 L84,80 L140,91.2 L196,56 L252,67.2 L308,40 L308,120 L28,120 Z" fill="#2bf2f133"/>
<polyline points="28,100.8 84,80 140,91.2 196,56 252,67.2 308,40" fill="none" stroke="#2bf2f1" stroke-width="3"/>
<text x="28" y="148">Ene</text><text x="308" y="148" text-anchor="end">Jun</text>
</svg>
</section>

<section class="fx-chart">
<h3>Column bar</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Column bar chart of monthly transfers">
<path d="M24 120 H324" fill="none" stroke="#efebe7"/>
<rect x="36" y="78" width="28" height="42" rx="6" fill="#2bf2f1"/>
<rect x="84" y="65" width="28" height="55" rx="6" fill="#42b552"/>
<rect x="132" y="72" width="28" height="48" rx="6" fill="#f19d38"/>
<rect x="180" y="50" width="28" height="70" rx="6" fill="#6e58d8"/>
<rect x="228" y="57" width="28" height="63" rx="6" fill="#f77b42"/>
<rect x="276" y="40" width="28" height="80" rx="6" fill="#dcff00"/>
<text x="50" y="140" text-anchor="middle">Ene</text><text x="98" y="140" text-anchor="middle">Feb</text><text x="146" y="140" text-anchor="middle">Mar</text><text x="194" y="140" text-anchor="middle">Abr</text><text x="242" y="140" text-anchor="middle">May</text><text x="290" y="140" text-anchor="middle">Jun</text>
</svg>
</section>

<section class="fx-chart">
<h3>Horizontal bar</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Horizontal bar chart ranked by volume">
<text x="4" y="28">Jun</text><rect x="40" y="16" width="250" height="16" rx="8" fill="#dcff00"/>
<text x="4" y="56">Abr</text><rect x="40" y="44" width="218" height="16" rx="8" fill="#6e58d8"/>
<text x="4" y="84">May</text><rect x="40" y="72" width="196" height="16" rx="8" fill="#f77b42"/>
<text x="4" y="112">Feb</text><rect x="40" y="100" width="172" height="16" rx="8" fill="#42b552"/>
<text x="4" y="140">Mar</text><rect x="40" y="128" width="150" height="16" rx="8" fill="#f19d38"/>
</svg>
</section>

<section class="fx-chart">
<h3>Grouped bar</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Grouped bars, sent versus received">
<rect x="40" y="70" width="16" height="50" rx="4" fill="#2bf2f1"/><rect x="58" y="50" width="16" height="70" rx="4" fill="#082422"/>
<rect x="120" y="58" width="16" height="62" rx="4" fill="#2bf2f1"/><rect x="138" y="40" width="16" height="80" rx="4" fill="#082422"/>
<rect x="200" y="64" width="16" height="56" rx="4" fill="#2bf2f1"/><rect x="218" y="46" width="16" height="74" rx="4" fill="#082422"/>
<rect x="280" y="48" width="16" height="72" rx="4" fill="#2bf2f1"/><rect x="298" y="32" width="16" height="88" rx="4" fill="#082422"/>
<text x="57" y="145" text-anchor="middle">Q1</text><text x="137" y="145" text-anchor="middle">Q2</text><text x="217" y="145" text-anchor="middle">Q3</text><text x="297" y="145" text-anchor="middle">Q4</text>
</svg>
<p class="fx-legend"><i style="background:#2bf2f1"></i>Envíos <i style="background:#082422"></i>Recepciones</p>
</section>

<section class="fx-chart">
<h3>Stacked bar</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Stacked bar of fees and principal">
<rect x="48" y="78" width="28" height="42" fill="#2bf2f1"/><rect x="48" y="58" width="28" height="20" fill="#dcff00"/>
<rect x="108" y="62" width="28" height="58" fill="#2bf2f1"/><rect x="108" y="44" width="28" height="18" fill="#dcff00"/>
<rect x="168" y="70" width="28" height="50" fill="#2bf2f1"/><rect x="168" y="52" width="28" height="18" fill="#dcff00"/>
<rect x="228" y="48" width="28" height="72" fill="#2bf2f1"/><rect x="228" y="30" width="28" height="18" fill="#dcff00"/>
<text x="62" y="145" text-anchor="middle">Ene</text><text x="122" y="145" text-anchor="middle">Feb</text><text x="182" y="145" text-anchor="middle">Mar</text><text x="242" y="145" text-anchor="middle">Abr</text>
</svg>
<p class="fx-legend"><i style="background:#2bf2f1"></i>Principal <i style="background:#dcff00"></i>Comisión</p>
</section>

<section class="fx-chart">
<h3>Pie</h3>
<svg viewBox="0 0 180 180" role="img" aria-label="Pie chart of six months">
<path d="M90.0 90.0 L90.0 18.0 A72 72 0 0 1 138.4 36.7 Z" fill="#2bf2f1"/>
<path d="M90.0 90.0 L138.4 36.7 A72 72 0 0 1 161.4 99.5 Z" fill="#42b552"/>
<path d="M90.0 90.0 L161.4 99.5 A72 72 0 0 1 130.5 149.6 Z" fill="#f19d38"/>
<path d="M90.0 90.0 L130.5 149.6 A72 72 0 0 1 47.5 148.1 Z" fill="#6e58d8"/>
<path d="M90.0 90.0 L47.5 148.1 A72 72 0 0 1 19.0 78.1 Z" fill="#f77b42"/>
<path d="M90.0 90.0 L19.0 78.1 A72 72 0 0 1 90.0 18.0 Z" fill="#dcff00"/>
</svg>
</section>

<section class="fx-chart">
<h3>Donut</h3>
<svg viewBox="0 0 180 180" role="img" aria-label="Donut chart, total 358 transfers">
<circle cx="90" cy="90" r="54" fill="none" stroke="#2bf2f1" stroke-width="22" stroke-dasharray="39.81 299.49" stroke-dashoffset="0" transform="rotate(-90 90 90)"/>
<circle cx="90" cy="90" r="54" fill="none" stroke="#42b552" stroke-width="22" stroke-dasharray="52.13 287.17" stroke-dashoffset="-39.81" transform="rotate(-90 90 90)"/>
<circle cx="90" cy="90" r="54" fill="none" stroke="#f19d38" stroke-width="22" stroke-dasharray="45.49 293.80" stroke-dashoffset="-91.93" transform="rotate(-90 90 90)"/>
<circle cx="90" cy="90" r="54" fill="none" stroke="#6e58d8" stroke-width="22" stroke-dasharray="66.34 272.95" stroke-dashoffset="-137.42" transform="rotate(-90 90 90)"/>
<circle cx="90" cy="90" r="54" fill="none" stroke="#f77b42" stroke-width="22" stroke-dasharray="59.71 279.58" stroke-dashoffset="-203.76" transform="rotate(-90 90 90)"/>
<circle cx="90" cy="90" r="54" fill="none" stroke="#dcff00" stroke-width="22" stroke-dasharray="75.82 263.47" stroke-dashoffset="-263.47" transform="rotate(-90 90 90)"/>
<text x="90" y="86" text-anchor="middle" font-size="22" font-weight="700" fill="#082422">358</text>
<text x="90" y="104" text-anchor="middle" font-size="11" fill="#35605f">envíos</text>
</svg>
</section>

<section class="fx-chart">
<h3>Scatter</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Scatter of amount versus time">
<path d="M28 24 V124 H320" fill="none" stroke="#efebe7"/>
<circle cx="60" cy="96" r="7" fill="#2bf2f1"/><circle cx="110" cy="70" r="7" fill="#42b552"/><circle cx="150" cy="88" r="7" fill="#f19d38"/><circle cx="200" cy="52" r="7" fill="#6e58d8"/><circle cx="240" cy="64" r="7" fill="#f77b42"/><circle cx="290" cy="36" r="7" fill="#dcff00"/>
</svg>
</section>

<section class="fx-chart">
<h3>Bubble</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Bubble chart, size is transfer count">
<path d="M28 24 V124 H320" fill="none" stroke="#efebe7"/>
<circle cx="70" cy="90" r="16" fill="#2bf2f1" fill-opacity=".75"/><circle cx="130" cy="72" r="22" fill="#42b552" fill-opacity=".75"/><circle cx="180" cy="96" r="14" fill="#f19d38" fill-opacity=".75"/><circle cx="230" cy="58" r="26" fill="#6e58d8" fill-opacity=".75"/><circle cx="290" cy="48" r="20" fill="#dcff00" fill-opacity=".85"/>
</svg>
</section>

<section class="fx-chart">
<h3>Sparkline</h3>
<p class="fx-metric">80 <small>jun</small></p>
<svg viewBox="0 0 340 80" role="img" aria-label="Sparkline ending at 80">
<polyline points="8,50 64,38 120,44 176,22 232,28 308,8" fill="none" stroke="#0f8c8b" stroke-width="3" stroke-linecap="round"/>
<circle cx="308" cy="8" r="4" fill="#2bf2f1"/>
</svg>
</section>

<section class="fx-chart">
<h3>Radar</h3>
<svg viewBox="0 0 200 180" role="img" aria-label="Radar of six months">
<polygon points="100,16 164,48 164,120 100,156 36,120 36,48" fill="none" stroke="#cfcabf"/>
<polygon points="100,46 138,66 138,108 100,128 62,108 62,66" fill="none" stroke="#efebe7"/>
<polygon points="100,40 150,58 142,112 100,140 58,108 48,62" fill="#2bf2f144" stroke="#0f8c8b" stroke-width="2"/>
</svg>
</section>

<section class="fx-chart">
<h3>Heatmap</h3>
<div class="fx-heat" role="img" aria-label="Heatmap of weekday by month">
<span></span><span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span>
<span>Lun</span><i style="background:#d4fffe"></i><i style="background:#8dfdfa"></i><i style="background:#2bf2f1"></i><i style="background:#0f8c8b"></i>
<span>Mié</span><i style="background:#efebe7"></i><i style="background:#d4fffe"></i><i style="background:#5af5f4"></i><i style="background:#2bf2f1"></i>
<span>Vie</span><i style="background:#8dfdfa"></i><i style="background:#2bf2f1"></i><i style="background:#1abfbe"></i><i style="background:#065958"></i>
</div>
</section>

<section class="fx-chart">
<h3>Gauge</h3>
<svg viewBox="0 0 180 110" role="img" aria-label="72 percent of the monthly target">
<path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="#efebe7" stroke-width="14" stroke-linecap="round"/>
<path d="M20 90 A70 70 0 0 1 132 28" fill="none" stroke="#2bf2f1" stroke-width="14" stroke-linecap="round"/>
<text x="90" y="86" text-anchor="middle" font-size="22" font-weight="700" fill="#082422">72%</text>
</svg>
</section>

<section class="fx-chart">
<h3>Histogram</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Histogram of transfer amounts">
<rect x="36" y="90" width="40" height="30" fill="#d4fffe"/><rect x="84" y="60" width="40" height="60" fill="#8dfdfa"/><rect x="132" y="36" width="40" height="84" fill="#2bf2f1"/><rect x="180" y="52" width="40" height="68" fill="#1abfbe"/><rect x="228" y="78" width="40" height="42" fill="#0f8c8b"/>
<text x="56" y="145" text-anchor="middle">0–20</text><text x="104" y="145" text-anchor="middle">20–40</text><text x="152" y="145" text-anchor="middle">40–60</text><text x="200" y="145" text-anchor="middle">60–80</text><text x="248" y="145" text-anchor="middle">80+</text>
</svg>
</section>

<section class="fx-chart">
<h3>Funnel</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Funnel from quote to payout">
<rect x="40" y="16" width="260" height="26" rx="6" fill="#2bf2f1"/>
<rect x="70" y="50" width="200" height="26" rx="6" fill="#42b552"/>
<rect x="100" y="84" width="140" height="26" rx="6" fill="#f19d38"/>
<rect x="120" y="118" width="100" height="26" rx="6" fill="#6e58d8"/>
<text x="170" y="34" text-anchor="middle" fill="#082422" font-size="12">Cotización</text>
<text x="170" y="68" text-anchor="middle" fill="#082422" font-size="12">Datos</text>
<text x="170" y="102" text-anchor="middle" fill="#fefcf9" font-size="12">Pago</text>
<text x="170" y="136" text-anchor="middle" fill="#fefcf9" font-size="12">Entrega</text>
</svg>
</section>

<section class="fx-chart">
<h3>Waterfall</h3>
<svg viewBox="0 0 340 160" role="img" aria-label="Waterfall from opening balance to close">
<rect x="36" y="40" width="36" height="80" fill="#082422"/>
<rect x="96" y="40" width="36" height="28" fill="#42b552"/>
<rect x="156" y="68" width="36" height="22" fill="#f26629"/>
<rect x="216" y="46" width="36" height="34" fill="#42b552"/>
<rect x="276" y="46" width="36" height="74" fill="#2bf2f1"/>
<text x="54" y="140" text-anchor="middle">Inicio</text><text x="114" y="140" text-anchor="middle">+</text><text x="174" y="140" text-anchor="middle">−</text><text x="234" y="140" text-anchor="middle">+</text><text x="294" y="140" text-anchor="middle">Cierre</text>
</svg>
</section>

</div>

Start every bar and area at zero. Pie and donut slices must sum to one whole. Status colors stay semantic: do not use papaya or cactus as a brand series when the mark means error or success.

## Reporting patterns

These are reusable patterns, not a template or a complete product. The [Reports example](/felix/reports) composes them into a dashboard.

### KPI cards with change and target
Use one main value, an explicit unit, a change badge and a target or sample size. Never communicate change with color alone.

### Two-series line
Compare trends with solid and dashed strokes, a legend and a keyboard-accessible month readout. Keep units explicit; normalize or use separate axes when units differ in real data.

### Ranked category bars
Show count and percentage with each label. Rank the shares and use one common scale.

### Sortable performance table
Offer jobs, response and rating sorts. Keep column labels readable; narrow screens get a keyboard-focusable horizontal scroll region.

<ReportsDashboard language="felix" />

### Usage

```vue
<ReportsDashboard language="felix" />
```

Import the shared ReportsDashboard.vue source and replace the synthetic data. Preserve labels, keyboard focus and the readout; add loading, empty and error states before connecting a backend.
