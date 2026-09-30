<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const statusLabel = { done: 'Completado', run: 'En curso', wait: 'Pendiente' }

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
  { id: 'quote', name: 'Cotización', depends: 'Sin dependencias', status: 'done', col: 1, row: 1 },
  { id: 'kyc', name: 'KYC', depends: 'Sin dependencias', status: 'done', col: 3, row: 1 },
  { id: 'ledger', name: 'Ledger', depends: 'Cotización y KYC', status: 'run', col: 2, row: 2 },
  { id: 'payout', name: 'Payout', depends: 'Ledger', status: 'wait', col: 2, row: 3 },
  { id: 'receipt', name: 'Recibo', depends: 'Payout', status: 'wait', col: 2, row: 4 }
]
const procLinks = [
  ['quote', 'ledger'],
  ['kyc', 'ledger'],
  ['ledger', 'payout'],
  ['payout', 'receipt']
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
const procsDone = computed(() => procs.value.every((item) => item.status === 'done'))

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

function advanceTasks(id) {
  advance(tasks, taskLinks, id, taskLive)
}

function advanceProcs(id) {
  advance(procs, procLinks, id, procLive)
}

function resetTasks() {
  tasks.value = copy(taskSeed)
  taskLive.value = 'Verificar identidad y Elegir destino están completadas. Crear envío está en curso.'
}

function resetProcs() {
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

The same kind of dependency, drawn as objects. Use it when the label is a system or a step. Press the object marked **En curso**.

<div class="fx-graph">
  <div class="fx-graph-bar">
    <p v-if="procsDone" class="fx-graph-note">Todos los procesos quedaron listos.</p>
    <button type="button" class="fx-btn fx-btn-line" @click="resetProcs">Reiniciar</button>
  </div>
  <div class="fx-obj-board" ref="procBoard">
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
    <button v-for="node in procs" :key="node.id" type="button" :ref="(el) => bind(procEls, node.id, el)" class="fx-obj" :class="node.status" :style="{ '--col': node.col, '--row': node.row }" :aria-disabled="node.status !== 'run'" @click="advanceProcs(node.id)">
      <i data-anchor></i>
      <span class="fx-obj-name">{{ node.name }}</span>
      <small>{{ node.status === 'run' ? 'En curso · Avanzar' : statusLabel[node.status] }}</small>
      <small>{{ dependsText(node) }}</small>
    </button>
  </div>
  <p class="fx-sr" aria-live="polite">{{ procLive }}</p>
</div>

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
