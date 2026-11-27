<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()

function agentPathFromRoute(path: string) {
  if (!path.startsWith('/margin/')) return ''
  const rest = path.replace(/^\/margin\/?/, '').replace(/\/$/, '')
  if (!rest) return ''
  const segments = rest.split('/').filter(Boolean)
  if (segments.length === 1) return `${segments[0]}/index`
  return segments.join('/')
}

const agentPath = computed(() => agentPathFromRoute(route.path))

const open = ref(false)
const mode = ref<'rendered' | 'markdown'>('rendered')
const raw = ref('')
const loadError = ref('')
const motionReady = ref(false)
const copied = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    motionReady.value = true
  })
})

async function load() {
  loadError.value = ''
  try {
    const res = await fetch(`/margin/agents/${agentPath.value}.md`)
    if (!res.ok) throw new Error(`${res.status}`)
    raw.value = await res.text()
  } catch {
    loadError.value = `No se pudo cargar (${agentPath.value}.md).`
    raw.value = ''
  }
}

watch(agentPath, () => {
  raw.value = ''
  if (open.value) void load()
})

function toggleOpen() {
  open.value = !open.value
  if (open.value && !raw.value) void load()
}

function renderSimpleMd(src: string) {
  let html = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
  html = html.replace(/^- \[ \] (.+)$/gm, '<li class="mg-agent-check">$1</li>')
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li[\s\S]*?<\/li>\n?)+/g, (block) => `<ul>${block}</ul>`)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  return html
}

const rendered = computed(() => (raw.value ? renderSimpleMd(raw.value) : ''))

async function copyRaw() {
  if (!raw.value) return
  try {
    await navigator.clipboard.writeText(raw.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    /* ignore */
  }
}
</script>
<template>
  <div
    v-if="agentPath"
    class="mg-agent-panel"
    :class="{ 'mg-agent-panel--open': open, 'mg-agent-motion': motionReady }"
  >
    <div class="mg-agent-panel__bar">
      <button
        type="button"
        class="mg-agent-panel__toggle"
        :aria-expanded="open"
        aria-controls="mg-agent-panel-body"
        @click="toggleOpen"
      >
        Para agentes
      </button>
    </div>
    <div v-show="open" id="mg-agent-panel-body" class="mg-agent-panel__body">
      <div class="mg-agent-panel__modes" role="tablist" aria-label="Vista de instrucciones">
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'rendered'"
          :class="{ active: mode === 'rendered' }"
          @click="mode = 'rendered'"
        >
          Renderizado
        </button>
        <button
          type="button"
          role="tab"
          :aria-selected="mode === 'markdown'"
          :class="{ active: mode === 'markdown' }"
          @click="mode = 'markdown'"
        >
          Markdown
        </button>
        <button type="button" class="mg-agent-panel__copy" :disabled="!raw" @click="copyRaw">
          {{ copied ? 'Copiado' : 'Copiar' }}
        </button>
      </div>
      <p v-if="loadError" class="mg-agent-panel__error">{{ loadError }}</p>
      <div v-else-if="mode === 'rendered'" class="mg-agent-panel__render vp-doc" v-html="rendered" />
      <pre v-else class="mg-agent-panel__raw"><code>{{ raw }}</code></pre>
    </div>
  </div>
</template>