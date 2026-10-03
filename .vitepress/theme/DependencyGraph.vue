<script setup lang="ts">
import { computed, ref } from 'vue'
const props = defineProps<{ scenario?: 'launch' | 'studio' }>()
const studio = props.scenario === 'studio'
type Kind = 'blocks' | 'review' | 'shares'
const kinds: { id: Kind; label: string; hint: string }[] = [
  { id: 'blocks', label: 'Blocks', hint: 'Cannot start until the source is done' },
  { id: 'review', label: 'Needs review', hint: 'Sign-off before the next step' },
  { id: 'shares', label: 'Shares output', hint: 'Uses a file or decision from the source' }
]
const people = studio ? ['Maya Chen', 'Leo Park', 'Nora Bell'] : ['Ada Reed', 'Sam Ortiz', 'Jules Kim']
// id, title, owner, days, depends on [id, kind], initial state
type Row = [string, string, number, number, [string, Kind][], 'done' | 'doing' | 'todo']
const rows: Row[] = studio ? [
  ['a', 'Sign proposal', 0, 1, [], 'done'],
  ['b', 'Kickoff workshop', 0, 2, [['a', 'blocks']], 'done'],
  ['c', 'Brand audit', 1, 3, [['b', 'blocks']], 'doing'],
  ['d', 'Capacity plan', 2, 2, [['b', 'shares']], 'doing'],
  ['e', 'Identity routes', 1, 5, [['c', 'blocks'], ['d', 'shares']], 'todo'],
  ['f', 'Client review', 0, 2, [['e', 'review']], 'todo'],
  ['g', 'Asset licenses', 2, 1, [['d', 'blocks']], 'todo'],
  ['h', 'Handoff package', 1, 3, [['f', 'blocks'], ['g', 'blocks']], 'todo']
] : [
  ['a', 'Define launch scope', 0, 2, [], 'done'],
  ['b', 'Map onboarding', 0, 3, [['a', 'blocks']], 'done'],
  ['c', 'Design tokens', 2, 3, [['a', 'blocks']], 'doing'],
  ['f', 'Set up analytics', 1, 2, [['a', 'blocks']], 'doing'],
  ['d', 'Welcome flow UI', 2, 4, [['b', 'blocks'], ['c', 'shares']], 'todo'],
  ['g', 'Write announcement', 0, 2, [['b', 'shares']], 'todo'],
  ['e', 'Build welcome flow', 1, 5, [['d', 'blocks']], 'todo'],
  ['h', 'Accessibility review', 2, 2, [['e', 'review']], 'todo'],
  ['i', 'QA pass', 1, 3, [['e', 'blocks'], ['f', 'blocks']], 'todo'],
  ['j', 'Launch checklist', 0, 1, [['h', 'blocks'], ['i', 'blocks'], ['g', 'shares']], 'todo'],
  ['k', 'Public launch', 0, 1, [['j', 'blocks']], 'todo']
]
const NW = 156, NH = 54, GX = 22, GY = 52
const state = ref<Record<string, 'done' | 'doing' | 'todo'>>(Object.fromEntries(rows.map(r => [r[0], r[5]])))
const edges = rows.flatMap(r => r[4].map(([from, kind]) => ({ from, to: r[0], kind, key: `${from}-${r[0]}` })))
const byId = Object.fromEntries(rows.map(r => [r[0], { id: r[0], title: r[1], owner: r[2], days: r[3], deps: r[4] }]))
const layer: Record<string, number> = {}
function lay(id: string): number { return layer[id] ??= byId[id].deps.length ? 1 + Math.max(...byId[id].deps.map(d => lay(d[0]))) : 0 }
rows.forEach(r => lay(r[0]))
const layerCount = Math.max(...Object.values(layer)) + 1
const order = Array.from({ length: layerCount }, (_, l) => rows.filter(r => layer[r[0]] === l).map(r => r[0]))
const pos0: Record<string, number> = {}
const bary = (id: string, nb: string[]) => nb.length ? nb.reduce((s, n) => s + pos0[n], 0) / nb.length : pos0[id]
for (let pass = 0; pass < 4; pass++) {
  order.forEach(l => l.forEach((id, i) => { pos0[id] = i }))
  for (let l = 1; l < layerCount; l++) { order[l].sort((a, b) => bary(a, byId[a].deps.map(d => d[0])) - bary(b, byId[b].deps.map(d => d[0]))); order[l].forEach((id, i) => { pos0[id] = i }) }
  for (let l = layerCount - 2; l >= 0; l--) { order[l].sort((a, b) => bary(a, edges.filter(e => e.from === a).map(e => e.to)) - bary(b, edges.filter(e => e.from === b).map(e => e.to))); order[l].forEach((id, i) => { pos0[id] = i }) }
}
const widest = Math.max(...order.map(l => l.length))
const W = widest * NW + (widest - 1) * GX + 40, H = layerCount * NH + (layerCount - 1) * GY + 40
const at: Record<string, { x: number; y: number }> = {}
order.forEach((l, li) => { const w = l.length * NW + (l.length - 1) * GX; l.forEach((id, i) => { at[id] = { x: (W - w) / 2 + i * (NW + GX), y: 20 + li * (NH + GY) } }) })
const paths = computed(() => {
  const out: Record<string, number> = {}, inn: Record<string, number> = {}
  const sorted = [...edges].sort((a, b) => at[a.to].x - at[b.to].x)
  const res: Record<string, string> = {}
  const outs = (id: string) => sorted.filter(e => e.from === id), ins = (id: string) => [...edges].filter(e => e.to === id).sort((a, b) => at[a.from].x - at[b.from].x)
  edges.forEach(e => {
    const o = outs(e.from), i = ins(e.to)
    const so = o.indexOf(e), si = i.indexOf(e)
    const sx = at[e.from].x + NW * (so + 1) / (o.length + 1), tx = at[e.to].x + NW * (si + 1) / (i.length + 1)
    const sy = at[e.from].y + NH, ty = at[e.to].y
    const dy = Math.max(34, (ty - sy) * 0.55)
    res[e.key] = `M${sx.toFixed(1)} ${sy} C${sx.toFixed(1)} ${(sy + dy).toFixed(1)} ${tx.toFixed(1)} ${(ty - dy).toFixed(1)} ${tx.toFixed(1)} ${ty}`
  })
  return res
})
function status(id: string): 'done' | 'doing' | 'ready' | 'blocked' {
  if (state.value[id] === 'done') return 'done'
  if (byId[id].deps.some(d => d[1] !== 'shares' && state.value[d[0]] !== 'done')) return 'blocked'
  return state.value[id] === 'doing' ? 'doing' : 'ready'
}
const label = { done: 'Done', doing: 'In progress', ready: 'Ready', blocked: 'Blocked' }
const sel = ref<string | null>(null), hover = ref<string | null>(null), onlyCritical = ref(false)
const focus = computed(() => hover.value ?? sel.value)
const hidden = ref<Kind[]>([])
function walk(id: string, dir: 'up' | 'down', seen = new Set<string>()) {
  edges.filter(e => !hidden.value.includes(e.kind) && (dir === 'up' ? e.to === id : e.from === id)).forEach(e => { const n = dir === 'up' ? e.from : e.to; if (!seen.has(n)) { seen.add(n); walk(n, dir, seen) } })
  return seen
}
const up = computed(() => focus.value ? walk(focus.value, 'up') : new Set<string>())
const down = computed(() => focus.value ? walk(focus.value, 'down') : new Set<string>())
function edgeOn(e: typeof edges[number]) {
  const f = focus.value; if (!f) return false
  return (e.to === f || up.value.has(e.to)) && up.value.has(e.from) || (e.from === f || down.value.has(e.from)) && down.value.has(e.to)
}
function nodeOn(id: string) { return !focus.value || id === focus.value || up.value.has(id) || down.value.has(id) }
// critical path: longest chain by days through hard dependencies
const critical = computed(() => {
  const best: Record<string, { d: number; prev: string | null }> = {}
  const f = (id: string): number => { if (best[id]) return best[id].d; let m = 0, p: string | null = null; byId[id].deps.filter(d => d[1] === 'blocks').forEach(([s]) => { const v = f(s); if (v > m) { m = v; p = s } }); best[id] = { d: m + byId[id].days, prev: p }; return best[id].d }
  rows.forEach(r => f(r[0]))
  let end = rows[0][0]; rows.forEach(r => { if (best[r[0]].d > best[end].d) end = r[0] })
  const ids = new Set<string>(); let cur: string | null = end; while (cur) { ids.add(cur); cur = best[cur].prev }
  return { ids, days: best[end].d }
})
const visibleEdges = computed(() => edges.filter(e => !hidden.value.includes(e.kind)))
function toggleKind(k: Kind) { hidden.value = hidden.value.includes(k) ? hidden.value.filter(x => x !== k) : [...hidden.value, k] }
const counts = computed(() => ({ blocked: rows.filter(r => status(r[0]) === 'blocked').length, ready: rows.filter(r => status(r[0]) === 'ready').length, done: rows.filter(r => status(r[0]) === 'done').length }))
const notice = ref('')
function advance(id: string) {
  const s = status(id)
  if (s === 'ready') { state.value[id] = 'doing'; notice.value = `${byId[id].title} started.` }
  else if (s === 'doing') {
    const was = rows.filter(r => r[4].some(d => d[0] === id) && status(r[0]) === 'blocked').map(r => r[0])
    state.value[id] = 'done'
    const freed = rows.filter(r => was.includes(r[0]) && status(r[0]) === 'ready').map(r => r[1])
    notice.value = freed.length ? `${byId[id].title} is done. ${freed.join(', ')} can start now.` : `${byId[id].title} is done.`
  }
}
function reset() { state.value = Object.fromEntries(rows.map(r => [r[0], r[5]])); sel.value = null; notice.value = 'Demo reset.' }
const active = computed(() => sel.value ? byId[sel.value] : null)
const waitingOn = computed(() => active.value ? active.value.deps.filter(d => state.value[d[0]] !== 'done') : [])
const unblocks = computed(() => active.value ? edges.filter(e => e.from === active.value!.id) : [])
const total = rows.reduce((s, r) => s + r[3], 0)
</script>

<template>
<section class="dg" :aria-label="`${studio ? 'Studio engagement' : 'Orbit launch'} task dependency graph`">
  <header class="dg-head">
    <div><span class="dg-eyebrow">TASK DEPENDENCIES</span><h3>{{ studio ? 'Client engagement' : 'Orbit product launch' }}</h3>
      <p>{{ rows.length }} tasks · {{ edges.length }} links · {{ total }} working days of effort · critical path {{ critical.days }} days</p></div>
    <div class="dg-actions"><button type="button" class="dg-btn" :aria-pressed="onlyCritical" @click="onlyCritical = !onlyCritical">Critical path</button><button type="button" class="dg-btn dg-ghost" @click="reset">Reset</button></div>
  </header>
  <div class="dg-legend" role="group" aria-label="Link types">
    <button v-for="k in kinds" :key="k.id" type="button" class="dg-chip" :class="`k-${k.id}`" :aria-pressed="!hidden.includes(k.id)" :title="k.hint" @click="toggleKind(k.id)"><i></i>{{ k.label }}<b>{{ edges.filter(e => e.kind === k.id).length }}</b></button>
    <span class="dg-stats"><span class="s-done">{{ counts.done }} done</span><span class="s-ready">{{ counts.ready }} ready</span><span class="s-blocked">{{ counts.blocked }} blocked</span></span>
  </div>
  <div class="dg-body">
    <div class="dg-scroll"><svg :viewBox="`0 0 ${W} ${H}`" :style="{ width: '100%', maxWidth: W + 'px', minWidth: '500px' }" role="group" aria-label="Dependency graph. Select a task to highlight what it waits on and what waits on it.">
      <g fill="none">
        <path v-for="e in visibleEdges" :key="e.key" :d="paths[e.key]" class="dg-edge" :class="[`k-${e.kind}`, { on: edgeOn(e), dim: (focus && !edgeOn(e)) || (onlyCritical && !(critical.ids.has(e.from) && critical.ids.has(e.to) && e.kind === 'blocks')), flow: state[e.from] === 'doing' }]" />
      </g>
      <g v-for="r in rows" :key="r[0]" class="dg-node" :class="[`st-${status(r[0])}`, { dim: !nodeOn(r[0]) || (onlyCritical && !critical.ids.has(r[0])), sel: sel === r[0], crit: onlyCritical && critical.ids.has(r[0]) }]" :transform="`translate(${at[r[0]].x} ${at[r[0]].y})`" tabindex="0" role="button" :aria-pressed="sel === r[0]" :aria-label="`${r[1]}, ${label[status(r[0])]}, owner ${people[r[2]]}`" @click="sel = sel === r[0] ? null : r[0]" @keydown.enter.prevent="sel = sel === r[0] ? null : r[0]" @keydown.space.prevent="sel = sel === r[0] ? null : r[0]" @mouseenter="hover = r[0]" @mouseleave="hover = null" @focus="hover = r[0]" @blur="hover = null">
        <rect class="dg-card" :width="NW" :height="NH" rx="10" />
        <rect class="dg-bar" x="0" y="10" width="3" :height="NH - 20" rx="1.5" />
        <text class="dg-meta" x="14" y="19">{{ label[status(r[0])].toUpperCase() }} · {{ r[3] }}d</text>
        <text class="dg-title" x="14" y="39">{{ r[1] }}</text>
        <circle class="dg-av" :cx="NW - 18" cy="19" r="9" /><text class="dg-av-t" :x="NW - 18" y="22.5" text-anchor="middle">{{ people[r[2]].split(' ').map(n => n[0]).join('') }}</text>
      </g>
    </svg></div>
    <aside class="dg-panel" aria-live="polite">
      <template v-if="active">
        <span class="dg-eyebrow">TASK</span><h4>{{ active.title }}</h4>
        <span class="dg-pill" :class="`st-${status(active.id)}`">{{ label[status(active.id)] }}</span>
        <dl><dt>Owner</dt><dd>{{ people[active.owner] }}</dd><dt>Effort</dt><dd>{{ active.days }} working days</dd><dt>Waiting on</dt><dd>{{ waitingOn.length ? waitingOn.map(d => byId[d[0]].title).join(', ') : 'Nothing' }}</dd><dt>Unblocks</dt><dd>{{ unblocks.length ? unblocks.map(e => byId[e.to].title).join(', ') : 'Nothing, this is an end point' }}</dd></dl>
        <button v-if="status(active.id) === 'ready'" type="button" class="dg-btn" @click="advance(active.id)">Start task</button>
        <button v-else-if="status(active.id) === 'doing'" type="button" class="dg-btn" @click="advance(active.id)">Mark done</button>
        <p v-else-if="status(active.id) === 'blocked'" class="dg-note">Finish {{ waitingOn.filter(d => d[1] !== 'shares').map(d => byId[d[0]].title).join(' and ') }} first.</p>
      </template>
      <template v-else><span class="dg-eyebrow">INSPECTOR</span><h4>Select a task</h4><p class="dg-note">Hover or select a card to light up its chain: what it waits on and what waits on it. Start and finish tasks to watch downstream cards unlock.</p></template>
      <p class="dg-feedback" role="status">{{ notice || 'Demo only. Nothing is saved.' }}</p>
    </aside>
  </div>
</section>
</template>
