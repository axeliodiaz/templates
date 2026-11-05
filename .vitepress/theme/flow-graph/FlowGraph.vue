<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import RelayIcon from '../RelayIcon.vue'
import { DEFAULT_LABELS } from './flow-graph.types'
import type { CallRecord, FlowGraphConfig, FlowNode, NodeKind } from './flow-graph.types'
import { anchorIn, anchorOut, bezier, deriveEdges, formatMs, hasAccess, headerStats, relationSentence, sortColumn, validateConfig } from './flow-graph.geometry'
const props = defineProps<{
  config: FlowGraphConfig; groupId?: string; detailNodeId?: string | null
  onSelectGroup?: (groupId: string) => void
  onNodeClick?: (p: { groupId: string; nodeId: string; kind: NodeKind }) => void
  onReplay?: (p: { groupId: string; nodeId: string; call: CallRecord }) => Promise<CallRecord>
  onBack?: (p: { groupId: string; nodeId: string }) => void
}>()
const emit = defineEmits<{ 'update:groupId': [string]; 'update:detailNodeId': [string | null] }>()
const uid = `fg-${useId()}`, root = ref<HTMLElement>(), stage = ref<HTMLElement>(), hydrated = ref(false)
const internalGroup = ref(props.config.defaultGroupId ?? props.config.groups[0]?.id ?? '')
const activeId = computed(() => props.groupId ?? internalGroup.value)
const group = computed(() => props.config.groups.find(g => g.id === activeId.value))
const labels = computed(() => ({ ...DEFAULT_LABELS, ...props.config.labels }))
const errorsFor = (id: string) => validateConfig({ groups: props.config.groups.filter(g => g.id === id) })
const valid = computed(() => !!group.value && !errorsFor(activeId.value).length)
const agent = computed(() => group.value?.nodes.find(n => n.kind === 'agent'))
const stats = computed(() => group.value ? headerStats(group.value) : { access: 0, total: 0, calls: 0 })
const relation = computed(() => group.value ? relationSentence(group.value, labels.value) : '')
const expanded = ref<Record<string, boolean>>({}), liveMessage = ref('')
const columns = computed(() => ([0, 1, 2] as const).map(column => {
  const nodes = group.value?.nodes.filter(n => (n.column ?? (n.kind === 'source' ? 0 : n.kind === 'agent' ? 1 : 2)) === column) ?? []
  const limit = Math.max(2, props.config.maxPerColumn ?? 6), overflow = nodes.length > limit
  const sorted = sortColumn(nodes, overflow && !expanded.value[column])
  return { id: column, nodes: overflow && !expanded.value[column] ? sorted.slice(0, limit - 1) : sorted, more: overflow ? nodes.length - (limit - 1) : 0 }
}))
const visibleIds = computed(() => new Set(columns.value.flatMap(c => c.nodes.map(n => n.id))))
const edges = computed(() => valid.value && group.value ? deriveEdges(group.value).filter(e => visibleIds.value.has(e.from) && visibleIds.value.has(e.to)) : [])
const dimensions = ref({ w: 1, h: 1 })
const knownIcons = new Set(['agent', 'agents', 'research', 'servers', 'tools', 'runs', 'approvals', 'code', 'user', 'ops', 'supabase', 'github', 'vercel', 'gmail', 'bell', 'help', 'fit', 'terminal', 'stripe', 'figma', 'database', 'web', 'notion', 'slack', 'hubspot', 'lock', 'alert', 'clock', 'replay', 'chevron-left'])
const statusLabel = (status: string) => status === 'running' ? labels.value.running : status === 'needs-you' ? labels.value.needsYou : status === 'failed' ? labels.value.failed : labels.value.agentIdle
const nodeStatus = (node: FlowNode) => node.status === 'no-access' ? labels.value.noAccess : node.status === 'idle' ? labels.value.idle : node.status === 'failed' ? `${labels.value.failed} · última llamada` : node.status === 'running' ? labels.value.running : node.lastCallMs !== undefined ? labels.value.lastCall(formatMs(node.lastCallMs)) : labels.value.idle
const edgeColor = (node: FlowNode) => `var(--rl-state-${node.status === 'failed' ? 'failed' : agent.value?.status ?? 'idle'})`
let mounted = false, raf = 0, announceTimer: ReturnType<typeof setTimeout> | undefined, ro: ResizeObserver | undefined
function measure() {
  raf = 0
  if (!mounted || !stage.value) return
  const origin = stage.value.getBoundingClientRect(), rects = new Map<string, DOMRect>()
  stage.value.querySelectorAll<HTMLElement>('[data-fg-node]').forEach(el => rects.set(el.dataset.fgNode!, el.getBoundingClientRect()))
  // Finish every layout read before writing any SVG geometry.
  const paths = edges.value.map(edge => {
    const a = rects.get(edge.from), b = rects.get(edge.to)
    if (!a || !b) return null
    const local = (r: DOMRect) => ({ left: r.left - origin.left, right: r.right - origin.left, top: r.top - origin.top, height: r.height })
    return { key: `${edge.from}->${edge.to}`, d: bezier(anchorOut(local(a)), anchorIn(local(b))) }
  })
  const ar = agent.value ? rects.get(agent.value.id) : undefined
  dimensions.value = { w: Math.max(1, origin.width), h: Math.max(1, origin.height) }
  const pathMap = new Map(paths.filter(p => p !== null).map(p => [p.key, p.d]))
  stage.value.querySelectorAll<SVGElement>('[data-edge]').forEach(el => {
    const d = pathMap.get(el.dataset.edge!)
    if (d) el.querySelectorAll('path').forEach(path => path.setAttribute('d', d))
  })
  if (ar) stage.value.querySelectorAll<SVGCircleElement>('.rl-fg-port').forEach(port => {
    port.setAttribute('cx', String((port.classList.contains('in') ? ar.left : ar.right) - origin.left))
    port.setAttribute('cy', String(ar.top - origin.top + ar.height / 2))
  })
}
function refresh() { if (mounted && !raf) raf = requestAnimationFrame(measure) }
function observeColumns() {
  ro?.disconnect()
  if (stage.value) { ro?.observe(stage.value); stage.value.querySelectorAll('.rl-fg-col').forEach(el => ro?.observe(el)) }
  refresh()
}
async function selectGroup(id: string, focus = false) {
  if (errorsFor(id).length) return
  internalGroup.value = id; expanded.value = {}; emit('update:groupId', id); props.onSelectGroup?.(id)
  await nextTick()
  if (focus) root.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach(tab => { if (tab.dataset.group === id) tab.focus() })
}
function tabKey(event: KeyboardEvent) {
  const ids = props.config.groups.filter(g => !errorsFor(g.id).length).map(g => g.id), index = ids.indexOf(activeId.value)
  const next = event.key === 'Home' ? ids[0] : event.key === 'End' ? ids.at(-1) : event.key === 'ArrowRight' ? ids[(index + 1) % ids.length] : event.key === 'ArrowLeft' ? ids[(index - 1 + ids.length) % ids.length] : undefined
  if (next) { event.preventDefault(); void selectGroup(next, true) }
}
function nodeClick(node: FlowNode) {
  if (!hasAccess(node) || node.kind === 'agent') return
  props.onNodeClick?.({ groupId: activeId.value, nodeId: node.id, kind: node.kind })
  if (group.value?.details?.[node.id]) emit('update:detailNodeId', node.id)
}
function nodeKey(event: KeyboardEvent, node: FlowNode, column: number) {
  const nodes = columns.value[column].nodes.filter(n => n.kind !== 'agent'), i = nodes.findIndex(n => n.id === node.id)
  let target: FlowNode | undefined
  if (event.key === 'ArrowDown') target = nodes[(i + 1) % nodes.length]
  if (event.key === 'ArrowUp') target = nodes[(i - 1 + nodes.length) % nodes.length]
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    const other = columns.value[column === 0 ? 2 : 0].nodes.filter(n => n.kind !== 'agent')
    target = other.reduce<FlowNode | undefined>((best, n) => !best || Math.abs((n.order ?? 0) - (node.order ?? i)) < Math.abs((best.order ?? 0) - (node.order ?? i)) ? n : best, undefined)
  }
  if (target) { event.preventDefault(); stage.value?.querySelectorAll<HTMLButtonElement>('button[data-fg-node]').forEach(el => { if (el.dataset.fgNode === target!.id) el.focus() }) }
}
function toggle(column: number) { expanded.value = { ...expanded.value, [column]: !expanded.value[column] } }
watch([group, expanded], async () => { if (!mounted) return; await nextTick(); observeColumns() }, { deep: true })
watch([activeId, stats, () => agent.value?.status], () => {
  if (!mounted) return
  clearTimeout(announceTimer)
  announceTimer = setTimeout(() => { liveMessage.value = `${group.value?.label}: ${stats.value.access} de ${stats.value.total} herramientas, ${labels.value.calls(stats.value.calls)}, ${statusLabel(agent.value?.status ?? 'idle').toLowerCase()}.` }, 300)
}, { deep: true })
onMounted(() => {
  mounted = true; hydrated.value = true; ro = new ResizeObserver(refresh)
  observeColumns(); document.fonts?.ready.then(() => { if (mounted) refresh() })
  if (import.meta.env.DEV) validateConfig(props.config).forEach(error => console.warn(`[FlowGraph] ${error}`))
})
onBeforeUnmount(() => { mounted = false; ro?.disconnect(); if (raf) cancelAnimationFrame(raf); clearTimeout(announceTimer) })
// TAM-03 adds the entrance choreography; the static API is already stable.
function replayEntrance() {}
defineExpose({ refresh, replayEntrance })
</script>

<template>
  <section ref="root" class="card rl-fg" :class="{ 'is-hydrated': hydrated, 'rl-fg--dense': edges.length > 24 }" :aria-labelledby="`${uid}-title`">
    <header class="rl-fg-head">
      <span class="rl-fg-icon" aria-hidden="true"><RelayIcon name="agent" /></span>
      <div class="rl-fg-grow"><h2 class="rl-fg-title" :id="`${uid}-title`">{{ labels.title }}</h2><p class="rl-fg-stats">{{ labels.tools(stats.access, stats.total) }} · {{ labels.calls(stats.calls) }}</p></div>
      <span v-if="agent" class="rl-fg-badge" :data-status="agent.status"><RelayIcon :name="agent.status === 'needs-you' || agent.status === 'failed' ? 'alert' : 'clock'" />{{ statusLabel(agent.status) }}</span>
    </header>
    <div class="rl-fg-tabs" role="tablist" :aria-label="labels.tabsAria" @keydown="tabKey">
      <button v-for="g in config.groups" :key="g.id" type="button" class="rl-fg-tab" role="tab" :id="`${uid}-tab-${g.id}`" :data-group="g.id" :aria-selected="activeId === g.id" :aria-controls="`${uid}-panel`" :aria-disabled="errorsFor(g.id).length ? 'true' : undefined" :tabindex="activeId === g.id ? 0 : -1" @click="selectGroup(g.id)">
        <span class="rl-fg-dot" :data-status="g.nodes.find(n => n.kind === 'agent')?.status" aria-hidden="true"></span>{{ g.label }}
      </button>
    </div>
    <div :id="`${uid}-panel`" role="tabpanel" :aria-labelledby="`${uid}-tab-${activeId}`">
      <p v-if="!valid" class="rl-fg-empty">No se pudo cargar este agente.</p>
      <div v-else ref="stage" class="rl-fg-stage" :class="{ 'rl-fg-stage--empty': stats.total === 0 }">
        <p :id="`${uid}-relations`" class="rl-fg-rel-fallback">{{ relation }}</p>
        <svg v-if="hydrated && edges.length" class="rl-fg-wires" aria-hidden="true" focusable="false" :viewBox="`0 0 ${dimensions.w} ${dimensions.h}`" :style="{ '--agent-color': `var(--rl-state-${agent?.status ?? 'idle'})` }">
          <g v-for="edge in edges" :key="`${edge.from}->${edge.to}`" class="rl-fg-edge" :data-edge="`${edge.from}->${edge.to}`" :data-status="edge.status" :data-tool="group?.nodes.find(n => n.kind !== 'agent' && (n.id === edge.from || n.id === edge.to))?.status" :style="{ '--edge-color': `var(--rl-state-${edge.status})` }">
            <path class="rl-fg-edge-glow" /><path class="rl-fg-edge-line" pathLength="1" />
          </g>
          <circle class="rl-fg-port in" r="3" /><circle class="rl-fg-port out" r="3" />
        </svg>
        <div v-for="column in columns" :key="column.id" class="rl-fg-col" :class="`rl-fg-col-${column.id}`" :role="column.id === 1 ? undefined : 'group'" :aria-labelledby="column.id === 1 ? undefined : `${uid}-col-${column.id}`">
          <h3 v-if="column.id !== 1" class="rl-fg-col-title" :id="`${uid}-col-${column.id}`">{{ column.id === 0 ? labels.sources : labels.targets }}</h3>
          <ul class="rl-fg-list">
            <li v-for="node in column.nodes" :key="node.id">
              <article v-if="node.kind === 'agent'" class="rl-fg-agent" :data-fg-node="node.id" :data-status="node.status" :aria-label="`Agente ${node.label}, ${statusLabel(node.status)}`">
                <div class="rl-fg-agent-row"><span class="rl-fg-icon" aria-hidden="true"><RelayIcon :name="node.icon && knownIcons.has(node.icon) ? node.icon : 'agent'" /></span><span class="rl-fg-agent-name">{{ node.label }}</span><span class="rl-fg-badge rl-fg-badge-sm" :data-status="node.status"><RelayIcon :name="node.status === 'needs-you' || node.status === 'failed' ? 'alert' : 'clock'" />{{ statusLabel(node.status) }}</span></div>
                <p v-if="node.sublabel" class="rl-fg-model">{{ node.sublabel }}</p><p v-if="node.description" class="rl-fg-task" :title="node.description">{{ node.description }}</p>
              </article>
              <button v-else type="button" class="rl-fg-node" :data-fg-node="node.id" :data-status="node.status" :style="{ '--edge-color': edgeColor(node) }" :aria-describedby="`${uid}-relations`" :aria-disabled="!hasAccess(node) ? 'true' : undefined" :title="hasAccess(node) ? node.label : `${node.label}: ${labels.noAccess}`" @click="nodeClick(node)" @keydown="nodeKey($event, node, column.id)">
                <span class="rl-fg-icon rl-fg-icon-tool" aria-hidden="true"><RelayIcon v-if="node.icon && knownIcons.has(node.icon)" :name="node.icon" /><span v-else>{{ node.label.charAt(0).toUpperCase() }}</span></span>
                <span class="rl-fg-node-text"><span class="rl-fg-label">{{ node.label }}</span><span class="rl-fg-status"><RelayIcon v-if="node.status === 'no-access' || node.status === 'failed'" :name="node.status === 'no-access' ? 'lock' : 'alert'" />{{ nodeStatus(node) }}</span></span>
                <span v-if="node.status === 'failed' || node.status === 'running'" class="rl-fg-badge rl-fg-badge-sm rl-fg-flag" :data-status="node.status" aria-hidden="true">{{ statusLabel(node.status) }}</span>
                <span v-else-if="node.calls" class="rl-fg-count" aria-hidden="true">{{ node.calls }}×</span>
                <span v-if="node.calls" class="rl-fg-sr">{{ labels.calls(node.calls) }}</span>
              </button>
            </li>
            <li v-if="column.more"><button type="button" class="rl-fg-more" :aria-expanded="!!expanded[column.id]" @click="toggle(column.id)">{{ expanded[column.id] ? labels.less : labels.more(column.more) }}</button></li>
          </ul>
        </div>
        <p v-if="stats.total === 0" class="rl-fg-empty">Este agente no tiene herramientas configuradas.</p>
      </div>
    </div>
    <div v-if="config.legend" class="rl-fg-legend" aria-hidden="true"><span v-for="status in ['running', 'needs-you', 'failed', 'no-access']" :key="status"><i :style="{ borderColor: `var(--rl-state-${status === 'no-access' ? 'idle' : status})`, borderStyle: status === 'no-access' ? 'dashed' : 'solid' }"></i>{{ status === 'no-access' ? `${labels.noAccess} (sin arista)` : statusLabel(status) }}</span></div>
    <p class="rl-fg-sr" aria-live="polite" aria-atomic="true">{{ liveMessage }}</p>
  </section>
</template>
