import { computed, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

export function agentPathFromRoute(path: string) {
  if (!path.startsWith('/margin/')) return ''
  const rest = path.replace(/^\/margin\/?/, '').replace(/\/$/, '')
  if (!rest) return ''
  const segments = rest.split('/').filter(Boolean)
  if (segments.length === 1) return `${segments[0]}/index`
  return segments.join('/')
}

export function useMarginAgentInstructions() {
  const route = useRoute()
  const agentPath = computed(() => agentPathFromRoute(route.path))

  const open = ref(false)
  const mode = ref<'rendered' | 'markdown'>('rendered')
  const raw = ref('')
  const loadError = ref('')
  const copied = ref(false)

  async function load() {
    if (!agentPath.value) return
    loadError.value = ''
    try {
      const res = await fetch(`/margin/agents/${agentPath.value}.md`)
      if (!res.ok) throw new Error(`${res.status}`)
      raw.value = await res.text()
    } catch {
      loadError.value = `Could not load (${agentPath.value}.md).`
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

  return {
    agentPath,
    open,
    mode,
    raw,
    loadError,
    copied,
    toggleOpen,
    rendered,
    copyRaw,
    load,
  }
}