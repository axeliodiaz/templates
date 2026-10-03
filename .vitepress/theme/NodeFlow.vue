<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
type Kind = 'trigger' | 'action' | 'ai' | 'branch'
type N = { id: string; kind: Kind; title: string; sub: string; x: number; y: number; rows?: string[] }
type E = { from: string; row?: number; to: string }
const NW = 172
const seed = (): { nodes: N[]; edges: E[] } => ({
  nodes: [
    { id: 't', kind: 'trigger', title: 'Deal created', sub: 'CRM · Deals', x: 10, y: 190 },
    { id: 'a', kind: 'ai', title: 'Score the deal', sub: 'Reads company and notes', x: 202, y: 190 },
    { id: 'b', kind: 'branch', title: 'Deal value', sub: 'Routes by amount', x: 394, y: 120, rows: ['Over $250k', '$50k - $250k', 'Under $50k', 'No value yet'] },
    { id: 'c1', kind: 'action', title: 'Notify enterprise team', sub: 'Chat · #enterprise', x: 598, y: 10 },
    { id: 'c2', kind: 'action', title: 'Assign senior rep', sub: 'CRM · Owner', x: 598, y: 120 },
    { id: 'c3', kind: 'action', title: 'Add to nurture list', sub: 'Email · Sequence', x: 598, y: 230 },
    { id: 'c4', kind: 'action', title: 'Ask rep to add value', sub: 'Task · Due in 1 day', x: 598, y: 340 }
  ],
  edges: [{ from: 't', to: 'a' }, { from: 'a', to: 'b' }, { from: 'b', row: 0, to: 'c1' }, { from: 'b', row: 1, to: 'c2' }, { from: 'b', row: 2, to: 'c3' }, { from: 'b', row: 3, to: 'c4' }]
})
const nodes = ref<N[]>(seed().nodes), edges = ref<E[]>(seed().edges)
const sel = ref<string | null>('a'), panel = ref(false), zoom = ref(1), fit = ref(1)
const past = ref<string[]>([]), future = ref<string[]>([]), saved = ref('Auto-saved draft'), live = ref(false)
const wrap = ref<HTMLElement | null>(null)
const W = 780, H = 460
const scale = computed(() => fit.value * zoom.value)
let ro: ResizeObserver | null = null
onMounted(() => { if (wrap.value && 'ResizeObserver' in window) { ro = new ResizeObserver(() => { fit.value = Math.min(1, (wrap.value!.clientWidth) / W) }); ro.observe(wrap.value) } })
onBeforeUnmount(() => ro?.disconnect())
const label: Record<Kind, string> = { trigger: 'TRIGGER', action: 'ACTION', ai: 'AI AGENT', branch: 'BRANCH' }
const height = (n: N) => n.rows ? 62 + n.rows.length * 26 : 62
const byId = computed(() => Object.fromEntries(nodes.value.map(n => [n.id, n])))
const paths = computed(() => edges.value.map(e => {
  const a = byId.value[e.from], b = byId.value[e.to]
  const sx = a.x + NW, sy = a.y + (e.row === undefined ? height(a) / 2 : 62 + e.row * 26 + 13), tx = b.x, ty = b.y + height(b) / 2
  const d = Math.max(40, (tx - sx) * 0.5)
  return { key: `${e.from}-${e.row ?? 'o'}-${e.to}`, d: `M${sx} ${sy} C${sx + d} ${sy} ${tx - d} ${ty} ${tx} ${ty}`, on: sel.value === e.from || sel.value === e.to }
}))
function snap() { return JSON.stringify({ n: nodes.value, e: edges.value }) }
function commit(before: string, msg: string) { past.value.push(before); future.value = []; saved.value = msg }
function restore(s: string) { const o = JSON.parse(s); nodes.value = o.n; edges.value = o.e; if (sel.value && !byId.value[sel.value]) sel.value = null }
function undo() { const p = past.value.pop(); if (p) { future.value.push(snap()); restore(p); saved.value = 'Undone' } }
function redo() { const f = future.value.pop(); if (f) { past.value.push(snap()); restore(f); saved.value = 'Redone' } }
let drag: { id: string; sx: number; sy: number; ox: number; oy: number; before: string; moved: boolean } | null = null
function down(e: PointerEvent, n: N) {
  sel.value = n.id; drag = { id: n.id, sx: e.clientX, sy: e.clientY, ox: n.x, oy: n.y, before: snap(), moved: false }
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}
function move(e: PointerEvent) {
  if (!drag) return
  const n = byId.value[drag.id]; const dx = (e.clientX - drag.sx) / scale.value, dy = (e.clientY - drag.sy) / scale.value
  if (Math.abs(dx) + Math.abs(dy) > 2) drag.moved = true
  n.x = Math.max(0, Math.min(W - NW, Math.round(drag.ox + dx))); n.y = Math.max(0, Math.min(H - height(n), Math.round(drag.oy + dy)))
}
function up() { if (drag?.moved) commit(drag.before, 'Auto-saved draft'); drag = null }
function nudge(e: KeyboardEvent, n: N) {
  const k: Record<string, [number, number]> = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] }
  if (k[e.key]) { e.preventDefault(); const b = snap(); n.x = Math.max(0, Math.min(W - NW, n.x + k[e.key][0])); n.y = Math.max(0, Math.min(H - height(n), n.y + k[e.key][1])); commit(b, 'Auto-saved draft') }
  else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(n.id) }
}
const library: { group: string; items: { kind: Kind; title: string; sub: string; key: string }[] }[] = [
  { group: 'Logic', items: [{ kind: 'branch', title: 'Branch', sub: 'Route by a condition', key: 'B' }, { kind: 'action', title: 'Wait', sub: 'Pause for a set time', key: 'W' }] },
  { group: 'AI', items: [{ kind: 'ai', title: 'AI agent', sub: 'Decide or draft with a prompt', key: 'A' }, { kind: 'ai', title: 'Summarize', sub: 'Condense notes', key: 'S' }] },
  { group: 'Actions', items: [{ kind: 'action', title: 'Send email', sub: 'From a template', key: 'E' }, { kind: 'action', title: 'Create task', sub: 'Assign to a person', key: 'T' }] },
  { group: 'Integrations', items: [{ kind: 'action', title: 'Post to chat', sub: 'Channel message', key: 'C' }, { kind: 'action', title: 'Update sheet', sub: 'Append a row', key: 'U' }] }
]
function add(it: { kind: Kind; title: string; sub: string }) {
  const b = snap(); const from = sel.value && byId.value[sel.value] ? byId.value[sel.value] : null
  const id = 'n' + Date.now().toString(36)
  const n: N = { id, kind: it.kind, title: it.title, sub: it.sub, x: from ? Math.min(W - NW, from.x + 205) : 40, y: from ? Math.min(H - 90, from.y + 40) : 40, rows: it.kind === 'branch' ? ['Condition A', 'Otherwise'] : undefined }
  nodes.value.push(n); if (from) edges.value.push({ from: from.id, to: id }); sel.value = id; commit(b, 'Auto-saved draft'); panel.value = false
}
function remove(id: string) { const b = snap(); nodes.value = nodes.value.filter(n => n.id !== id); edges.value = edges.value.filter(e => e.from !== id && e.to !== id); sel.value = null; commit(b, 'Node deleted') }
function dup(id: string) { const b = snap(); const s = byId.value[id]; const nid = 'n' + Date.now().toString(36); nodes.value.push({ ...s, id: nid, x: Math.min(W - NW, s.x + 24), y: Math.min(H - height(s), s.y + 24), title: s.title + ' copy' }); sel.value = nid; commit(b, 'Auto-saved draft') }
function reset() { const b = snap(); const s = seed(); nodes.value = s.nodes; edges.value = s.edges; sel.value = 'a'; commit(b, 'Reset to sample') }
const mm = computed(() => nodes.value.map(n => ({ id: n.id, x: n.x / W * 100, y: n.y / H * 100, w: NW / W * 100, h: height(n) / H * 100 })))
const out = (id: string) => edges.value.filter(e => e.from === id).length
</script>

<template>
<section class="nf" aria-label="Node flow builder example">
  <header class="nf-top"><div><span class="nf-eyebrow">AUTOMATIONS</span><b>Big deal routing</b><span class="nf-chip">{{ live ? 'Live' : 'Draft' }}</span></div>
    <div class="nf-actions"><button type="button" class="nf-btn nf-ghost" :aria-pressed="live" @click="live = !live">{{ live ? 'Switch to draft' : 'Set live' }}</button><button type="button" class="nf-btn" @click="panel = !panel" :aria-expanded="panel">+ Node</button></div></header>
  <div class="nf-bar"><button type="button" class="nf-ic" :disabled="!past.length" @click="undo" aria-label="Undo">↶</button><button type="button" class="nf-ic" :disabled="!future.length" @click="redo" aria-label="Redo">↷</button><button type="button" class="nf-ic" @click="zoom = Math.max(.6, +(zoom - .1).toFixed(1))" aria-label="Zoom out">−</button><span class="nf-zoom">{{ Math.round(scale * 100) }}%</span><button type="button" class="nf-ic" @click="zoom = Math.min(1.4, +(zoom + .1).toFixed(1))" aria-label="Zoom in">+</button><button type="button" class="nf-ic nf-text" @click="reset">Reset</button><span class="nf-saved" role="status">{{ saved }}</span></div>
  <div class="nf-main">
    <div ref="wrap" class="nf-canvas" :style="{ height: H * scale + 'px' }" @click.self="sel = null">
      <div class="nf-stage" :style="{ width: W + 'px', height: H + 'px', transform: `scale(${scale})` }" @click.self="sel = null">
        <svg :width="W" :height="H" class="nf-edges" aria-hidden="true"><path v-for="p in paths" :key="p.key" :d="p.d" :class="{ on: p.on }" /></svg>
        <div v-for="n in nodes" :key="n.id" class="nf-node" :class="[`k-${n.kind}`, { sel: sel === n.id }]" :style="{ left: n.x + 'px', top: n.y + 'px', width: NW + 'px' }" tabindex="0" role="button" :aria-pressed="sel === n.id" :aria-label="`${label[n.kind]}: ${n.title}. Arrow keys move it, Delete removes it.`" @pointerdown="down($event, n)" @pointermove="move" @pointerup="up" @pointercancel="up" @keydown="nudge($event, n)">
          <span class="nf-kind">{{ label[n.kind] }}</span><b>{{ n.title }}</b><small>{{ n.sub }}</small>
          <div v-if="n.rows" class="nf-rows"><span v-for="r in n.rows" :key="r">{{ r }}<i></i></span></div>
          <span v-else class="nf-out">{{ out(n.id) }} output{{ out(n.id) === 1 ? '' : 's' }}</span>
          <div v-if="sel === n.id" class="nf-tools" @pointerdown.stop><button type="button" @click.stop="dup(n.id)">Duplicate</button><button type="button" @click.stop="remove(n.id)">Delete</button></div>
        </div>
      </div>
      <div class="nf-mini" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect v-for="m in mm" :key="m.id" :x="m.x" :y="m.y" :width="m.w" :height="m.h" :class="{ on: sel === m.id }" rx="1" /></svg></div>
    </div>
    <aside v-if="panel" class="nf-panel" aria-label="Add node"><div class="nf-panel-h"><b>Add node</b><button type="button" class="nf-ic" @click="panel = false" aria-label="Close add node panel">×</button></div>
      <p class="nf-note">{{ sel && byId[sel] ? `Connects after “${byId[sel].title}”.` : 'Select a node first to connect the new one.' }}</p>
      <div v-for="g in library" :key="g.group"><span class="nf-eyebrow">{{ g.group.toUpperCase() }}</span><button v-for="it in g.items" :key="it.title" type="button" class="nf-item" :class="`k-${it.kind}`" @click="add(it)"><i></i><span><b>{{ it.title }}</b><small>{{ it.sub }}</small></span><kbd>{{ it.key }}</kbd></button></div>
    </aside>
  </div>
  <p class="nf-note nf-foot">Demo only. Drag cards or use arrow keys. Nothing runs or saves outside this page.</p>
</section>
</template>
