<script setup>
import { ref } from 'vue'

const states = ['Pendiente', 'En camino', 'Entregado']
const tasks = ref([
  { id: 'maria', title: 'Envío a María', detail: '$100.00 · CDMX', state: 0 },
  { id: 'luis', title: 'Recarga a Luis', detail: '$20.00 · Guatemala', state: 1 },
  { id: 'elektra', title: 'Retiro en Elektra', detail: '$250.00 · efectivo', state: 0 }
])
const expanded = ref(false)
const replay = ref(0)

function advance(task) {
  if (task.state < 2) task.state += 1
}

function topFor(task) {
  const peers = tasks.value.filter((item) => item.state === task.state)
  return 56 + peers.findIndex((item) => item.id === task.id) * 92
}
</script>

# Motion

Motion marks a real state change. These samples use local state only. A task card moves into the next column when its transfer advances. It does not disappear and reappear.

## Task cards between states

Pendiente, en camino, entregado. Press **Avanzar** on a card.

<div class="fx-motion">
  <div class="fx-board">
    <div class="fx-board-labels">
      <span v-for="name in states" :key="name">{{ name }}</span>
    </div>
    <article
      v-for="task in tasks"
      :key="task.id"
      class="fx-task"
      :style="{ left: `calc(${task.state} * 33.333% + 10px)`, top: topFor(task) + 'px' }"
    >
      <strong>{{ task.title }}</strong>
      <small>{{ task.detail }}</small>
      <span class="fx-task-state">{{ states[task.state] }}</span>
      <button type="button" class="fx-btn fx-btn-primary" :disabled="task.state === 2" @click="advance(task)">
        {{ task.state === 2 ? 'Entregado' : 'Avanzar' }}
      </button>
    </article>
  </div>
</div>

## Status

En camino pulses once per cycle. Bloqueado stays still. Entregado shows a single ring when it is reached, not a loop.

<div class="fx-motion fx-status-row">
  <span class="fx-state"><i class="fx-pulse"></i> En camino</span>
  <span class="fx-state"><i class="fx-blocked"></i> Bloqueado</span>
  <span class="fx-state"><i class="fx-done"></i> Entregado</span>
</div>

## Expand a card

<div class="fx-motion">
  <button type="button" class="fx-expand" :aria-expanded="expanded" aria-controls="felix-motion-detail" @click="expanded = !expanded">
    <strong>Envío a María</strong>
    <span>{{ expanded ? 'Ocultar' : 'Detalle' }}</span>
  </button>
  <div id="felix-motion-detail" v-if="expanded" class="fx-expand-detail">
    <span class="fx-badge">En camino</span>
    <p>Llega en 1–3 días hábiles. La comisión es $0.00.</p>
  </div>
</div>

## Staggered list

<div class="fx-motion">
  <button type="button" class="fx-btn fx-btn-line" @click="replay++">Repetir entrada</button>
  <div :key="replay" class="fx-stagger">
    <div v-for="(item, index) in ['Revisar monto', 'Confirmar destino', 'Enviar']" :key="item" :style="{ '--item-delay': index * 70 + 'ms' }">{{ item }}</div>
  </div>
</div>

Keep labels visible when motion is reduced. Animate a card only after the state actually changes.
