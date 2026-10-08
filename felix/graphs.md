<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const statusLabel = { done: 'Completado', run: 'En curso', wait: 'Pendiente', error: 'Con error', idle: 'Inactivo', unknown: 'Desconocido' }

const taskSeed = [
  { id: 'identity', name: 'Verificar identidad', detail: 'María · INE', depends: 'Sin dependencias', status: 'done', col: 1, row: 1, wide: false },
  { id: 'destination', name: 'Elegir destino', detail: 'OXXO · CDMX', depends: 'Sin dependencias', status: 'done', col: 2, row: 1, wide: false },
  { id: 'transfer', name: 'Crear envío', detail: '$100.00 · comisión $0.00', depends: 'Verificar identidad y Elegir destino', status: 'run', col: 1, row: 2, wide: true },
  { id: 'confirm', name: 'Confirmar monto', detail: 'María revisa el total', depends: 'Crear envío', status: 'wait', col: 1, row: 3, wide: true },
  { id: 'deliver', name: 'Entregar', detail: '1–3 días hábiles', depends: 'Confirmar monto', status: 'wait', col: 1, row: 4, wide: true }
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

# Graphs

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

## Dependent task cards

The card is the task. The line is the dependency, and the same dependency is written on the card. Press **Avanzar** on the task in progress. The next task starts once every card that points to it is complete.

Identity and destination can finish on their own. Creating the transfer waits for both.

<div class="fx-graph">
  <div class="fx-graph-bar">
    <p v-if="tasksDone" class="fx-graph-note">Todas las tareas quedaron listas.</p>
    <button type="button" class="fx-btn fx-btn-line" @click="resetTasks">Reiniciar</button>
  </div>
  <div class="fx-dep-board" ref="taskBoard">
    <svg class="fx-edges" aria-hidden="true">
      <defs>
        <marker id="fx-arrow-tasks" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M1 1.5 L8 5 L1 8.5" fill="none" stroke="context-stroke" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </marker>
      </defs>
      <path v-for="edge in taskPaths" :key="edge.id" class="fx-edge" :data-status="edge.status" :d="edge.d" marker-end="url(#fx-arrow-tasks)" />
      <circle v-for="edge in taskPaths.filter((edge) => showParticles && edge.status === 'run')" :key="`${edge.id}-dot`" r="3.5" fill="#665500">
        <animateMotion dur="1.5s" repeatCount="indefinite" :path="edge.d" />
      </circle>
    </svg>
    <article v-for="task in tasks" :key="task.id" :ref="(el) => bind(taskEls, task.id, el)" class="fx-dep" :class="[task.status, { wide: task.wide }]" :style="{ '--col': task.col, '--row': task.row }">
      <header>
        <strong>{{ task.name }}</strong>
        <span>{{ statusLabel[task.status] }}</span>
      </header>
      <small>{{ task.detail }}</small>
      <small>{{ dependsText(task) }}</small>
      <button v-if="task.status === 'run'" type="button" class="fx-btn fx-btn-primary" @click="advanceTasks(task.id)">Avanzar</button>
    </article>
  </div>
  <p class="fx-sr" aria-live="polite">{{ taskLive }}</p>
</div>

## Process graph

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

## Animated Mermaid

Mermaid stays the source of the diagram. Theme variables apply the Felix palette, and a dash runs along each edge. **Pausar** holds the labels in place. The flowchart matches the transfer above. The state diagram adds Bloqueado, in papaya, and that state stays still.

<div class="fx-mermaid-list">
  <div v-for="diagram in diagrams" :key="diagram.key" class="fx-mermaid-block">
    <h3>{{ diagram.heading }}</h3>
    <div class="fx-mermaid" :class="{ 'is-static': !showParticles }" role="img" :aria-label="diagram.label" :ref="(el) => bind(mermaidEls, diagram.key, el)">Loading diagram…</div>
    <details class="fx-source">
      <summary>Mermaid source</summary>
      <pre><code>{{ diagram.code }}</code></pre>
    </details>
  </div>
</div>

A short diagram can live in Mermaid. A board of real tasks keeps each label in HTML, as the cards and objects above do, and draws only the edges in SVG so every step can take focus.
