<script setup>
import SankeyFunnel from '../../.vitepress/theme/SankeyFunnel.vue'
import StatusCharts from '../../.vitepress/theme/StatusCharts.vue'
import ChartGallery from '../../.vitepress/theme/ChartGallery.vue'
import SeriesTrend from '../../.vitepress/theme/SeriesTrend.vue'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const statusLabel = { done: 'Completado', run: 'En curso', wait: 'Pendiente', block: 'Bloqueado', error: 'Con error', idle: 'Inactivo', unknown: 'Desconocido' }

const taskSeed = [
  { id: 'identity', name: 'Verificar identidad', detail: 'María · INE', desc: 'Validar el documento de María contra el registro.', tags: ['Cumplimiento'], depends: 'Sin dependencias', status: 'done', col: 1, row: 1, wide: false },
  { id: 'destination', name: 'Elegir destino', detail: 'OXXO · CDMX', desc: 'María elige dónde cobra la familia.', tags: ['Envíos'], depends: 'Sin dependencias', status: 'done', col: 2, row: 1, wide: false },
  { id: 'transfer', name: 'Crear envío', detail: '$100.00 · comisión $0.00', desc: 'Crear el envío cuando identidad y destino estén listos.', tags: ['Envíos', 'Pagos'], depends: 'Verificar identidad y Elegir destino', status: 'run', col: 1, row: 2, wide: true },
  { id: 'confirm', name: 'Confirmar monto', detail: 'María revisa el total', desc: 'María revisa el total antes de pagar.', tags: ['Pagos'], depends: 'Crear envío', status: 'wait', col: 1, row: 3, wide: true },
  { id: 'deliver', name: 'Entregar', detail: '1–3 días hábiles', desc: 'La familia cobra en la tienda.', tags: ['Entregas'], depends: 'Confirmar monto', status: 'wait', col: 1, row: 4, wide: true }
]
const taskLinks = [
  ['identity', 'transfer'],
  ['destination', 'transfer'],
  ['transfer', 'confirm'],
  ['confirm', 'deliver']
]
const procSeed = [
  { id: 'quote', name: 'Cotización', label: 'felix.quote', depends: 'Sin dependencias', status: 'done', pid: '4121', cwd: '/srv/quote', exit: '0' },
  { id: 'kyc', name: 'KYC', label: 'felix.kyc', depends: 'Sin dependencias', status: 'done', pid: '4122', cwd: '/srv/kyc', exit: '0' },
  { id: 'ledger', name: 'Ledger', label: 'felix.ledger', depends: 'Cotización y KYC', status: 'run', pid: '4180', cwd: '/srv/ledger', exit: '-' },
  { id: 'payout', name: 'Payout', label: 'felix.payout', depends: 'Ledger', status: 'wait', pid: '-', cwd: '/srv/payout', exit: '-' },
  { id: 'notify', name: 'Notificar', label: 'felix.notify', depends: 'Ledger', status: 'error', pid: '-', cwd: '/srv/notify', exit: '78' },
  { id: 'audit', name: 'Auditoría', label: 'felix.audit', depends: 'Ledger', status: 'idle', pid: '-', cwd: '/srv/audit', exit: '-' },
  { id: 'receipt', name: 'Recibo', label: 'felix.receipt', depends: 'Payout', status: 'wait', pid: '-', cwd: '/srv/receipt', exit: '-' },
  { id: 'archive', name: 'Archivo', label: 'felix.archive', depends: 'Recibo', status: 'unknown', pid: '-', cwd: '/srv/archive', exit: '-' }
]
const procLinks = [
  ['quote', 'ledger'],
  ['kyc', 'ledger'],
  ['ledger', 'payout'],
  ['ledger', 'notify'],
  ['ledger', 'audit'],
  ['payout', 'receipt'],
  ['receipt', 'archive']
]
const diagrams = [
  {
    key: 'flow',
    heading: 'Dependency flowchart',
    label: 'Verificar identidad y elegir destino apuntan a crear envío. Crear envío apunta a confirmar monto, y confirmar monto apunta a entregar.',
    code: `flowchart TD
  identity[Verificar identidad] --> transfer[Crear envío]
  destination[Elegir destino] --> transfer
  transfer --> confirm[Confirmar monto]
  confirm --> deliver[Entregar]
  classDef ok fill:#eefbf0,stroke:#60d06f,color:#1b7a29
  classDef run fill:#fffce0,stroke:#ffd200,color:#665500
  classDef wait fill:#fefcf9,stroke:#cfcabf,color:#35605f
  class identity,destination ok
  class transfer run
  class confirm,deliver wait`
  },
  {
    key: 'state',
    heading: 'Status states',
    label: 'Pendiente pasa a en curso cuando las dependencias están listas. En curso puede completarse o bloquearse. Bloqueado vuelve a en curso al reintentar.',
    code: `stateDiagram-v2
  [*] --> pending
  pending --> running: dependencias listas
  running --> done: confirmar
  running --> blocked: falla
  blocked --> running: reintentar
  state "Pendiente" as pending
  state "En curso" as running
  state "Completado" as done
  state "Bloqueado" as blocked
  classDef wait fill:#fefcf9,stroke:#cfcabf,color:#35605f
  classDef run fill:#fffce0,stroke:#ffd200,color:#665500
  classDef ok fill:#eefbf0,stroke:#60d06f,color:#1b7a29
  classDef bad fill:#fff5ef,stroke:#f26629,color:#a03808
  class pending wait
  class running run
  class done ok
  class blocked bad`
  }
]

function copy(list) {
  return list.map((item) => ({ ...item }))
}

function dependsText(item) {
  return item.depends === 'Sin dependencias' ? 'Sin dependencias' : `Depende de ${item.depends}`
}

function unlockNext(items, links) {
  const started = []
  for (const item of items) {
    if (item.status !== 'wait') continue
    const incoming = links.filter((link) => link[1] === item.id)
    if (!incoming.length) continue
    const ready = incoming.every((link) => items.find((node) => node.id === link[0])?.status === 'done')
    if (!ready) continue
    item.status = 'run'
    started.push(item.name)
  }
  return started
}

function describeAfter(items, currentName) {
  const running = items.filter((item) => item.status === 'run').map((item) => item.name)
  if (!running.length) return `${currentName} quedó listo. No queda nada pendiente.`
  const phrase = running.length > 1 ? `${running.join(' y ')} están en curso.` : `${running[0]} está en curso.`
  return `${currentName} quedó listo. ${phrase}`
}

const tasks = ref(copy(taskSeed))
const procs = ref(copy(procSeed))
const taskPaths = ref([])
const procPaths = ref([])
const taskLive = ref('Verificar identidad y Elegir destino están completadas. Crear envío está en curso.')
const procLive = ref('Cotización y KYC están completados. Ledger está en curso.')
const wantMotion = ref(true)
const reduced = ref(false)
const showParticles = computed(() => wantMotion.value && !reduced.value)
const tasksDone = computed(() => tasks.value.every((item) => item.status === 'done'))

const taskBoard = ref(null)
const procBoard = ref(null)
const taskEls = new Map()
const procEls = new Map()
const mermaidEls = new Map()
let mermaidApi
let mermaidSeq = 0
let cleanup = () => {}

function bind(map, id, el) {
  if (el) map.set(id, el)
  else map.delete(id)
}

function layout(board, elements, items, links, paths) {
  const root = board.value
  if (!root || root.clientWidth < 8) return
  const boardBox = root.getBoundingClientRect()
  const next = []
  for (const [from, to] of links) {
    const fromEl = elements.get(from)
    const toEl = elements.get(to)
    if (!fromEl || !toEl) continue
    const fromBox = fromEl.getBoundingClientRect()
    const toMark = (toEl.querySelector('[data-anchor]') || toEl).getBoundingClientRect()
    const x1 = fromBox.left - boardBox.left + fromBox.width / 2
    const y1 = fromBox.bottom - boardBox.top + 2
    const x2 = toMark.left - boardBox.left + toMark.width / 2
    const y2 = toMark.top - boardBox.top - 2
    const mid = (y1 + y2) / 2
    const target = items.value.find((item) => item.id === to)
    next.push({
      id: `${from}-${to}`,
      d: `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${x1.toFixed(1)} ${mid.toFixed(1)}, ${x2.toFixed(1)} ${mid.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`,
      from,
      to,
      status: target?.status || 'wait'
    })
  }
  paths.value = next
}

function layoutTasks() {
  layout(taskBoard, taskEls, tasks, taskLinks, taskPaths)
}

function layoutProcs() {
  layout(procBoard, procEls, procs, procLinks, procPaths)
}

function advance(items, links, id, live) {
  const current = items.value.find((item) => item.id === id)
  if (!current || current.status !== 'run') return
  current.status = 'done'
  unlockNext(items.value, links)
  live.value = describeAfter(items.value, current.name)
}

function autoLayers(items, links) {
  const depth = {}
  const visit = (id) => {
    if (depth[id] !== undefined) return depth[id]
    depth[id] = 0
    const parents = links.filter((link) => link[1] === id).map((link) => link[0])
    depth[id] = parents.length ? 1 + Math.max(...parents.map(visit)) : 0
    return depth[id]
  }
  items.forEach((item) => visit(item.id))
  const rows = []
  items.forEach((item) => { (rows[depth[item.id]] ||= []).push(item) })
  for (let pass = 1; pass < rows.length; pass++) {
    const prev = rows[pass - 1].map((item) => item.id)
    const center = (item) => {
      const idx = links.filter((link) => link[1] === item.id).map((link) => prev.indexOf(link[0])).filter((i) => i >= 0)
      return idx.length ? idx.reduce((a, b) => a + b, 0) / idx.length : 0
    }
    rows[pass] = [...rows[pass]].sort((a, b) => center(a) - center(b))
  }
  return rows.filter(Boolean)
}

const procView = ref('graph')
const procSel = ref(null)
const procLayers = computed(() => autoLayers(procs.value, procLinks))
const procSelected = computed(() => procs.value.find((item) => item.id === procSel.value) || null)
const procNames = computed(() => Object.fromEntries(procs.value.map((item) => [item.id, item.name])))
const procUnlocks = computed(() => procSel.value ? procLinks.filter((link) => link[0] === procSel.value).map((link) => procNames.value[link[1]]).join(', ') || 'Nada' : '')

function selectProc(id) {
  procSel.value = procSel.value === id ? null : id
  const item = procs.value.find((entry) => entry.id === id)
  if (procSel.value && item) procLive.value = `${item.name}: ${statusLabel[item.status]}.`
}

function completeProc(id) {
  advance(procs, procLinks, id, procLive)
}

function retryProc(id) {
  const item = procs.value.find((entry) => entry.id === id)
  if (!item || item.status !== 'error') return
  item.status = 'run'
  item.exit = '-'
  procLive.value = `${item.name} se reintentó y está en curso.`
}

function setProcView(view) {
  procView.value = view
  if (view === 'graph') nextTick(() => layoutProcs())
}

const taskFocus = ref(null)
const taskById = computed(() => Object.fromEntries(tasks.value.map((item) => [item.id, item])))
const taskDeps = computed(() => taskFocus.value ? taskLinks.filter((link) => link[1] === taskFocus.value).map((link) => link[0]) : [])
const taskNext = computed(() => taskFocus.value ? taskLinks.filter((link) => link[0] === taskFocus.value).map((link) => link[1]) : [])
const taskFocusText = computed(() => {
  const item = taskById.value[taskFocus.value]
  if (!item) return 'Pasa el cursor o enfoca una tarea para ver de qué depende y a quién desbloquea.'
  const names = (ids) => ids.map((id) => taskById.value[id].name).join(' y ')
  const from = taskDeps.value.length ? `depende de ${names(taskDeps.value)}` : 'no depende de nada'
  const to = taskNext.value.length ? `desbloquea ${names(taskNext.value)}` : 'no desbloquea nada'
  return `${item.name} ${from} y ${to}.`
})

function focusClass(id) {
  if (!taskFocus.value) return ''
  if (id === taskFocus.value) return 'is-focus'
  if (taskDeps.value.includes(id)) return 'is-dep'
  if (taskNext.value.includes(id)) return 'is-next'
  return ''
}

function edgeHot(edge) {
  return !!taskFocus.value && (edge.from === taskFocus.value || edge.to === taskFocus.value)
}

function blockTask(id) {
  const item = taskById.value[id]
  if (!item || item.status !== 'run') return
  item.status = 'block'
  taskLive.value = `${item.name} quedó bloqueado.`
}

function resumeTask(id) {
  const item = taskById.value[id]
  if (!item || item.status !== 'block') return
  item.status = 'run'
  taskLive.value = `${item.name} se reanudó y está en curso.`
}

function advanceTasks(id) {
  advance(tasks, taskLinks, id, taskLive)
}


function resetTasks() {
  tasks.value = copy(taskSeed)
  taskLive.value = 'Verificar identidad y Elegir destino están completadas. Crear envío está en curso.'
}

function resetProcs() {
  procSel.value = null
  procs.value = copy(procSeed)
  procLive.value = 'Cotización y KYC están completados. Ledger está en curso.'
}

const darkClassDefs = [
  ['fill:#eefbf0,stroke:#60d06f,color:#1b7a29', 'fill:#1f4d3a,stroke:#60d06f,color:#8ee79a'],
  ['fill:#fffce0,stroke:#ffd200,color:#665500', 'fill:#4a4210,stroke:#ffd200,color:#ffe066'],
  ['fill:#fefcf9,stroke:#cfcabf,color:#35605f', 'fill:#152b2a,stroke:#35605f,color:#c3e2e1'],
  ['fill:#fff5ef,stroke:#f26629,color:#a03808', 'fill:#4a2a1c,stroke:#f26629,color:#ff9f66']
]

function mermaidSource(code, dark) {
  return dark ? darkClassDefs.reduce((out, [from, to]) => out.split(from).join(to), code) : code
}

async function drawMermaid() {
  if (typeof window === 'undefined') return
  const dark = document.documentElement.classList.contains('felix-dark')
  if (!mermaidApi) mermaidApi = (await import('mermaid')).default
  {
    mermaidApi.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      suppressErrorRendering: true,
      theme: 'base',
      fontFamily: 'Saans, ui-sans-serif, system-ui, sans-serif',
      flowchart: { curve: 'basis', htmlLabels: false, padding: 12, nodeSpacing: 24, rankSpacing: 40 },
      themeVariables: {
        darkMode: dark,
        background: dark ? '#234343' : '#ffffff',
        fontFamily: 'Saans, ui-sans-serif, system-ui, sans-serif',
        fontSize: '14px',
        primaryColor: dark ? '#152b2a' : '#fefcf9',
        primaryTextColor: dark ? '#fefcf9' : '#082422',
        primaryBorderColor: dark ? '#35605f' : '#cfcabf',
        lineColor: dark ? '#97cbc9' : '#35605f',
        textColor: dark ? '#fefcf9' : '#082422',
        mainBkg: dark ? '#152b2a' : '#fefcf9',
        nodeBorder: dark ? '#35605f' : '#cfcabf',
        edgeLabelBackground: dark ? '#234343' : '#ffffff',
        nodeTextColor: dark ? '#fefcf9' : '#082422'
      }
    })
  }
  for (const diagram of diagrams) {
    const host = mermaidEls.get(diagram.key)
    if (!host) continue
    try {
      const { svg } = await mermaidApi.render(`fxm${diagram.key}${++mermaidSeq}`, mermaidSource(diagram.code, dark))
      host.innerHTML = svg
      host.querySelectorAll('path[marker-end], line[marker-end], .flowchart-link, path.transition').forEach((el) => {
        el.classList.add('fx-flow-edge')
      })
      host.querySelector('svg')?.setAttribute('aria-hidden', 'true')
    } catch {
      host.textContent = 'This diagram could not be drawn.'
    }
  }
}

watch(tasks, () => layoutTasks(), { deep: true, flush: 'post' })
watch(procs, () => layoutProcs(), { deep: true, flush: 'post' })

onMounted(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value = media.matches
  const onMotion = () => { reduced.value = media.matches }
  media.addEventListener('change', onMotion)
  const observers = [taskBoard.value, procBoard.value].filter(Boolean).map((board) => {
    const observer = new ResizeObserver(() => {
      layoutTasks()
      layoutProcs()
    })
    observer.observe(board)
    return observer
  })
  nextTick(() => {
    layoutTasks()
    layoutProcs()
  })
  document.fonts?.ready.then(() => {
    layoutTasks()
    layoutProcs()
  })
  drawMermaid()
  const themeObserver = new MutationObserver(() => drawMermaid())
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  cleanup = () => {
    themeObserver.disconnect()
    media.removeEventListener('change', onMotion)
    observers.forEach((observer) => observer.disconnect())
  }
})

onUnmounted(() => cleanup())
</script>

# Charts

Every chart and graph in the Felix palette, on one page. Each one has a live preview with its motion, and a short note on when to use it. Synthetic data only.

## All charts

### Trends over time

- [Spline line · single / dual](/felix/components/charts#mono-line)
- [Gradient spline area](/felix/components/charts#mono-area)
- [Step progression](/felix/components/charts#mono-step)
- [Stream wave](/felix/components/charts#mono-stream)
- [Min/max range band](/felix/components/charts#mono-range)
- [Pill bars + spline](/felix/components/charts#mono-hybrid)
- [Dual-axis · revenue / occupancy](/felix/components/charts#mono-combo)
- [Financial candlesticks](/felix/components/charts#mono-candle)
- [Telemetry sparklines](/felix/components/charts#mono-telemetry)
- [Line](/felix/components/charts#basic-line)
- [Area](/felix/components/charts#basic-area)
- [Sparkline](/felix/components/charts#basic-sparkline)
- [Series filter + bars + trend](/felix/components/charts#series-filter-bars-trend)

### Comparison

- [Pill bars · column / row](/felix/components/charts#mono-bars)
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

- [Rounded donut](/felix/components/charts#mono-donut)
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

- [Activity heatmap · Emerald](/felix/components/charts#mono-heat-green)
- [Activity heatmap · Sky](/felix/components/charts#mono-heat-blue)
- [Activity heatmap · Violet](/felix/components/charts#mono-heat-purple)
- [Dot-matrix heatmap](/felix/components/charts#mono-matrix)
- [Day × hour · studio occupancy](/felix/components/charts#mono-hourmap)
- [Cohort · member retention](/felix/components/charts#mono-cohort)
- [Gantt · studio timeline](/felix/components/charts#mono-gantt)
- [Heatmap](/felix/components/charts#basic-heatmap)

### KPIs and progress

- [KPI with sparkline](/felix/components/charts#mono-kpi)
- [Speedometer](/felix/components/charts#mono-speed)
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

Includes 30 patterns adapted from the [Amicro reference](https://amicro.vercel.app/mono-charts), plus eight dashboard patterns (histogram, Gantt, day/hour heatmap, cohort retention, box plot, dual-axis combo, dumbbell and sunburst). Each card has synthetic data, hover/focus readouts, keyboard buttons and reduced-motion support. Dataset A/B updates time-series charts; allocation, target and flow examples use their own labeled fixtures. Existing chart examples remain below.

<ChartGallery language="felix" />

### Integration notes

Import ChartGallery.vue for a demo or extract a single card into your application. Replace the synthetic arrays, label units, handle missing data, and use the Ready/Loading/Empty selector to preview chart states, and add error handling before live use. Sankey band width encodes flow; treemap tile area encodes share; waterfall bars encode signed deltas; candlesticks expose open/high/low/close in the readout. Charts should supplement, not replace, accessible data tables. The three colored activity grids are variants of one chart family.

## Series filter + bars + trend

Bars per month with a segmented filter ("All" sums the series). The trend is a least-squares line over complete months only, so the current month is left out, and it needs 3 or more months with data. A missing month shows a dash and no bar. Fictitious data. Motion replays when the filter changes and stops with reduced motion.

<SeriesTrend language="felix" />

## Chart types

Data graphics in the Felix palette. Series order: turquoise `#2bf2f1`, cactus `#42b552`, mango `#f19d38`, blueberry `#6e58d8`, papaya `#f77b42`, lime `#dcff00`. Numbers below are a sample of monthly transfers, not live data.

<div class="fx-charts">

<section class="fx-chart">
<h3 id="basic-line">Line</h3>
<p class="fx-chart-desc">Trend over time with a draw-in line and a dot at each point.</p>
<svg viewBox="0 0 340 160" role="img" aria-label="Line chart, monthly transfers from 42 to 80">
<path d="M28 120 H320 M28 80 H320 M28 40 H320" fill="none" stroke="#efebe7"/>
<polyline points="28,100.8 84,80 140,91.2 196,56 252,67.2 308,40" fill="none" stroke="#0f8c8b" stroke-width="3" stroke-linejoin="round"/>
<circle cx="28" cy="100.8" r="4" fill="#2bf2f1"/><circle cx="84" cy="80" r="4" fill="#2bf2f1"/><circle cx="140" cy="91.2" r="4" fill="#2bf2f1"/><circle cx="196" cy="56" r="4" fill="#2bf2f1"/><circle cx="252" cy="67.2" r="4" fill="#2bf2f1"/><circle cx="308" cy="40" r="4" fill="#2bf2f1"/>
<text x="28" y="148">Ene</text><text x="84" y="148">Feb</text><text x="140" y="148">Mar</text><text x="196" y="148">Abr</text><text x="252" y="148">May</text><text x="308" y="148">Jun</text>
</svg>
</section>

<section class="fx-chart">
<h3 id="basic-area">Area</h3>
<p class="fx-chart-desc">A line with a filled area, for volume that builds over time.</p>
<svg viewBox="0 0 340 160" role="img" aria-label="Area chart of monthly transfers">
<path d="M28 120 H320 M28 80 H320 M28 40 H320" fill="none" stroke="#efebe7"/>
<path d="M28,100.8 L84,80 L140,91.2 L196,56 L252,67.2 L308,40 L308,120 L28,120 Z" fill="#2bf2f133"/>
<polyline points="28,100.8 84,80 140,91.2 196,56 252,67.2 308,40" fill="none" stroke="#2bf2f1" stroke-width="3"/>
<text x="28" y="148">Ene</text><text x="308" y="148" text-anchor="end">Jun</text>
</svg>
</section>

<section class="fx-chart">
<h3 id="basic-column-bar">Column bar</h3>
<p class="fx-chart-desc">Vertical bars that grow from zero, for comparing categories.</p>
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
<h3 id="basic-horizontal-bar">Horizontal bar</h3>
<p class="fx-chart-desc">Horizontal bars for long labels and ranked lists.</p>
<svg viewBox="0 0 340 160" role="img" aria-label="Horizontal bar chart ranked by volume">
<text x="4" y="28">Jun</text><rect x="40" y="16" width="250" height="16" rx="8" fill="#dcff00"/>
<text x="4" y="56">Abr</text><rect x="40" y="44" width="218" height="16" rx="8" fill="#6e58d8"/>
<text x="4" y="84">May</text><rect x="40" y="72" width="196" height="16" rx="8" fill="#f77b42"/>
<text x="4" y="112">Feb</text><rect x="40" y="100" width="172" height="16" rx="8" fill="#42b552"/>
<text x="4" y="140">Mar</text><rect x="40" y="128" width="150" height="16" rx="8" fill="#f19d38"/>
</svg>
</section>

<section class="fx-chart">
<h3 id="basic-grouped-bar">Grouped bar</h3>
<p class="fx-chart-desc">Two or more bars per category, side by side.</p>
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
<h3 id="basic-stacked-bar">Stacked bar</h3>
<p class="fx-chart-desc">Bars split into parts that add up to the total.</p>
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
<h3 id="basic-pie">Pie</h3>
<p class="fx-chart-desc">Slices of one whole, each with a label.</p>
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
<h3 id="basic-donut">Donut</h3>
<p class="fx-chart-desc">A pie with a hole, with the total in the middle.</p>
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
<h3 id="basic-scatter">Scatter</h3>
<p class="fx-chart-desc">Dots on two axes to show how two values relate.</p>
<svg viewBox="0 0 340 160" role="img" aria-label="Scatter of amount versus time">
<path d="M28 24 V124 H320" fill="none" stroke="#efebe7"/>
<circle cx="60" cy="96" r="7" fill="#2bf2f1"/><circle cx="110" cy="70" r="7" fill="#42b552"/><circle cx="150" cy="88" r="7" fill="#f19d38"/><circle cx="200" cy="52" r="7" fill="#6e58d8"/><circle cx="240" cy="64" r="7" fill="#f77b42"/><circle cx="290" cy="36" r="7" fill="#dcff00"/>
</svg>
</section>

<section class="fx-chart">
<h3 id="basic-bubble">Bubble</h3>
<p class="fx-chart-desc">Dots sized by a third value.</p>
<svg viewBox="0 0 340 160" role="img" aria-label="Bubble chart, size is transfer count">
<path d="M28 24 V124 H320" fill="none" stroke="#efebe7"/>
<circle cx="70" cy="90" r="16" fill="#2bf2f1" fill-opacity=".75"/><circle cx="130" cy="72" r="22" fill="#42b552" fill-opacity=".75"/><circle cx="180" cy="96" r="14" fill="#f19d38" fill-opacity=".75"/><circle cx="230" cy="58" r="26" fill="#6e58d8" fill-opacity=".75"/><circle cx="290" cy="48" r="20" fill="#dcff00" fill-opacity=".85"/>
</svg>
</section>

<section class="fx-chart">
<h3 id="basic-sparkline">Sparkline</h3>
<p class="fx-chart-desc">A tiny trend line with no axes, for tables and cards.</p>
<p class="fx-metric">80 <small>jun</small></p>
<svg viewBox="0 0 340 80" role="img" aria-label="Sparkline ending at 80">
<polyline points="8,50 64,38 120,44 176,22 232,28 308,8" fill="none" stroke="#0f8c8b" stroke-width="3" stroke-linecap="round"/>
<circle cx="308" cy="8" r="4" fill="#2bf2f1"/>
</svg>
</section>

<section class="fx-chart">
<h3 id="basic-radar">Radar</h3>
<p class="fx-chart-desc">Several scores on one web, to compare shapes.</p>
<svg viewBox="0 0 200 180" role="img" aria-label="Radar of six months">
<polygon points="100,16 164,48 164,120 100,156 36,120 36,48" fill="none" stroke="#cfcabf"/>
<polygon points="100,46 138,66 138,108 100,128 62,108 62,66" fill="none" stroke="#efebe7"/>
<polygon points="100,40 150,58 142,112 100,140 58,108 48,62" fill="#2bf2f144" stroke="#0f8c8b" stroke-width="2"/>
</svg>
</section>

<section class="fx-chart">
<h3 id="basic-heatmap">Heatmap</h3>
<p class="fx-chart-desc">A grid where color shows how much happened.</p>
<div class="fx-heat" role="img" aria-label="Heatmap of weekday by month">
<span></span><span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span>
<span>Lun</span><i style="background:#d4fffe"></i><i style="background:#8dfdfa"></i><i style="background:#2bf2f1"></i><i style="background:#0f8c8b"></i>
<span>Mié</span><i style="background:#efebe7"></i><i style="background:#d4fffe"></i><i style="background:#5af5f4"></i><i style="background:#2bf2f1"></i>
<span>Vie</span><i style="background:#8dfdfa"></i><i style="background:#2bf2f1"></i><i style="background:#1abfbe"></i><i style="background:#065958"></i>
</div>
</section>

<section class="fx-chart">
<h3 id="basic-gauge">Gauge</h3>
<p class="fx-chart-desc">One value against a target, on a half dial.</p>
<svg viewBox="0 0 180 110" role="img" aria-label="72 percent of the monthly target">
<path d="M20 90 A70 70 0 0 1 160 90" fill="none" stroke="#efebe7" stroke-width="14" stroke-linecap="round"/>
<path d="M20 90 A70 70 0 0 1 132 28" fill="none" stroke="#2bf2f1" stroke-width="14" stroke-linecap="round"/>
<text x="90" y="86" text-anchor="middle" font-size="22" font-weight="700" fill="#082422">72%</text>
</svg>
</section>

<section class="fx-chart">
<h3 id="basic-histogram">Histogram</h3>
<p class="fx-chart-desc">Counts per range, to show how values spread.</p>
<svg viewBox="0 0 340 160" role="img" aria-label="Histogram of transfer amounts">
<rect x="36" y="90" width="40" height="30" fill="#d4fffe"/><rect x="84" y="60" width="40" height="60" fill="#8dfdfa"/><rect x="132" y="36" width="40" height="84" fill="#2bf2f1"/><rect x="180" y="52" width="40" height="68" fill="#1abfbe"/><rect x="228" y="78" width="40" height="42" fill="#0f8c8b"/>
<text x="56" y="145" text-anchor="middle">0–20</text><text x="104" y="145" text-anchor="middle">20–40</text><text x="152" y="145" text-anchor="middle">40–60</text><text x="200" y="145" text-anchor="middle">60–80</text><text x="248" y="145" text-anchor="middle">80+</text>
</svg>
</section>

<section class="fx-chart">
<h3 id="basic-funnel">Funnel</h3>
<p class="fx-chart-desc">Stages that narrow as people drop off.</p>
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
<h3 id="basic-waterfall">Waterfall</h3>
<p class="fx-chart-desc">How a total is built from gains and losses.</p>
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

## Graphs and flows

A dependency is a line between two pieces of work. Status uses the Felix semantic colors: completed, in progress, pending, and blocked. Turquoise stays on the action. An edge animates only while that dependency is in progress, and the animation stops when motion is reduced.

<div class="fx-graph-toolbar">
  <ul class="fx-status-legend">
    <li class="ok">Completado</li>
    <li class="run">En curso</li>
    <li>Pendiente</li>
    <li class="bad">Bloqueado</li>
  </ul>
  <button type="button" class="fx-btn fx-btn-line" :disabled="reduced" :aria-pressed="!showParticles" @click="wantMotion = !wantMotion">{{ reduced ? 'Sin movimiento' : (wantMotion ? 'Pausar' : 'Reanudar') }}</button>
</div>

<div class="fx-gcard">

### Dependent task cards

The card is the task. The line is the dependency, and the same dependency is written on the card. Hover or focus a card to light up what it waits on and what it unblocks. Press **Avanzar** on the task in progress, or **Bloquear** to stop it; a blocked task keeps everything after it waiting until you press **Reanudar**. Tags name the teams involved. The next task starts once every card that points to it is complete.

Identity and destination can finish on their own. Creating the transfer waits for both.

<div class="fx-graph">
  <div class="fx-graph-bar">
    <p v-if="tasksDone" class="fx-graph-note">Todas las tareas quedaron listas.</p>
    <p v-else class="fx-focus-note" :class="{ 'is-active': taskFocus }">{{ taskFocusText }}</p>
    <button type="button" class="fx-btn fx-btn-line" @click="resetTasks">Reiniciar</button>
  </div>
  <div class="fx-dep-board" :class="{ 'is-focusing': taskFocus }" ref="taskBoard">
    <svg class="fx-edges" aria-hidden="true">
      <defs>
        <marker id="fx-arrow-tasks" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1.5 L8 5 L1 8.5" fill="none" stroke="context-stroke" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </marker>
      </defs>
      <path v-for="edge in taskPaths" :key="edge.id" class="fx-edge fx-link" :class="{ 'is-hot': edgeHot(edge) }" :data-status="edge.status" :d="edge.d" marker-end="url(#fx-arrow-tasks)" />
      <circle v-for="edge in taskPaths.filter((edge) => showParticles && edge.status === 'run')" :key="`${edge.id}-dot`" r="3.5" fill="#665500">
        <animateMotion dur="1.5s" repeatCount="indefinite" :path="edge.d" />
      </circle>
    </svg>
    <article v-for="task in tasks" :key="task.id" :ref="(el) => bind(taskEls, task.id, el)" class="fx-dep" :class="[task.status, focusClass(task.id), { wide: task.wide }]" :style="{ '--col': task.col, '--row': task.row }" tabindex="0" @mouseenter="taskFocus = task.id" @mouseleave="taskFocus = null" @focus="taskFocus = task.id" @blur="taskFocus = null">
      <header>
        <strong>{{ task.name }}</strong>
        <span>{{ statusLabel[task.status] }}</span>
      </header>
      <small>{{ task.detail }}</small>
      <small>{{ task.desc }}</small>
      <small class="fx-depends">{{ dependsText(task) }}</small>
      <div v-if="task.status === 'run' || task.status === 'block'" class="fx-dep-actions">
        <button v-if="task.status === 'run'" type="button" class="fx-btn fx-btn-primary" @click="advanceTasks(task.id)">Avanzar</button>
        <button v-if="task.status === 'run'" type="button" class="fx-btn fx-btn-line" @click="blockTask(task.id)">Bloquear</button>
        <button v-if="task.status === 'block'" type="button" class="fx-btn fx-btn-line" @click="resumeTask(task.id)">Reanudar</button>
      </div>
      <ul class="fx-tags" aria-label="Equipos"><li v-for="tag in task.tags" :key="tag">#{{ tag }}</li></ul>
    </article>
  </div>
  <p class="fx-sr" aria-live="polite">{{ taskLive }}</p>
</div>

</div>

<div class="fx-gcard">

### Process graph

The same kind of dependency, drawn as objects. Use it when the label is a system or a step, such as a background job. Six states: **Completado**, **En curso**, **Pendiente**, **Con error**, **Inactivo** and **Desconocido**. Objects place themselves in rows from their links, so a graph needs no coordinates. Select an object to see its detail table. **Completar** and **Reintentar** are demo actions on the selected object.

<div class="fx-graph fx-pg">
  <div class="fx-graph-bar">
    <div class="fx-pg-views" role="group" aria-label="Vista">
      <button type="button" class="fx-btn fx-btn-line" :aria-pressed="procView === 'graph'" @click="setProcView('graph')">Grafo</button>
      <button type="button" class="fx-btn fx-btn-line" :aria-pressed="procView === 'list'" @click="setProcView('list')">Lista</button>
    </div>
    <button type="button" class="fx-btn fx-btn-line" @click="resetProcs">Reiniciar</button>
  </div>
  <div v-show="procView === 'graph'" class="fx-obj-board fx-pg-board" ref="procBoard">
    <svg class="fx-edges" aria-hidden="true">
      <defs>
        <marker id="fx-arrow-proc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1.5 L8 5 L1 8.5" fill="none" stroke="context-stroke" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </marker>
      </defs>
      <path v-for="edge in procPaths" :key="edge.id" class="fx-edge" :data-status="edge.status" :d="edge.d" marker-end="url(#fx-arrow-proc)" />
      <circle v-for="edge in procPaths.filter((edge) => showParticles && edge.status === 'run')" :key="`${edge.id}-dot`" r="3.5" fill="#665500">
        <animateMotion dur="1.5s" repeatCount="indefinite" :path="edge.d" />
      </circle>
    </svg>
    <div v-for="(layer, row) in procLayers" :key="row" class="fx-pg-layer">
      <button v-for="node in layer" :key="node.id" type="button" :ref="(el) => bind(procEls, node.id, el)" class="fx-obj" :class="[node.status, { sel: procSel === node.id }]" :aria-pressed="procSel === node.id" @click="selectProc(node.id)">
        <i data-anchor></i>
        <span class="fx-obj-name">{{ node.name }}</span>
        <small>{{ statusLabel[node.status] }}</small>
      </button>
    </div>
  </div>
  <table v-if="procView === 'list'" class="fx-pg-list">
    <thead><tr><th>Proceso</th><th>Estado</th><th>PID</th><th>Depende de</th></tr></thead>
    <tbody>
      <tr v-for="node in procs" :key="node.id" :class="{ sel: procSel === node.id }">
        <td><button type="button" class="fx-pg-link" :aria-pressed="procSel === node.id" @click="selectProc(node.id)">{{ node.name }}</button></td>
        <td><span class="fx-pg-pill" :class="node.status">{{ statusLabel[node.status] }}</span></td>
        <td>{{ node.pid }}</td>
        <td>{{ node.depends }}</td>
      </tr>
    </tbody>
  </table>
  <div v-if="procSelected" class="fx-pg-detail">
    <div class="fx-pg-detail-head">
      <strong>{{ procSelected.name }}</strong>
      <span class="fx-pg-pill" :class="procSelected.status">{{ statusLabel[procSelected.status] }}</span>
      <button v-if="procSelected.status === 'run'" type="button" class="fx-btn fx-btn-line" @click="completeProc(procSelected.id)">Completar</button>
      <button v-if="procSelected.status === 'error'" type="button" class="fx-btn fx-btn-line" @click="retryProc(procSelected.id)">Reintentar</button>
    </div>
    <table class="fx-pg-table">
      <tbody>
        <tr><th scope="row">Etiqueta</th><td>{{ procSelected.label }}</td></tr>
        <tr><th scope="row">Estado</th><td>{{ statusLabel[procSelected.status] }}</td></tr>
        <tr><th scope="row">PID</th><td>{{ procSelected.pid }}</td></tr>
        <tr><th scope="row">Directorio</th><td>{{ procSelected.cwd }}</td></tr>
        <tr><th scope="row">Código de salida</th><td>{{ procSelected.exit }}</td></tr>
        <tr><th scope="row">Depende de</th><td>{{ procSelected.depends }}</td></tr>
        <tr><th scope="row">Desbloquea</th><td>{{ procUnlocks }}</td></tr>
      </tbody>
    </table>
  </div>
  <p class="fx-sr" aria-live="polite">{{ procLive }}</p>
</div>

Layout rules: a node sits one row below its deepest dependency, and nodes in a row are ordered by where their dependencies sit. Edges follow the target state: solid and animated into a running node, solid into a completed one, dotted into a pending, idle or unknown one, and papaya into a failed one. Color is never the only signal; every object carries its state in text. A real list view is the same data in a table, for screen readers and long graphs.

</div>

<div class="fx-gcard">

### Animated Mermaid

Mermaid stays the source of the diagram. Theme variables apply the Felix palette, and a dash runs along each edge. **Pausar** holds the labels in place. The flowchart matches the transfer above. The state diagram adds Bloqueado, in papaya, and that state stays still.

<div class="fx-mermaid-list">
  <div v-for="diagram in diagrams" :key="diagram.key" class="fx-mermaid-block">
    <h4>{{ diagram.heading }}</h4>
    <div class="fx-mermaid" :class="{ 'is-static': !showParticles }" role="img" :aria-label="diagram.label" :ref="(el) => bind(mermaidEls, diagram.key, el)">Loading diagram…</div>
    <details class="fx-source">
      <summary>Mermaid source</summary>
      <pre><code>{{ diagram.code }}</code></pre>
    </details>
  </div>
</div>

A short diagram can live in Mermaid. A board of real tasks keeps each label in HTML, as the cards and objects above do, and draws only the edges in SVG so every step can take focus.

</div>

## Conversion funnel (Sankey)

Multi-stage conversion flow with drop-offs, date ranges, play/pause and keyboard focus. It inherits this template's colors and works with synthetic data. Replace the stage counts with your own source of truth.

<SankeyFunnel title="Conversion funnel" />

## Status gauge and funnel

A weighted-progress gauge next to a by-status funnel. Hover or focus a gauge color or a funnel bar to see which status it is, how many cards it holds and what it counts for. The gap between gauge slices is drawn inside each slice, so the filled arc always ends exactly at the progress value.

<StatusCharts />
