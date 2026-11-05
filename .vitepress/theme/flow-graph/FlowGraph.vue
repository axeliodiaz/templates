<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import RelayIcon from '../RelayIcon.vue'
import FlowGraphDetail from './FlowGraphDetail.vue'
import { animate } from 'motion'
import { SPRING_LAYOUT, EASE_OUT, openDetail as animateOpenDetail, closeDetail as animateCloseDetail, completeAll, keep, playEntrance, reducedNow, runParticle, stopAll, switchGroup as flipGroup, tweenNumber } from './flow-graph.motion'
import type { Controls, Particle } from './flow-graph.motion'
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
const validation = computed(() => new Map(props.config.groups.map(g => [g.id, validateConfig({ groups: [g] })])))
const errorsFor = (id: string) => validation.value.get(id) ?? []
const valid = computed(() => !!group.value && !errorsFor(activeId.value).length)
const agent = computed(() => group.value?.nodes.find(n => n.kind === 'agent'))
const replayCalls = ref<Record<string, CallRecord[]>>({})
const replayKey = (nodeId: string) => `${activeId.value}:${nodeId}`
const extraCalls = (nodeId: string) => replayCalls.value[replayKey(nodeId)] ?? []
const stats = computed(() => { const base=group.value ? headerStats(group.value) : {access:0,total:0,calls:0};return {...base,calls:base.calls+(group.value?.nodes.reduce((n,node)=>n+extraCalls(node.id).length,0)??0)} })
const detailId = ref<string | null>(null), layer = ref<HTMLElement>(), graphLayer=ref<HTMLElement>(), tabs=ref<HTMLElement>(), detailView=ref<InstanceType<typeof FlowGraphDetail>>()
const detailNode = computed(()=>group.value?.nodes.find(n=>n.id===detailId.value))
const detailData = computed(()=>detailId.value ? group.value?.details?.[detailId.value] : undefined)
const visibleDetail = computed(()=>detailId.value&&detailData.value?{...detailData.value,calls:[...extraCalls(detailId.value),...detailData.value.calls]}:undefined)
const replayTimers=new Map<ReturnType<typeof setTimeout>,()=>void>()
const detailAnims=new Set<Controls>(); let detailToken=0,recentTimer:ReturnType<typeof setTimeout>|undefined
const nodeCount=(node:FlowNode)=>(node.calls??0)+extraCalls(node.id).length
const relation = computed(() => group.value ? relationSentence(group.value, labels.value) : '')
const expanded = ref<Record<string, boolean>>({}), liveMessage = ref('')
const reduced = ref(false), entranceReady = ref(false), indicator = ref<HTMLElement>(), headerAccess = ref<HTMLElement>(), headerCalls = ref<HTMLElement>()
const animatedKeys = computed(() => new Set(edges.value.filter(e => e.animated).slice(0, props.config.maxAnimatedEdges ?? 12).map(e => `${e.from}->${e.to}`)))
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
let io: IntersectionObserver | undefined, media: MediaQueryList | undefined, themeObserver: MutationObserver | undefined
let visible = true, entered = false, switching = false, switchToken = 0, stopTracking: (() => void) | undefined
const enterAnims = new Set<Controls>(), layoutAnims = new Set<Controls>(), fades = new Set<Controls>(), numberAnims = new Set<Controls>()
const particles = new Map<SVGPathElement, Particle>()
let particleDelays = new Map<string, number>(), themeFrames: number[] = []
const pendingFrames = new Set<number>()
function nextFrame() { return new Promise<void>(resolve => { const id = requestAnimationFrame(() => { pendingFrames.delete(id); resolve() }); pendingFrames.add(id) }) }
let mounted = false, raf = 0, announceTimer: ReturnType<typeof setTimeout> | undefined, ro: ResizeObserver | undefined
function measure() {
  raf = 0
  if (!mounted || !stage.value) return
  const origin = stage.value.getBoundingClientRect(), rects = new Map<string, DOMRect>()
  stage.value.querySelectorAll<HTMLElement>('[data-fg-node]').forEach(el => rects.set(el.dataset.fgNode!, el.getBoundingClientRect()))
  // Finish every layout read before writing any SVG geometry.
  const paths = [...stage.value.querySelectorAll<SVGElement>('[data-edge]')].map(el => {
    const [from, to] = el.dataset.edge!.split('->')
    const a = rects.get(from), b = rects.get(to)
    if (!a || !b) return null
    const local = (r: DOMRect) => ({ left: r.left - origin.left, right: r.right - origin.left, top: r.top - origin.top, height: r.height })
    return { key: `${from}->${to}`, d: bezier(anchorOut(local(a)), anchorIn(local(b))) }
  })
  const ar = agent.value ? rects.get(agent.value.id) : undefined
  const w = Math.max(1, origin.width), h = Math.max(1, origin.height)
  if (dimensions.value.w !== w || dimensions.value.h !== h) dimensions.value = { w, h }
  const pathMap = new Map(paths.filter(p => p !== null).map(p => [p.key, p.d]))
  stage.value.querySelectorAll<SVGElement>('[data-edge]').forEach(el => {
    const d = pathMap.get(el.dataset.edge!)
    let changed = false
    if (d) el.querySelectorAll('path').forEach(path => { if (path.getAttribute('d') !== d) { path.setAttribute('d', d); changed = true } })
    const path = el.querySelector<SVGPathElement>('.rl-fg-particle')
    if (changed && path && path.hasAttribute('d')) { const particle = particles.get(path); if (particle) particle.setLength(path.getTotalLength()) }
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
function syncParticles() {
  if (!stage.value || !mounted) return
  for (const [path, particle] of particles) if (!path.isConnected || reduced.value) { particle.control.stop(); particles.delete(path) }
  if (!entered || reduced.value) return
  stage.value.querySelectorAll<SVGPathElement>('.rl-fg-particle').forEach((path, index) => {
    if (!particles.has(path) && path.hasAttribute('d')) {
      const key = path.closest<SVGElement>('[data-edge]')!.dataset.edge!
      particles.set(path, runParticle(path, index, particleDelays.get(key) ?? 0))
    }
  })
  pauseParticles()
}
function pauseParticles() { particles.forEach(p => { if (!visible || document.visibilityState === 'hidden' || detailId.value) p.control.pause(); else p.control.play() }) }
function moveIndicator(animated = false) {
  const tab = [...(root.value?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])].find(el => el.dataset.group === activeId.value)
  if (!tab || !indicator.value) return
  const x = tab.offsetLeft, width = tab.offsetWidth
  if (animated && !reduced.value) keep(layoutAnims, animate(indicator.value, { x, width }, SPRING_LAYOUT))
  else { indicator.value.style.transform = `translateX(${x}px)`; indicator.value.style.width = `${width}px` }
}
function numbers(from?: { access: number; calls: number }) {
  stopAll(numberAnims)
  if (headerAccess.value) { const c = tweenNumber(headerAccess.value, from?.access ?? stats.value.access, stats.value.access, n => labels.value.tools(n, stats.value.total)); if (c) keep(numberAnims, c) }
  if (headerCalls.value) { const c = tweenNumber(headerCalls.value, from?.calls ?? stats.value.calls, stats.value.calls, labels.value.calls); if (c) keep(numberAnims, c) }
}
async function changeData(apply: () => void, focus = false) {
  const token = ++switchToken
  switching = true
  completeAll(enterAnims); stopTracking?.()
  const first = new Map<string, DOMRect>()
  stage.value?.querySelectorAll<HTMLElement>('[data-fg-node]').forEach(el => first.set(el.dataset.fgNode!, el.getBoundingClientRect()))
  const shown = { access: Number(headerAccess.value?.textContent?.match(/\d+/)?.[0] ?? stats.value.access), calls: Number(headerCalls.value?.textContent?.match(/\d+/)?.[0] ?? stats.value.calls) }
  stopAll(layoutAnims)
  if (reduced.value && stage.value) await animate(stage.value, { opacity: [1, 0] }, { duration: .075 }).finished
  if (!mounted || token !== switchToken) return
  stage.value?.querySelectorAll<HTMLElement>('[data-fg-node]').forEach(el => { el.style.transform = ''; el.style.willChange = '' })
  apply(); await nextTick()
  if (!mounted || token !== switchToken) return
  observeColumns(); particleDelays = new Map()
  if (stage.value && !reduced.value && !detailId.value) stopTracking = flipGroup(stage.value, first, layoutAnims, measure)
  if (stage.value && reduced.value) keep(layoutAnims, animate(stage.value, { opacity: [0, 1] }, { duration: .075 }))
  measure(); moveIndicator(true); numbers(shown);
  await nextFrame()
  if (!mounted || token !== switchToken) return
  measure(); syncParticles(); switching = false
  if (focus) root.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]').forEach(tab => { if (tab.dataset.group === activeId.value) tab.focus() })
}
async function selectGroup(id: string, focus = false) {
  if (errorsFor(id).length || id === activeId.value) return
  await changeData(() => { internalGroup.value = id; expanded.value = {}; emit('update:groupId', id); props.onSelectGroup?.(id) }, focus)
}
function edgeEnter(el: Element, done: () => void) {
  if (!entered || reduced.value || !mounted) { done(); return }
  keep(fades, animate(el, { opacity: [0, 1] }, { duration: .24, delay: .08, ease: 'linear' }), done)
}
function edgeLeave(el: Element, done: () => void) {
  if (reduced.value || !mounted) { done(); return }
  keep(fades, animate(el, { opacity: [1, 0] }, { duration: .16, ease: 'linear' }), done)
}
function particleLeave(el: Element, done: () => void) {
  const path = el as SVGPathElement, particle = particles.get(path)
  if (reduced.value || !mounted) { particle?.control.stop(); particles.delete(path); done(); return }
  keep(fades, animate(el, { opacity: [1, 0] }, { duration: .2, ease: 'linear' }), () => { particle?.control.stop(); particles.delete(path); done() })
}
function nodeLeave(el: Element, done: () => void) {
  const node = el as HTMLElement
  node.dataset.fgLeaving = 'true'
  const rect = node.getBoundingClientRect(), parent = node.offsetParent?.getBoundingClientRect()
  const width = node.offsetWidth, top = parent ? rect.top-parent.top : node.offsetTop, left = parent ? rect.left-parent.left : node.offsetLeft
  node.style.position = 'absolute'; node.style.width = `${width}px`; node.style.top = `${top}px`; node.style.left = `${left}px`
  edgeLeave(el, done)
}
function nodeEnter(el: Element, done: () => void) { done() } // shared node FLIP is handled in one batch
function replayEntrance() {
  if (!stage.value) return
  completeAll(enterAnims); particles.forEach(p => p.control.stop()); particles.clear(); particleDelays.clear()
  entered = true; entranceReady.value = true
  if (reduced.value) { measure(); numbers(); return }
  playEntrance(stage.value, enterAnims, delays => { particleDelays = delays; void nextTick().then(() => { measure(); syncParticles() }) })
  numbers({ access: 0, calls: 0 })
}
function resize() {
  const width = stage.value?.getBoundingClientRect().width
  if (switching || width === dimensions.value.w) { refresh(); return }
  if (layoutAnims.size) { completeAll(layoutAnims); stopTracking?.(); stage.value?.querySelectorAll<HTMLElement>('[data-fg-node]').forEach(el => { el.style.transform = ''; el.style.willChange = '' }) }
  refresh(); moveIndicator()
}
function mediaChange() {
  completeAll(detailAnims)
  reduced.value = !!media?.matches
  completeAll(enterAnims); completeAll(layoutAnims); stopAll(fades); stopAll(numberAnims); stopTracking?.()
  particles.forEach(p => p.control.stop()); particles.clear()
  stage.value?.querySelectorAll<HTMLElement>('[data-fg-node]').forEach(el => { el.style.transform = ''; el.style.opacity = ''; el.style.willChange = '' })
  void nextTick().then(() => { measure(); syncParticles(); numbers(); moveIndicator() })
}
function tabKey(event: KeyboardEvent) {
  const ids = props.config.groups.filter(g => !errorsFor(g.id).length).map(g => g.id), index = ids.indexOf(activeId.value)
  const next = event.key === 'Home' ? ids[0] : event.key === 'End' ? ids.at(-1) : event.key === 'ArrowRight' ? ids[(index + 1) % ids.length] : event.key === 'ArrowLeft' ? ids[(index - 1 + ids.length) % ids.length] : undefined
  if (next) { event.preventDefault(); void selectGroup(next, true) }
}
function nodeClick(node: FlowNode) {
  if (!hasAccess(node) || node.kind === 'agent') return
  props.onNodeClick?.({ groupId: activeId.value, nodeId: node.id, kind: node.kind })
  if (group.value?.details?.[node.id]) void showDetail(node.id)
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
function toggle(column: number) { void changeData(() => { expanded.value = { ...expanded.value, [column]: !expanded.value[column] } }) }
// The pre-flush watcher captures the old visual boxes before Vue patches prop updates.
watch([group, expanded], () => { if (mounted && !switching) void changeData(() => {}) }, { deep: true, flush: 'pre' })
watch([activeId, detailData], ([, data]) => {
  if(!detailId.value||data)return
  ++detailToken;completeAll(detailAnims);detailId.value=null
  if(graphLayer.value){graphLayer.value.inert=false;graphLayer.value.style.visibility='';graphLayer.value.style.transform='';graphLayer.value.style.opacity='';graphLayer.value.style.filter=''}
  stage.value?.querySelectorAll<HTMLElement>('.rl-fg-label').forEach(el=>el.style.visibility='');emit('update:detailNodeId',null);pauseParticles()
})
watch(() => props.detailNodeId, id => { if(mounted) { if(id)void showDetail(id);else if(detailId.value)void hideDetail() } })
watch(animatedKeys, async () => { await nextTick(); if (mounted) { measure(); syncParticles() } })
watch([activeId, stats, () => agent.value?.status], () => {
  if (!mounted || detailId.value) return
  clearTimeout(announceTimer)
  announceTimer = setTimeout(() => { liveMessage.value = `${group.value?.label}: ${stats.value.access} de ${stats.value.total} herramientas, ${labels.value.calls(stats.value.calls)}, ${statusLabel(agent.value?.status ?? 'idle').toLowerCase()}.` }, 300)
}, { deep: true })
onMounted(() => {
  mounted = true; hydrated.value = true; media = matchMedia('(prefers-reduced-motion: reduce)'); reduced.value = media.matches; media.addEventListener('change', mediaChange)
  ro = new ResizeObserver(resize); observeColumns(); document.fonts?.ready.then(() => { if (mounted) refresh() })
  document.addEventListener('visibilitychange', pauseParticles)
  io = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? true; if (visible && !entered) void nextTick().then(replayEntrance); pauseParticles() }, { threshold: .2 })
  if (stage.value) io.observe(stage.value)
  if (reduced.value) replayEntrance()
  const theme = root.value?.closest('.relay-bs6')
  if (theme) { themeObserver = new MutationObserver(() => { root.value?.classList.add('rl-fg-no-anim'); themeFrames.push(requestAnimationFrame(() => { themeFrames.push(requestAnimationFrame(() => root.value?.classList.remove('rl-fg-no-anim'))) })) }); themeObserver.observe(theme, { attributes: true, attributeFilter: ['data-bs-theme'] }) }
  void nextTick().then(() => { measure(); moveIndicator();if(props.detailNodeId)void showDetail(props.detailNodeId) })
  if (import.meta.env.DEV) validateConfig(props.config).forEach(error => console.warn(`[FlowGraph] ${error}`))
})
onBeforeUnmount(() => {
  mounted = false; ++switchToken; ro?.disconnect(); io?.disconnect(); themeObserver?.disconnect(); media?.removeEventListener('change', mediaChange); document.removeEventListener('visibilitychange', pauseParticles)
  ++detailToken;stopAll(detailAnims);clearTimeout(recentTimer);replayTimers.forEach((cancel,t)=>{clearTimeout(t);cancel()});replayTimers.clear()
  stopAll(enterAnims); stopAll(layoutAnims); stopAll(fades); stopAll(numberAnims); stopTracking?.(); particles.forEach(p => p.control.stop()); particles.clear()
  pendingFrames.forEach(cancelAnimationFrame); pendingFrames.clear()
  if (raf) cancelAnimationFrame(raf); themeFrames.forEach(cancelAnimationFrame); clearTimeout(announceTimer)
})
function nodeButton(id: string) { return [...(stage.value?.querySelectorAll<HTMLButtonElement>('button[data-fg-node]')??[])].find(el=>el.dataset.fgNode===id) }
async function showDetail(id:string) {
  if(detailId.value || !group.value?.details?.[id] || !graphLayer.value)return
  const button=nodeButton(id),label=button?.querySelector<HTMLElement>('.rl-fg-label');if(!label)return
  const token=++detailToken,from=label.getBoundingClientRect(),h=layer.value?.getBoundingClientRect().height??0
  completeAll(enterAnims);completeAll(layoutAnims);detailId.value=id;pauseParticles();emit('update:detailNodeId',id)
  await nextTick();if(!mounted||token!==detailToken)return
  const d=detailView.value?.root,title=detailView.value?.title;if(!d||!title)return
  const target=d.getBoundingClientRect().height
  if(layer.value&&!reduced.value)keep(detailAnims,animate(layer.value,{height:[h,target]},{duration:.3,ease:[...EASE_OUT]}),()=>{if(layer.value)layer.value.style.height=''})
  label.style.visibility='hidden';graphLayer.value.inert=true
  await animateOpenDetail(graphLayer.value,d,title,from,detailAnims,reduced.value).finished
  if(!mounted||token!==detailToken)return
  graphLayer.value.style.visibility='hidden';title.focus()
}
async function hideDetail() {
  if(!detailId.value||!graphLayer.value)return
  const id=detailId.value,button=nodeButton(id),label=button?.querySelector<HTMLElement>('.rl-fg-label'),d=detailView.value?.root,title=detailView.value?.title
  if(!label||!d||!title)return
  const token=++detailToken;completeAll(detailAnims);graphLayer.value.style.visibility='';measure()
  await animateCloseDetail(graphLayer.value,d,title,label.getBoundingClientRect(),detailAnims,reduced.value).finished
  if(!mounted||token!==detailToken)return
  detailId.value=null;graphLayer.value.inert=false;graphLayer.value.style.transform='';graphLayer.value.style.opacity='';graphLayer.value.style.filter='';label.style.visibility='';emit('update:detailNodeId',null);props.onBack?.({groupId:activeId.value,nodeId:id});pauseParticles();button?.focus();button?.classList.add('is-recent');recentTimer=setTimeout(()=>button?.classList.remove('is-recent'),600)
}
async function replayCall(call:CallRecord):Promise<CallRecord> {
  const groupId=activeId.value,nodeId=detailId.value!,key=`${groupId}:${nodeId}`
  let result:CallRecord
  try { result=props.onReplay?await props.onReplay({groupId,nodeId,call}):await new Promise<CallRecord>(resolve=>{const timer=setTimeout(()=>{replayTimers.delete(timer);resolve({...call,status:'ok',durationMs:2000})},2000);replayTimers.set(timer,()=>resolve({...call,status:'failed'}))}) }
  catch { result={...call,status:'failed',durationMs:undefined} }
  if(mounted) { const before=stats.value.calls;replayCalls.value={...replayCalls.value,[key]:[{...result,id:`replay-${Date.now()}-${replayCalls.value[key]?.length??0}`},...(replayCalls.value[key]??[])]};numbers({access:stats.value.access,calls:before}) }
  return result
}
function detailKey(event:KeyboardEvent) { if(event.key==='Escape'&&detailId.value&&!(event.target as HTMLElement).closest('dialog')){event.preventDefault();void hideDetail()} }
defineExpose({ refresh, replayEntrance })
</script>

<template>
  <section ref="root" @keydown="detailKey" class="card rl-fg" :class="{ 'is-hydrated': hydrated, 'rl-fg--dense': edges.length > 24, 'rl-fg-awaiting': hydrated && !entranceReady && !reduced }" :aria-labelledby="`${uid}-title`">
    <header class="rl-fg-head">
      <span class="rl-fg-icon" aria-hidden="true"><RelayIcon name="agent" /></span>
      <div class="rl-fg-grow"><h2 class="rl-fg-title" :id="`${uid}-title`">{{ labels.title }}</h2><p class="rl-fg-stats"><span aria-hidden="true"><span ref="headerAccess">{{ labels.tools(stats.access, stats.total) }}</span> · <span ref="headerCalls">{{ labels.calls(stats.calls) }}</span></span><span class="rl-fg-sr">{{ labels.tools(stats.access, stats.total) }} · {{ labels.calls(stats.calls) }}</span></p></div>
      <span v-if="agent" class="rl-fg-badge" :data-status="agent.status"><span v-if="agent.status === 'running' && !reduced" class="rl-fg-spinner" aria-hidden="true"></span><RelayIcon v-else :name="agent.status === 'needs-you' || agent.status === 'failed' ? 'alert' : 'clock'" />{{ statusLabel(agent.status) }}</span>
    </header>
    <div ref="tabs" :inert="!!detailId" :class="{'rl-fg-tabs--inert':!!detailId}" class="rl-fg-tabs" role="tablist" :aria-label="labels.tabsAria" @keydown="tabKey">
      <span ref="indicator" class="rl-fg-tab-indicator" aria-hidden="true"></span>
      <button v-for="g in config.groups" :key="g.id" type="button" class="rl-fg-tab" role="tab" :id="`${uid}-tab-${g.id}`" :data-group="g.id" :aria-selected="activeId === g.id" :aria-controls="`${uid}-panel`" :aria-disabled="errorsFor(g.id).length ? 'true' : undefined" :tabindex="activeId === g.id ? 0 : -1" @click="selectGroup(g.id)">
        <span class="rl-fg-dot" :data-status="g.nodes.find(n => n.kind === 'agent')?.status" aria-hidden="true"></span>{{ g.label }}
      </button>
    </div>
    <div ref="layer" class="rl-fg-layers" :id="`${uid}-panel`" role="tabpanel" :aria-labelledby="`${uid}-tab-${activeId}`">
      <div ref="graphLayer" class="rl-fg-graph-layer">
      <p v-if="!valid" class="rl-fg-empty">No se pudo cargar este agente.</p>
      <div v-else ref="stage" class="rl-fg-stage" :class="{ 'rl-fg-stage--empty': stats.total === 0 }">
        <p :id="`${uid}-relations`" class="rl-fg-rel-fallback">{{ relation }}</p>
        <svg v-if="hydrated && edges.length" class="rl-fg-wires" aria-hidden="true" focusable="false" :viewBox="`0 0 ${dimensions.w} ${dimensions.h}`" :style="{ '--agent-color': `var(--rl-state-${agent?.status ?? 'idle'})` }">
          <TransitionGroup tag="g" :css="false" move-class="rl-fg-no-css-move" @enter="edgeEnter" @leave="edgeLeave">
          <g v-for="edge in edges" :key="`${edge.from}->${edge.to}`" class="rl-fg-edge" :data-edge="`${edge.from}->${edge.to}`" :data-status="edge.status" :data-tool="group?.nodes.find(n => n.kind !== 'agent' && (n.id === edge.from || n.id === edge.to))?.status" :style="{ '--edge-color': `var(--rl-state-${edge.status})` }">
            <path class="rl-fg-edge-glow" /><path class="rl-fg-edge-line" pathLength="1" />
            <Transition :css="false" @leave="particleLeave"><path v-if="!reduced && entranceReady && animatedKeys.has(`${edge.from}->${edge.to}`)" class="rl-fg-particle" /></Transition>
          </g>
          </TransitionGroup>
          <circle class="rl-fg-port in" r="3" /><circle class="rl-fg-port out" r="3" />
        </svg>
        <div v-for="column in columns" :key="column.id" class="rl-fg-col" :class="`rl-fg-col-${column.id}`" :role="column.id === 1 ? undefined : 'group'" :aria-labelledby="column.id === 1 ? undefined : `${uid}-col-${column.id}`">
          <h3 v-if="column.id !== 1" class="rl-fg-col-title" :id="`${uid}-col-${column.id}`">{{ column.id === 0 ? labels.sources : labels.targets }}</h3>
          <TransitionGroup tag="ul" class="rl-fg-list" :css="false" move-class="rl-fg-no-css-move" @enter="nodeEnter" @leave="nodeLeave">
            <li v-for="node in column.nodes" :key="node.id">
              <article v-if="node.kind === 'agent'" class="rl-fg-agent" :data-fg-node="node.id" :data-status="node.status" :aria-label="`Agente ${node.label}, ${statusLabel(node.status)}`">
                <div class="rl-fg-agent-row"><span class="rl-fg-icon" aria-hidden="true"><RelayIcon :name="node.icon && knownIcons.has(node.icon) ? node.icon : 'agent'" /></span><span class="rl-fg-agent-name">{{ node.label }}</span><span class="rl-fg-badge rl-fg-badge-sm" :data-status="node.status"><span v-if="node.status === 'running' && !reduced" class="rl-fg-spinner" aria-hidden="true"></span><RelayIcon v-else :name="node.status === 'needs-you' || node.status === 'failed' ? 'alert' : 'clock'" />{{ statusLabel(node.status) }}</span></div>
                <p v-if="node.sublabel" class="rl-fg-model">{{ node.sublabel }}</p><p v-if="node.description" class="rl-fg-task" :title="node.description">{{ node.description }}</p>
              </article>
              <button v-else type="button" class="rl-fg-node" :data-fg-node="node.id" :data-status="node.status" :style="{ '--edge-color': edgeColor(node) }" :aria-describedby="`${uid}-relations`" :aria-disabled="!hasAccess(node) ? 'true' : undefined" :title="hasAccess(node) ? node.label : `${node.label}: ${labels.noAccess}`" @click="nodeClick(node)" @keydown="nodeKey($event, node, column.id)">
                <span class="rl-fg-icon rl-fg-icon-tool" aria-hidden="true"><RelayIcon v-if="node.icon && knownIcons.has(node.icon)" :name="node.icon" /><span v-else>{{ node.label.charAt(0).toUpperCase() }}</span></span>
                <span class="rl-fg-node-text"><span class="rl-fg-label">{{ node.label }}</span><span class="rl-fg-status"><RelayIcon v-if="node.status === 'no-access' || node.status === 'failed'" :name="node.status === 'no-access' ? 'lock' : 'alert'" />{{ nodeStatus(node) }}</span></span>
                <span v-if="node.status === 'failed' || node.status === 'running'" class="rl-fg-badge rl-fg-badge-sm rl-fg-flag" :data-status="node.status" aria-hidden="true">{{ statusLabel(node.status) }}</span>
                <span v-else-if="nodeCount(node)" class="rl-fg-count" aria-hidden="true">{{ nodeCount(node) }}×</span>
                <span v-if="nodeCount(node)" class="rl-fg-sr">{{ labels.calls(nodeCount(node)) }}</span>
              </button>
            </li>
            <li v-if="column.more"><button type="button" class="rl-fg-more" :aria-expanded="!!expanded[column.id]" @click="toggle(column.id)">{{ expanded[column.id] ? labels.less : labels.more(column.more) }}</button></li>
          </TransitionGroup>
        </div>
        <p v-if="stats.total === 0" class="rl-fg-empty">Este agente no tiene herramientas configuradas.</p>
      </div>
      </div>
      <FlowGraphDetail v-if="detailId && detailNode && detailData" ref="detailView" :key="`${activeId}:${detailId}`" :node="detailNode" :detail="visibleDetail!" :count="nodeCount(detailNode)" :labels="labels" :reduced="reduced" :on-replay="replayCall" @back="hideDetail" @live="liveMessage=$event" />
    </div>
    <div v-if="config.legend" class="rl-fg-legend" aria-hidden="true"><span v-for="status in ['running', 'needs-you', 'failed', 'no-access']" :key="status"><i :style="{ borderColor: `var(--rl-state-${status === 'no-access' ? 'idle' : status})`, borderStyle: status === 'no-access' ? 'dashed' : 'solid' }"></i>{{ status === 'no-access' ? `${labels.noAccess} (sin arista)` : statusLabel(status) }}</span></div>
    <p class="rl-fg-sr" aria-live="polite" aria-atomic="true">{{ liveMessage }}</p>
  </section>
</template>
