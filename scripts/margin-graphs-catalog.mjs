/**
 * Margin Graphs doc IA — one page per Felix JSON chart example (felix-chart-examples.json).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const examples = JSON.parse(
  fs.readFileSync(path.join(root, '.vitepress/theme/felix-chart-examples.json'), 'utf8'),
)

/** @typedef {{ slug: string, exampleKey: string, title: string, component: string, group: string }} GraphPage */

const TITLE_OVERRIDES = {
  'heatmap-b': 'Heatmap (variant B)',
  'heatmap-c': 'Heatmap (variant C)',
  kpi: 'KPI with sparkline',
  gantt: 'Gantt timeline',
  stacked: 'Stacked bar',
  grouped: 'Grouped bar',
  hourmap: 'Day × hour heatmap',
  matrix: 'Dot-matrix heatmap',
  rings: 'Concentric gauge (rings)',
  speed: 'Speedometer',
  arc: 'Arc meter',
  polar: 'Polar chart',
  radial: 'Radial bar',
  'contribution-skyline': 'Contribution skyline',
  'series-trend': 'Series trend',
  'status-gauge': 'Status gauge',
  'status-funnel': 'Status funnel',
  'state-diagram': 'State diagram',
  flowchart: 'Flowchart',
  dependency: 'Dependency graph',
  process: 'Process graph',
  boxplot: 'Box plot',
  candlestick: 'Candlestick',
  dumbbell: 'Dumbbell',
  histogram: 'Histogram',
  sunburst: 'Sunburst',
  treemap: 'Treemap',
  waterfall: 'Waterfall',
  sparkline: 'Sparkline',
  telemetry: 'Telemetry (multi-line)',
  hybrid: 'Hybrid bar + line',
  combo: 'Combo / dual axis',
}

const SLUG_GROUPS = {
  trends: new Set([
    'line',
    'area',
    'step',
    'stream',
    'range',
    'hybrid',
    'combo',
    'candlestick',
    'telemetry',
    'sparkline',
    'series-trend',
    'contribution-skyline',
  ]),
  comparison: new Set([
    'column',
    'bar',
    'stacked',
    'grouped',
    'dumbbell',
    'bullet',
    'waterfall',
    'polar',
    'radar',
    'radial',
  ]),
  parts: new Set(['pie', 'donut', 'treemap', 'sunburst', 'pyramid']),
  distribution: new Set(['scatter', 'bubble', 'histogram', 'boxplot']),
  activity: new Set(['heatmap', 'heatmap-b', 'heatmap-c', 'matrix', 'hourmap', 'cohort', 'gantt']),
  kpi: new Set(['kpi', 'speed', 'arc', 'rings', 'status-gauge']),
  flows: new Set([
    'funnel',
    'sankey',
    'status-funnel',
    'dependency',
    'process',
    'flowchart',
    'state-diagram',
  ]),
}

export const MARGIN_GRAPH_GROUP_META = [
  { id: 'trends', title: 'Trends over time' },
  { id: 'comparison', title: 'Comparison' },
  { id: 'parts', title: 'Parts of a whole' },
  { id: 'distribution', title: 'Distribution and relationships' },
  { id: 'activity', title: 'Activity and time grids' },
  { id: 'kpi', title: 'KPIs and progress' },
  { id: 'flows', title: 'Flows and funnels' },
]

function groupFor(slug) {
  for (const [id, set] of Object.entries(SLUG_GROUPS)) {
    if (set.has(slug)) return id
  }
  return 'trends'
}

function titleFor(key) {
  if (TITLE_OVERRIDES[key]) return TITLE_OVERRIDES[key]
  const words = key
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
  if (['heatmap', 'matrix', 'hourmap', 'gantt', 'funnel', 'sankey'].some((k) => key.includes(k))) return words
  return `${words} chart`
}

/** @type {GraphPage[]} */
export const MARGIN_GRAPH_PAGES = Object.keys(examples.examples)
  .sort()
  .map((exampleKey) => ({
    slug: exampleKey,
    exampleKey,
    title: titleFor(exampleKey),
    component: examples.examples[exampleKey].component,
    group: groupFor(exampleKey),
  }))

export function graphPagesInGroup(groupId) {
  return MARGIN_GRAPH_PAGES.filter((p) => p.group === groupId)
}

export function graphSpecBundle(exampleKey) {
  const spec = structuredClone(examples.examples[exampleKey])
  const sourceId = spec.data.source
  const sources = { [sourceId]: structuredClone(examples.sources[sourceId]) }
  return { spec, sources }
}

/** Shared Motion section markdown for chart docs and agent stubs. */
export const MARGIN_GRAPH_MOTION_MD = `## Motion

Charts reuse the Margin preview motion stack (\`margin-motion.css\`) together with Felix SVG enter/update hooks on \`.fj-plot\`.

| Token | Default | Used for |
| --- | --- | --- |
| \`--mg-chart-enter-duration\` | \`0.45s\` | Plot fade/slide on enter |
| \`--mg-chart-line-duration\` | \`0.65s\` | Line and path stroke draw-in |
| \`--mg-chart-bar-duration\` | \`0.55s\` | Bars and columns growing from baseline |
| \`--mg-chart-arc-duration\` | \`0.7s\` | Donut, gauge, and arc sweeps |
| \`--mg-chart-value-duration\` | \`0.4s\` | Label/value count-up opacity |
| \`--mg-chart-morph-duration\` | \`0.5s\` | Data update morph after **Shuffle data** |
| \`--mg-chart-hover-duration\` | \`0.15s\` | Mark hover and readout easing |

All durations use \`ease-out\` unless noted in \`margin-graphs.css\`. Set \`--mg-chart-motion: none\` on \`.mg-graph-lab\` to disable chart motion while keeping theme transitions.

### Enter

- **Replay** increments the chart revision so the SVG remounts: lines draw in, bars grow from the baseline, donut and gauge arcs sweep, and values ease in.
- Motion starts only after hydration: \`.mg-guide-motion\` is applied on the next \`requestAnimationFrame\` after mount (same pattern as component previews). No enter animation runs on the server HTML.

### Data updates

- **Shuffle data** perturbs numeric cells in the local source and bumps revision so marks morph smoothly (token \`--mg-chart-morph-duration\`).
- Loading and empty states skip motion; the readout uses \`role="status"\`.

### Hover and tooltips

- Focusable marks use \`--mg-chart-hover-duration\` for opacity and stroke emphasis; exact values stay in the status readout and Data view table.

### Reduced motion

When \`prefers-reduced-motion: reduce\` is set, chart CSS forces instant render (no stroke draw, grow, sweep, or count-up). **Replay** still remounts data for testing but without animated transitions.

### Disable locally

\`\`\`css
.mg-graph-lab {
  --mg-chart-motion: none;
}
\`\`\`
`

export const MARGIN_GRAPH_ENTER_NOTES = {
  line: 'Polylines and paths use stroke dash-offset draw-in.',
  area: 'Area boundary draws in; fill fades with the plot enter.',
  bar: 'Rects scale from the category baseline (transform-origin bottom).',
  column: 'Rects scale from the category baseline (transform-origin bottom).',
  stacked: 'Stack segments grow from baseline per stack.',
  grouped: 'Grouped bars grow together per category.',
  donut: 'Arc segments sweep using stroke dasharray.',
  pie: 'Arc segments sweep using stroke dasharray.',
  funnel: 'Stages ease in with plot enter.',
  default: 'Marks use the shared enter duration on replay.',
}