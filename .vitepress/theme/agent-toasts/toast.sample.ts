import type { AgentToastData } from './toast.model'

export const samples = {
  session: (): AgentToastData => ({
    id: 'session',
    tone: 'success',
    title: 'Session finished',
    detail: [
      { text: 'Search revamp · ' },
      { text: '+96', kind: 'plus' },
      { text: ' ' },
      { text: '−24', kind: 'minus' },
    ],
    visual: { type: 'diff', added: 96, removed: 24 },
  }),
  testsRunning: (n: number): AgentToastData => ({
    id: 'tests',
    tone: 'info',
    title: 'Running tests',
    detail: `${n} of 48`,
    visual: { type: 'tests', total: 48, passed: n, running: true },
    busy: true,
    dismissible: false,
  }),
  testsPassed: (): AgentToastData => ({
    id: 'tests',
    tone: 'success',
    title: 'Tests passed',
    detail: '48 in 58s',
    visual: { type: 'tests', total: 48, passed: 48 },
  }),
  pr: (): AgentToastData => ({
    id: 'pr',
    tone: 'neutral',
    title: 'PR #217 merged',
    detail: [{ text: 'fix/login-redirect → main', kind: 'mono' }],
    visual: { type: 'branch', state: 'merged', from: 'fix/login-redirect', to: 'main', commits: 2 },
  }),
  deployFail: (): AgentToastData => ({
    id: 'deploy',
    tone: 'danger',
    title: 'Deploy failed',
    detail: 'Migration timed out',
    visual: { type: 'pipeline', steps: ['done', 'done', 'failed', 'pending', 'pending'] },
    action: { id: 'retry', label: 'Retry' },
  }),
  deployBusy: (): AgentToastData => ({
    id: 'deploy',
    tone: 'info',
    title: 'Deploying',
    detail: 'Retrying from migrate',
    visual: { type: 'pipeline', steps: ['done', 'done', 'active', 'pending', 'pending'] },
    busy: true,
    dismissible: false,
  }),
  deployLive: (): AgentToastData => ({
    id: 'deploy',
    tone: 'success',
    title: 'Deploy live',
    detail: 'docs-site · 1m 38s',
    visual: { type: 'pipeline', steps: ['done', 'done', 'done', 'done', 'final'] },
  }),
  build: (): AgentToastData => ({
    id: 'build',
    tone: 'success',
    title: 'Build 32% faster',
    detail: '41s, usually 1m 0s',
    visual: { type: 'bars', values: [62, 58, 64, 60, 59, 61, 41], unit: 's' },
  }),
  context: (): AgentToastData => ({
    id: 'context',
    tone: 'warning',
    title: 'Context almost full',
    detail: '172k of 200k',
    visual: { type: 'context', used: 172_000, total: 200_000, phase: 'idle' },
    action: { id: 'compact', label: 'Compact' },
  }),
  contextBusy: (p: number): AgentToastData => ({
    id: 'context',
    tone: 'info',
    title: 'Compacting',
    detail: 'Summarizing 36 turns',
    visual: { type: 'context', used: 172_000, total: 200_000, after: 58_000, phase: 'compacting', progress: p },
    busy: true,
    dismissible: false,
  }),
  contextDone: (): AgentToastData => ({
    id: 'context',
    tone: 'info',
    title: 'Context compacted',
    detail: '172k → 58k tokens',
    visual: { type: 'context', used: 172_000, total: 200_000, after: 58_000, phase: 'done' },
  }),
}

export type PlayStep =
  | { at: number; push: () => AgentToastData }
  | { at: number; update: { id: string; data: () => AgentToastData } }

export const playScript: PlayStep[] = [
  { at: 0, push: samples.session },
  { at: 700, push: () => samples.testsRunning(0) },
  { at: 850, update: { id: 'tests', data: () => samples.testsRunning(8) } },
  { at: 1000, update: { id: 'tests', data: () => samples.testsRunning(16) } },
  { at: 1150, update: { id: 'tests', data: () => samples.testsRunning(24) } },
  { at: 1300, update: { id: 'tests', data: () => samples.testsRunning(32) } },
  { at: 1450, update: { id: 'tests', data: () => samples.testsRunning(40) } },
  { at: 1600, update: { id: 'tests', data: () => samples.testsPassed() } },
  { at: 1650, push: samples.pr },
  { at: 2100, push: samples.deployFail },
  { at: 2800, push: samples.build },
  { at: 3500, push: samples.context },
]

export function runPlaySequence(push: (d: AgentToastData) => void, update: (id: string, d: AgentToastData) => void, clear: () => void) {
  clear()
  const timers: ReturnType<typeof setTimeout>[] = []
  for (const step of playScript) {
    timers.push(
      setTimeout(() => {
        if ('push' in step) push(step.push())
        else update(step.update.id, step.update.data())
      }, step.at),
    )
  }
  return () => timers.forEach(t => clearTimeout(t))
}

export function runRetryScript(onUpdate: (id: string, data: AgentToastData) => void) {
  const steps = [
    { delay: 0, data: samples.deployBusy() },
    {
      delay: 800,
      data: {
        ...samples.deployBusy(),
        visual: { type: 'pipeline' as const, steps: ['done', 'done', 'done', 'active', 'pending'] as const },
      },
    },
  ]
  const tail = { delay: 1600, data: samples.deployLive() }
  const timers: ReturnType<typeof setTimeout>[] = []
  let base = 0
  for (const step of [...steps, tail]) {
    base += step.delay
    timers.push(setTimeout(() => onUpdate('deploy', { ...step.data, id: 'deploy' }), base))
  }
  return () => timers.forEach(t => clearTimeout(t))
}

export function runCompactScript(onUpdate: (id: string, data: AgentToastData) => void) {
  const timers: ReturnType<typeof setTimeout>[] = []
  ;[0.25, 0.5, 0.75, 1].forEach((p, i) => {
    timers.push(
      setTimeout(() => {
        if (i < 3) onUpdate('context', { ...samples.contextBusy(p), id: 'context' })
        else onUpdate('context', { ...samples.contextDone(), id: 'context' })
      }, i * 500),
    )
  })
  return () => timers.forEach(t => clearTimeout(t))
}