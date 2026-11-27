export type Tone = 'neutral' | 'success' | 'info' | 'warning' | 'danger'
export type Step = 'done' | 'active' | 'failed' | 'pending' | 'final'
export type Visual =
  | { type: 'diff'; added: number; removed: number; scale?: number }
  | { type: 'tests'; total: number; passed: number; failed?: number; running?: boolean }
  | { type: 'branch'; state: 'merged' | 'open'; from: string; to: string; commits?: number }
  | { type: 'pipeline'; steps: Step[] }
  | { type: 'bars'; values: number[]; unit: 's' }
  | {
      type: 'context'
      used: number
      total: number
      after?: number
      phase?: 'idle' | 'compacting' | 'done'
      progress?: number
    }

export type DetailPart = { text: string; kind?: 'plus' | 'minus' | 'mono' }

export interface AgentToastData {
  id?: string
  tone: Tone
  title: string
  detail?: string | DetailPart[]
  visual: Visual
  alt?: string
  action?: { id: string; label: string }
  busy?: boolean
  duration?: number | null
  dismissible?: boolean
}

export type DismissReason = 'close' | 'swipe' | 'timeout' | 'evict' | 'clear'

export interface StackItem {
  key: string
  data: AgentToastData
  dedupeAt?: number
}

export interface StackState {
  items: StackItem[]
  queue: AgentToastData[]
  max: number
}

export type StackEvent =
  | { type: 'push'; data: AgentToastData; now: number }
  | { type: 'update'; id: string; data: AgentToastData }
  | { type: 'dismiss'; id: string; reason: DismissReason }
  | { type: 'expire'; id: string }
  | { type: 'dequeue' }
  | { type: 'clear' }

export const DURATION = 6000
export const DURATION_DANGER = 10000
export const DEDUPE_WINDOW = 4000
export const MAX = 6

export type CellFill = 'ok' | 'bad' | 'warn' | 'info' | 'cell' | 'muted' | 'ink' | 'on-bad' | 'on-ok'

export type VisualShape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number; fill: CellFill; rx?: number }
  | { kind: 'circle'; cx: number; cy: number; r: number; fill?: CellFill; stroke?: CellFill; strokeWidth?: number }
  | { kind: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: CellFill; strokeWidth?: number; dash?: string }
  | { kind: 'path'; d: string; stroke?: CellFill; fill?: CellFill; strokeWidth?: number; dash?: string }
  | { kind: 'text'; x: number; y: number; text: string; fill: CellFill; size?: number }

const int0 = (n: number) => (!Number.isFinite(n) || n < 0 || !Number.isInteger(n) ? 0 : n)

export function plainDetail(detail?: string | DetailPart[]): string {
  if (!detail) return ''
  if (typeof detail === 'string') return detail.replace(/·/g, ', ')
  return detail.map(p => p.text).join(' ')
}

export function sanitize(d: AgentToastData): AgentToastData | null {
  if (!d.title?.trim()) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('agent-toast: empty title discarded')
    }
    return null
  }
  const v = { ...d, title: d.title.trim() }
  if (v.action && v.action.label.length > 12 && typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('agent-toast: action label over 12 chars')
  }
  return v
}

export function durationFor(d: AgentToastData): number | null {
  if (d.duration !== undefined) return d.duration
  if (d.busy) return null
  if (d.action) return null
  if (d.tone === 'danger') return DURATION_DANGER
  return DURATION
}

export function dedupeKey(d: AgentToastData): string {
  if (d.id) return `id:${d.id}`
  return `${d.tone}|${d.title}|${plainDetail(d.detail)}`
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US').format(int0(n))
}

export function altText(v: Visual): string {
  switch (v.type) {
    case 'diff': {
      const a = int0(v.added)
      const r = int0(v.removed)
      if (a + r === 0) return 'No changes.'
      return `Diff: ${fmt(a)} lines added, ${fmt(r)} removed.`
    }
    case 'tests': {
      const t = Math.max(int0(v.total), 1)
      const p = Math.min(int0(v.passed), t)
      const f = int0(v.failed)
      if (v.running) return `${fmt(p)} of ${fmt(t)} tests done.`
      if (f > 0) return `${fmt(p)} of ${fmt(t)} tests passed, ${fmt(f)} failed.`
      return `${fmt(p)} of ${fmt(t)} tests passed.`
    }
    case 'branch': {
      const n = Math.min(Math.max(int0(v.commits ?? 2), 1), 3)
      if (v.state === 'merged') return `Branch ${v.from} merged into ${v.to}, ${n} commits.`
      return `Branch ${v.from} open, ${n} commits.`
    }
    case 'pipeline': {
      const steps = normalizeSteps(v.steps)
      const n = steps.length
      let done = 0
      let failedAt = -1
      let activeAt = -1
      steps.forEach((s, i) => {
        if (s === 'done' || s === 'final') done++
        if (s === 'failed') failedAt = i
        if (s === 'active') activeAt = i
      })
      if (steps.includes('final') && !steps.includes('failed')) return `Pipeline: ${fmt(n)} of ${fmt(n)} steps done.`
      if (failedAt >= 0) return `Pipeline: ${fmt(done)} of ${fmt(n)} steps done, step ${failedAt + 1} failed.`
      if (activeAt >= 0) return `Pipeline: ${fmt(done)} of ${fmt(n)} steps done, step ${activeAt + 1} running.`
      return `Pipeline: ${fmt(done)} of ${fmt(n)} steps done.`
    }
    case 'bars': {
      const vals = normalizeBars(v.values)
      if (!vals.length) return 'No data.'
      const latest = vals[vals.length - 1]
      const sorted = [...vals].sort((a, b) => a - b)
      const median = sorted[Math.floor(sorted.length / 2)]
      return `Build time, last ${fmt(vals.length)} runs: latest ${latest}${v.unit}, usually ${median}${v.unit}.`
    }
    case 'context': {
      const total = Math.max(int0(v.total), 1)
      if (v.phase === 'compacting') return 'Compacting context.'
      if (v.phase === 'done') {
        const after = int0(v.after ?? v.used)
        return `Context: ${fmt(after)} of ${fmt(total)} tokens used after compacting.`
      }
      const used = int0(v.used)
      const pct = Math.round((100 * used) / total)
      return `Context: ${fmt(used)} of ${fmt(total)} tokens used, ${pct} percent.`
    }
    default:
      return 'No data.'
  }
}

export function announceText(d: AgentToastData): { text: string; politeness: 'polite' | 'assertive' } | null {
  const alt = d.alt ?? altText(d.visual)
  const detail = plainDetail(d.detail)
  const parts = [d.title, detail, alt].filter(Boolean)
  let text = parts.join('. ')
  if (!text.endsWith('.')) text += '.'
  if (d.action && !d.busy) text += ` ${d.action.label} available.`
  const politeness = d.tone === 'danger' && !d.busy ? 'assertive' : 'polite'
  return { text, politeness }
}

function normalizeSteps(steps: Step[]): Step[] {
  let s = steps.slice(0, 6)
  while (s.length < 3) s.push('pending')
  if (s.length > 6) s = s.slice(0, 6)
  return s
}

function normalizeBars(values: number[]): number[] {
  let vals = values.filter(x => Number.isFinite(x) && x >= 0)
  if (vals.length < 3) {
    const median = vals.length ? vals[Math.floor(vals.length / 2)] : 60
    while (vals.length < 3) vals.push(median)
  }
  if (vals.length > 8) vals = vals.slice(-8)
  return vals
}

function itemKey(d: AgentToastData, index: number): string {
  return d.id ?? `anon-${dedupeKey(d)}-${index}`
}

function isPersistent(d: AgentToastData): boolean {
  return durationFor(d) === null
}

function findById(items: StackItem[], id: string): number {
  return items.findIndex(it => it.data.id === id || it.key === id)
}

export function reduce(state: StackState, ev: StackEvent): StackState {
  const max = state.max
  switch (ev.type) {
    case 'clear':
      return { ...state, items: [], queue: [] }
    case 'dismiss':
    case 'expire': {
      const id = ev.id
      const idx = findById(state.items, id)
      if (idx < 0) return state
      const items = state.items.filter((_, i) => i !== idx)
      return fillFromQueue({ ...state, items }, max)
    }
    case 'update': {
      const idx = findById(state.items, ev.id)
      const next = sanitize(ev.data)
      if (!next) return state
      if (idx >= 0) {
        const items = state.items.slice()
        items[idx] = { ...items[idx], key: items[idx].key, data: { ...next, id: ev.id } }
        return { ...state, items }
      }
      if (next.tone === 'danger') {
        return reduce(state, { type: 'push', data: next, now: Date.now() })
      }
      return state
    }
    case 'dequeue':
      return fillFromQueue(state, max)
    case 'push': {
      const raw = sanitize(ev.data)
      if (!raw) return state
      const now = ev.now
      if (raw.id) {
        const idx = findById(state.items, raw.id)
        if (idx >= 0) {
          const items = state.items.slice()
          items[idx] = { ...items[idx], data: { ...raw, id: raw.id } }
          return { ...state, items }
        }
      } else {
        const key = dedupeKey(raw)
        const dupIdx = state.items.findIndex(
          it => !it.data.id && dedupeKey(it.data) === key && now - (it.dedupeAt ?? 0) < DEDUPE_WINDOW,
        )
        if (dupIdx >= 0) {
          const items = state.items.slice()
          items[dupIdx] = { ...items[dupIdx], dedupeAt: now, data: { ...items[dupIdx].data } }
          return { ...state, items }
        }
      }

      let items = state.items.slice()
      let queue = state.queue.slice()
      const entry: StackItem = {
        key: raw.id ?? `k-${now}-${items.length}`,
        data: raw,
        dedupeAt: now,
      }

      if (items.length >= max) {
        const evictIdx = items.findIndex(it => !isPersistent(it.data))
        if (evictIdx >= 0) {
          items = items.filter((_, i) => i !== evictIdx)
        } else {
          queue.push(raw)
          return { ...state, items, queue }
        }
      }

      items = [...items, entry]
      return { ...state, items, queue }
    }
    default:
      return state
  }
}

function fillFromQueue(state: StackState, max: number): StackState {
  let items = state.items
  let queue = state.queue.slice()
  while (items.length < max && queue.length) {
    const next = queue.shift()!
    const s = sanitize(next)
    if (!s) continue
    items = [
      ...items,
      { key: s.id ?? `q-${items.length}`, data: s, dedupeAt: Date.now() },
    ]
  }
  return { ...state, items, queue }
}

export function cells(v: Visual): VisualShape[] {
  switch (v.type) {
    case 'diff':
      return cellsDiff(v)
    case 'tests':
      return cellsTests(v)
    case 'branch':
      return cellsBranch(v)
    case 'pipeline':
      return cellsPipeline(v)
    case 'bars':
      return cellsBars(v)
    case 'context':
      return cellsContext(v)
    default:
      return []
  }
}

function cellsDiff(v: Extract<Visual, { type: 'diff' }>): VisualShape[] {
  const a = int0(v.added)
  const r = int0(v.removed)
  const scale = int0(v.scale ?? 300) || 300
  const shapes: VisualShape[] = []
  const cols = 8
  const rows = 3
  const cw = 5.5
  const ch = 5.5
  const gap = 1.5
  let filled = Math.round(24 * ((a + r) / Math.max(a + r, scale)))
  filled = Math.min(Math.max(filled, a + r > 0 ? 1 : 0), 24)
  const okCount = Math.round((filled * a) / Math.max(a + r, 1))
  let n = 0
  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < rows; row++) {
      const x = c * (cw + gap)
      const y = row * (ch + gap)
      let fill: CellFill = 'cell'
      if (n < filled) {
        fill = n < okCount ? 'ok' : 'bad'
        n++
      }
      shapes.push({ kind: 'rect', x, y, w: cw, h: ch, fill, rx: 1.4 })
    }
  }
  return shapes
}

function cellsTests(v: Extract<Visual, { type: 'tests' }>): VisualShape[] {
  const total = Math.max(int0(v.total), 1)
  const passed = Math.min(int0(v.passed), total)
  const failed = int0(v.failed)
  const cols = 13
  const rows = 4
  const cap = 52
  const cw = 3.2
  const ch = 3.2
  const gap = 1.1
  const perCell = total > cap ? Math.ceil(total / cap) : 1
  const draw = Math.min(total, cap)
  const shapes: VisualShape[] = []
  let idx = 0
  for (let i = 0; i < draw; i++) {
    const c = Math.floor(idx / rows)
    const row = idx % rows
    const x = c * (cw + gap)
    const y = row * (ch + gap)
    let fill: CellFill = 'cell'
    const done = (i + 1) * perCell
    if (done <= passed) fill = 'ok'
    else if (failed && done <= passed + failed) fill = 'bad'
    shapes.push({ kind: 'rect', x, y, w: cw, h: ch, fill, rx: 1.3 })
    idx++
    if (c >= cols) break
  }
  return shapes
}

function cellsBranch(v: Extract<Visual, { type: 'branch' }>): VisualShape[] {
  const commits = Math.min(Math.max(int0(v.commits ?? 2), 1), 3)
  const shapes: VisualShape[] = [
    { kind: 'line', x1: 6, y1: 23, x2: 46, y2: 23, stroke: 'muted', strokeWidth: 1.2 },
    { kind: 'circle', cx: 6, cy: 23, r: 3, fill: 'cell' },
  ]
  const xs = [18, 28, 38].slice(0, commits)
  xs.forEach(x => {
    shapes.push({ kind: 'circle', cx: x, cy: 10, r: 3, fill: 'info' })
  })
  shapes.push({
    kind: 'path',
    d: `M 6 23 Q 16 8 28 10 T 46 23`,
    stroke: 'info',
    strokeWidth: 1.2,
    fill: 'cell',
  })
  if (v.state === 'merged') {
    shapes.push({ kind: 'circle', cx: 46, cy: 23, r: 4.6, fill: 'info' })
  } else {
    shapes.push({ kind: 'circle', cx: 46, cy: 23, r: 4, stroke: 'muted', strokeWidth: 1.2 })
    shapes.push({ kind: 'line', x1: 46, y1: 23, x2: 52, y2: 23, stroke: 'muted', strokeWidth: 1, dash: '2 2' })
  }
  return shapes
}

function cellsPipeline(v: Extract<Visual, { type: 'pipeline' }>): VisualShape[] {
  const steps = normalizeSteps(v.steps)
  const xs = [4, 16, 28, 40, 52].slice(0, steps.length)
  const shapes: VisualShape[] = []
  steps.forEach((step, i) => {
    const x = xs[i] ?? 4 + i * 12
    if (step === 'done') shapes.push({ kind: 'circle', cx: x, cy: 16, r: 3.5, fill: 'ok' })
    else if (step === 'pending') shapes.push({ kind: 'circle', cx: x, cy: 16, r: 3, stroke: 'muted', strokeWidth: 1.25 })
    else if (step === 'active') {
      shapes.push({ kind: 'circle', cx: x, cy: 16, r: 4.5, stroke: 'info', strokeWidth: 1.5 })
      shapes.push({ kind: 'path', d: `M ${x - 3} 16 A 3 3 0 0 1 ${x + 3} 16`, stroke: 'info', strokeWidth: 1.2, fill: 'cell' })
    } else if (step === 'failed') {
      shapes.push({ kind: 'circle', cx: x, cy: 16, r: 5.5, fill: 'bad' })
      shapes.push({ kind: 'text', x: x - 2.5, y: 18.5, text: '×', fill: 'on-bad', size: 8 })
    } else if (step === 'final') {
      shapes.push({ kind: 'circle', cx: x, cy: 16, r: 6, fill: 'ok' })
      shapes.push({ kind: 'text', x: x - 2.5, y: 18.5, text: '✓', fill: 'on-ok', size: 8 })
    }
    if (i < steps.length - 1) {
      const n = steps[i + 1]
      const okLink = (step === 'done' && (n === 'done' || n === 'active' || n === 'final')) || (step === 'active')
      shapes.push({
        kind: 'line',
        x1: x + 4,
        y1: 16,
        x2: (xs[i + 1] ?? x + 12) - 4,
        y2: 16,
        stroke: okLink ? 'ok' : 'muted',
        strokeWidth: 1,
      })
    }
  })
  return shapes
}

function cellsBars(v: Extract<Visual, { type: 'bars' }>): VisualShape[] {
  const vals = normalizeBars(v.values)
  const max = Math.max(...vals, 1)
  const shapes: VisualShape[] = []
  const bw = 5
  const gap = 3
  const floor = 27
  vals.forEach((val, i) => {
    const h = Math.max(3, (22 * val) / max)
    const x = i * (bw + gap)
    const median = vals.slice(0, -1).sort((a, b) => a - b)[Math.floor(Math.max(vals.length - 2, 0) / 2)] ?? val
    const fill: CellFill = i === vals.length - 1 ? (val <= median ? 'ok' : 'bad') : 'ink'
    shapes.push({ kind: 'rect', x, y: floor - h, w: bw, h, fill, rx: 1.2 })
  })
  return shapes
}

function cellsContext(v: Extract<Visual, { type: 'context' }>): VisualShape[] {
  const total = Math.max(int0(v.total), 1)
  const used = int0(v.used)
  const after = int0(v.after ?? used)
  const cols = 9
  const rows = 3
  const cw = 5
  const ch = 5
  const gap = 1.375
  const shapes: VisualShape[] = []
  const cells = 27
  let warnCells = 0
  let infoCells = 0
  if (v.phase === 'compacting') {
    const p = Math.min(Math.max(v.progress ?? 0, 0), 1)
    warnCells = Math.round(used * (1 - p))
    infoCells = Math.round(after * p)
  } else if (v.phase === 'done') {
    infoCells = Math.round((cells * after) / total)
  } else {
    warnCells = Math.round((cells * used) / total)
  }
  let wi = 0
  let ii = 0
  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < rows; row++) {
      const x = c * (cw + gap)
      const y = row * (ch + gap)
      let fill: CellFill = 'cell'
      if (v.phase === 'compacting') {
        if (ii < infoCells) {
          fill = 'info'
          ii++
        } else if (wi < warnCells) {
          fill = 'warn'
          wi++
        }
      } else if (v.phase === 'done') {
        fill = ii < infoCells ? 'info' : 'cell'
        if (fill === 'info') ii++
      } else {
        fill = wi < warnCells ? 'warn' : 'cell'
        if (fill === 'warn') wi++
      }
      shapes.push({ kind: 'rect', x, y, w: cw, h: ch, fill, rx: 1.4 })
    }
  }
  return shapes
}