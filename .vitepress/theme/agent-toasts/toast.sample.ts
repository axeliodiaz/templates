import type { AgentToastData } from './toast.model'

/** Section 13 · original English demo copy (synthetic agent run). */
export const originalData: AgentToastData[] = [
  {
    id: 'session',
    tone: 'info',
    title: 'Session linked',
    detail: 'Workspace cursor/agent-toasts-tem392 · read-only demo.',
    visual: { type: 'context', used: 18400, total: 128000, phase: 'idle' },
  },
  {
    id: 'tests',
    tone: 'neutral',
    title: 'Running tests',
    detail: [{ text: '12 suites', kind: 'mono' }, { text: '· 248 cases', kind: 'mono' }],
    visual: { type: 'tests', total: 248, passed: 196, running: true },
    busy: true,
  },
  {
    id: 'pr',
    tone: 'success',
    title: 'Pull request ready',
    detail: [{ text: '+42', kind: 'plus' }, { text: '−18', kind: 'minus' }, { text: '· 3 files', kind: 'mono' }],
    visual: { type: 'diff', added: 42, removed: 18 },
    action: { id: 'open-pr', label: 'Open PR' },
  },
  {
    id: 'deploy',
    tone: 'info',
    title: 'Deploy pipeline',
    detail: 'Stage 4 of 5 · preview URL pending',
    visual: { type: 'pipeline', steps: ['done', 'done', 'done', 'active', 'pending'] },
    busy: true,
  },
  {
    id: 'build',
    tone: 'warning',
    title: 'Build slower than usual',
    detail: 'Median 62s · latest 94s',
    visual: { type: 'bars', values: [48, 55, 60, 58, 62, 71, 94], unit: 's' },
  },
  {
    id: 'context',
    tone: 'danger',
    title: 'Context nearly full',
    detail: 'Compact or trim attachments before the next tool batch.',
    visual: { type: 'context', used: 118000, total: 128000, phase: 'idle' },
    action: { id: 'compact', label: 'Compact' },
    dismissible: true,
  },
]

export const deployDone: AgentToastData = {
  id: 'deploy',
  tone: 'success',
  title: 'Deploy finished',
  detail: 'Preview https://demo.local/agents · 5 of 5 steps',
  visual: { type: 'pipeline', steps: ['done', 'done', 'done', 'done', 'final'] },
  action: { id: 'open-preview', label: 'Open' },
}

export const compacting: AgentToastData = {
  id: 'context',
  tone: 'warning',
  title: 'Compacting context',
  detail: 'Reclaiming tokens from older turns.',
  visual: { type: 'context', used: 118000, total: 128000, after: 72000, phase: 'compacting', progress: 0.45 },
  busy: true,
  duration: null,
}

export const compactDone: AgentToastData = {
  id: 'context',
  tone: 'success',
  title: 'Context compacted',
  detail: [{ text: '72k', kind: 'mono' }, { text: ' of 128k tokens', kind: 'mono' }],
  visual: { type: 'context', used: 118000, total: 128000, after: 72000, phase: 'done' },
}

export const testsFailed: AgentToastData = {
  id: 'tests',
  tone: 'danger',
  title: 'Tests failed',
  detail: [{ text: '3 failing', kind: 'minus' }, { text: '· payments.spec.ts', kind: 'mono' }],
  visual: { type: 'tests', total: 248, passed: 245, failed: 3 },
  action: { id: 'retry-tests', label: 'Retry' },
}

const SEQUENCE_DELAYS = [0, 700, 1400, 2100, 2800, 3500]

export function playSequence(
  push: (data: AgentToastData) => void,
  options?: { client?: boolean; onDone?: () => void },
): () => void {
  const client = options?.client ?? typeof window !== 'undefined'
  const timers: ReturnType<typeof setTimeout>[] = []
  originalData.forEach((data, i) => {
    const run = () => push({ ...data })
    if (!client) {
      run()
      return
    }
    timers.push(setTimeout(run, SEQUENCE_DELAYS[i] ?? 0))
  })
  if (client && options?.onDone) {
    const last = SEQUENCE_DELAYS[SEQUENCE_DELAYS.length - 1]! + 200
    timers.push(setTimeout(options.onDone, last))
  }
  return () => timers.forEach(t => clearTimeout(t))
}

export function demoRetry(store: { update: (id: string, data: AgentToastData) => void; push: (d: AgentToastData) => void }) {
  store.update('tests', {
    ...testsFailed,
    busy: true,
    title: 'Retrying tests',
    detail: 'Running failed shard only.',
    visual: { type: 'tests', total: 248, passed: 245, failed: 3, running: true },
    action: undefined,
  })
  if (typeof window !== 'undefined') {
    return window.setTimeout(() => {
      store.update('tests', {
        id: 'tests',
        tone: 'success',
        title: 'Tests passed',
        detail: 'All 248 cases green after retry.',
        visual: { type: 'tests', total: 248, passed: 248 },
      })
    }, 1400)
  }
  store.update('tests', {
    id: 'tests',
    tone: 'success',
    title: 'Tests passed',
    detail: 'All 248 cases green after retry.',
    visual: { type: 'tests', total: 248, passed: 248 },
  })
  return undefined
}

export function demoCompact(store: {
  update: (id: string, data: AgentToastData) => void
  push: (d: AgentToastData) => void
}) {
  store.update('context', compacting)
  let t2: ReturnType<typeof setTimeout> | undefined
  const t1 =
    typeof window !== 'undefined'
      ? window.setTimeout(() => {
          t2 = window.setTimeout(() => store.update('context', compactDone), 900)
        }, 700)
      : undefined
  if (!t1) store.update('context', compactDone)
  return () => {
    if (t1) clearTimeout(t1)
    if (t2) clearTimeout(t2)
  }
}

export function queueBurst(push: (data: AgentToastData) => void) {
  for (let i = 0; i < 9; i++) {
    push({
      id: `burst-${i}`,
      tone: i % 3 === 0 ? 'warning' : 'neutral',
      title: `Queued update ${i + 1}`,
      detail: 'FIFO demo · max six visible.',
      visual: { type: 'bars', values: [40 + i * 4, 44, 48], unit: 's' },
    })
  }
}