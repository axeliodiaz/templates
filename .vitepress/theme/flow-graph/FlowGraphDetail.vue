<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import RelayIcon from '../RelayIcon.vue'
import { formatMs } from './flow-graph.geometry'
import { insertRowAnimated, keep, stopAll, tweenNumber } from './flow-graph.motion'
import type { Controls } from './flow-graph.motion'
import type { CallRecord, FlowGraphLabels, FlowNode, NodeDetail } from './flow-graph.types'
const props = defineProps<{ node: FlowNode; detail: NodeDetail; labels: FlowGraphLabels; reduced: boolean; count: number; onReplay?: (call: CallRecord) => Promise<CallRecord> }>()
const emit = defineEmits<{ back: []; replayed: [CallRecord]; live: [string] }>()
const root = ref<HTMLElement>(), title = ref<HTMLElement>(), countEl = ref<HTMLElement>(), dialog = ref<HTMLDialogElement>(), edit = ref<HTMLButtonElement>(), replayButton=ref<HTMLButtonElement>()
const calls = ref<CallRecord[]>([...props.detail.calls]), selected = ref(calls.value[0]?.id), limit = ref(50), busy = ref(false)
const current = computed(() => calls.value.find(c => c.id === selected.value)), shown = computed(() => calls.value.slice(0, limit.value))
const anims = new Set<Controls>(); let alive = true, timer: ReturnType<typeof setTimeout> | undefined, cancelDemo: (() => void) | undefined, sequence = 0
function json(value: unknown) {
  try {
    const text = JSON.stringify(value, null, 2) ?? '—', bytes = new TextEncoder().encode(text)
    return bytes.length > 102400 ? `${new TextDecoder().decode(bytes.subarray(0, 102400))}\n… (truncado, ${Math.round(bytes.length / 1024)} KB)` : text
  } catch { return 'No se puede mostrar este valor.' }
}
const input = computed(() => json(current.value?.input)), output = computed(() => json(current.value?.output))
watch(() => props.reduced, () => { if(props.reduced) { anims.forEach(c=>c.complete());stopAll(anims) } })
watch(() => props.count, (n, old) => { stopAll(anims); if (countEl.value) { const c = tweenNumber(countEl.value, old, n, props.labels.calls, .3); if(c)keep(anims,c) } })
watch(() => props.detail.calls, value => { if (!busy.value) { calls.value = [...value]; if (!calls.value.some(c => c.id === selected.value)) selected.value = calls.value[0]?.id } }, { deep: true })
function chooseKey(event: KeyboardEvent, index: number) { const next = event.key === 'ArrowDown' ? (index+1)%shown.value.length : event.key === 'ArrowUp' ? (index-1+shown.value.length)%shown.value.length : -1; if(next<0)return;event.preventDefault();selected.value=shown.value[next].id;root.value?.querySelectorAll<HTMLButtonElement>('.rl-fg-call-button')[next]?.focus() }
async function replay() {
  if (busy.value || !current.value) return
  const original = current.value, id = `replay-${Date.now()}-${++sequence}`
  busy.value = true; emit('live', `Repitiendo llamada de ${props.node.label}…`)
  const row: CallRecord = { ...original, id, status: 'running', durationMs: undefined, output: undefined, startedAt: new Date().toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit' }) }
  calls.value.unshift(row); selected.value = id
  await nextTick()
  if (!alive) return
  const el = [...(root.value?.querySelectorAll<HTMLElement>('[data-call]') ?? [])].find(el => el.dataset.call === id)
  if(el) { const c=insertRowAnimated(el,props.reduced);if(c)keep(anims,c) }
  let result: CallRecord
  try { result = props.onReplay ? await props.onReplay(original) : await new Promise<CallRecord>(resolve => { cancelDemo=()=>resolve({...original,status:'failed'});timer=setTimeout(()=>resolve({...original,status:'ok',durationMs:2000}),2000) }) }
  catch { result = { ...original, status:'failed', durationMs:undefined } }
  if(!alive)return
  cancelDemo=undefined; const final = { ...result, id, startedAt:row.startedAt };calls.value[0]=final
  emit('replayed',final);emit('live',final.status==='ok'?`Repetición completada: ${props.node.label}, ${formatMs(final.durationMs ?? 0)}, correcta.`:`La repetición de ${props.node.label} falló.`);busy.value=false;await nextTick();if(document.activeElement===document.body)replayButton.value?.focus()
}
function showInput() { dialog.value?.showModal() }
onBeforeUnmount(()=>{alive=false;stopAll(anims);clearTimeout(timer);cancelDemo?.();dialog.value?.close()})
defineExpose({ root, title })
</script>
<template>
  <div ref="root" class="rl-fg-detail">
    <header class="rl-fg-detail-head">
      <button type="button" class="btn-outline btn-icon theme-primary rl-fg-back" :aria-label="labels.back" @click="emit('back')"><RelayIcon name="chevron-left" /></button>
      <span class="rl-fg-icon rl-fg-icon-tool" aria-hidden="true"><RelayIcon :name="node.icon || 'tools'" /></span>
      <div class="rl-fg-grow"><h2 ref="title" class="rl-fg-detail-title" tabindex="-1">{{ detail.title || node.label }}</h2><p class="rl-fg-detail-sub">{{ detail.sublabel || node.sublabel }}</p></div>
      <span aria-hidden="true" ref="countEl" class="rl-fg-detail-count">{{ labels.calls(count) }}</span><span class="rl-fg-sr">{{ labels.calls(count) }}</span>
    </header>
    <div class="rl-fg-detail-body">
      <ol class="rl-fg-calls" :aria-label="labels.calls(calls.length)">
        <li v-for="(call,index) in shown" :key="call.id" :data-call="call.id" class="rl-fg-call">
          <button type="button" class="rl-fg-call-button" :aria-current="selected === call.id ? 'true' : undefined" @click="selected=call.id" @keydown="chooseKey($event,index)">
            <span class="rl-fg-call-state" :data-status="call.status"><span v-if="call.status==='running' && !reduced" class="rl-fg-spinner" aria-hidden="true"></span><RelayIcon v-else :name="call.status==='running'?'clock':call.status==='failed'?'alert':'approvals'" /><span class="rl-fg-sr">{{ call.status==='ok'?'Correcta':call.status==='failed'?labels.failed:labels.running }}</span></span>
            <span class="rl-fg-call-copy"><code :title="call.label">{{ call.label }}</code><span>{{ call.startedAt }}</span></span><span class="rl-fg-call-duration">{{ call.durationMs === undefined ? '—' : formatMs(call.durationMs) }}</span>
          </button>
        </li>
        <li v-if="calls.length>limit"><button type="button" class="rl-fg-more" @click="limit+=50">Ver {{ Math.min(50,calls.length-limit) }} más</button></li>
      </ol>
      <div class="rl-fg-io">
        <template v-if="current"><div><div class="rl-fg-io-label"><span>{{ labels.input }}</span><span>{{ current.startedAt }}</span></div><pre tabindex="0">{{ input }}</pre></div><div :key="`${current.id}-${current.status}`" class="rl-fg-output"><div class="rl-fg-io-label"><span>{{ labels.output }}</span><span>{{ current.durationMs === undefined ? '—' : formatMs(current.durationMs) }}</span></div><pre tabindex="0">{{ output }}</pre></div></template>
        <p v-else class="rl-fg-empty">Sin llamadas registradas.</p>
        <div class="rl-fg-detail-actions"><button ref="edit" type="button" class="btn-outline theme-primary" :disabled="!current" @click="showInput">{{ labels.editInput }}</button><button ref="replayButton" type="button" class="btn-solid theme-primary" :disabled="busy || !current" :aria-busy="busy" @click="replay"><RelayIcon name="replay" />{{ labels.replay }}</button></div>
      </div>
    </div>
    <dialog ref="dialog" class="dialog rl-fg-dialog" @close="edit?.focus()"><h2>{{ labels.input }}</h2><p>En esta plantilla la entrada no se puede editar.</p><pre tabindex="0">{{ input }}</pre><form method="dialog"><button class="btn-outline theme-primary">Cerrar</button></form></dialog>
  </div>
</template>
