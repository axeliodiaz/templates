export type CrewStatus = 'working' | 'idle' | 'paused' | 'needs_you' | 'done' | 'failed'
export type CrewHue = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6'
/** Icon catalog awaits the UI source. No guessed catalog or runtime lookup. */
export type IconName = string
export interface CrewTool { id: string; name: string; icon: IconName }
export interface CrewAgent {
  id: string
  name: string
  model: string | null
  hue: CrewHue
  icon?: IconName
  status: CrewStatus
  activity: string
  context: { used: number | null; limit: number | null }
  tools: CrewTool[]
  last?: { from: string; text: string } | null
  task?: string | null
  startedAt?: string | null
  endedAt?: string | null
  cost?: number | null
  tokens?: { input: number | null; output: number | null } | null
  children?: CrewAgent[]
}
export interface CrewProject { id: string; name: string; root: CrewAgent }
export interface CrewHandoff { id: string; from: string; to: string; label?: string }
export type SteerAction = 'message' | 'pause' | 'resume' | 'stop' | 'approve' | 'decline' | 'retry'
export type Ack = { state: 'ack' | 'error'; message: string }

const statuses = new Set<CrewStatus>(['working', 'idle', 'paused', 'needs_you', 'done', 'failed'])
const hues = new Set<CrewHue>(['c1', 'c2', 'c3', 'c4', 'c5', 'c6'])
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
function nullableNumber(value: unknown): boolean { return value === null || typeof value === 'number' }

/** Pure, non-mutating validation. Tree identity is scoped to one project's root. */
export function validate(root: unknown): string[] {
  const errors: string[] = []
  const ids = new Set<string>()
  const active = new Set<object>()
  const expanded = new Set<object>()
  const stack: Array<{ value: unknown; exit?: boolean }> = [{ value: root }]
  while (stack.length) {
    const { value, exit } = stack.pop()!
    if (!record(value)) { errors.push('Invalid crew data: agent must be an object'); continue }
    if (exit) { active.delete(value); continue }
    if (active.has(value)) { errors.push('Invalid crew data: hierarchy cycle'); continue }
    if (typeof value.id !== 'string' || !value.id.trim()) errors.push('Invalid crew data: agent id is required')
    else if (ids.has(value.id)) errors.push(`Invalid crew data: duplicate id "${value.id}"`)
    else ids.add(value.id)
    if (expanded.has(value)) continue
    expanded.add(value)
    for (const key of ['name', 'activity']) {
      if (typeof value[key] !== 'string') errors.push(`Invalid crew data: ${key} must be a string`)
    }
    if (value.model !== null && typeof value.model !== 'string') errors.push('Invalid crew data: model must be a string or null')
    if (!statuses.has(value.status as CrewStatus)) errors.push('Invalid crew data: unknown status')
    if (!hues.has(value.hue as CrewHue)) errors.push('Invalid crew data: unknown hue')
    if (!record(value.context) || !nullableNumber(value.context.used) || !nullableNumber(value.context.limit)) errors.push('Invalid crew data: context values must be numbers or null')
    if (!Array.isArray(value.tools) || value.tools.some(tool => !record(tool) || ['id', 'name', 'icon'].some(key => typeof tool[key] !== 'string'))) errors.push('Invalid crew data: tools must contain id, name and icon')
    if (value.children !== undefined && !Array.isArray(value.children)) errors.push('Invalid crew data: children must be an array')
    active.add(value)
    stack.push({ value, exit: true })
    if (Array.isArray(value.children)) for (let i = value.children.length - 1; i >= 0; i--) stack.push({ value: value.children[i] })
  }
  return errors
}

/** Reject invalid trees, then flatten in source/keyboard order. Does not fill unknown values. */
export function normalize(root: CrewAgent): CrewAgent[] {
  const errors = validate(root)
  if (errors.length) throw new Error(errors[0])
  const result: CrewAgent[] = []
  const stack = [root]
  while (stack.length) {
    const node = stack.pop()!
    result.push(node)
    if (node.children) for (let i = node.children.length - 1; i >= 0; i--) stack.push(node.children[i])
  }
  return result
}

export function counts(root: CrewAgent): { working: number; needsYou: number; agents: number } {
  const nodes = normalize(root)
  return { working: nodes.filter(node => node.status === 'working').length, needsYou: nodes.filter(node => node.status === 'needs_you').length, agents: nodes.length }
}

export function contextLevel(context: CrewAgent['context']): { ratio: number | null; level: 'work' | 'late' | 'over' | null } {
  if (context.used === null || context.limit === null || !Number.isFinite(context.used) || !Number.isFinite(context.limit) || context.limit <= 0) return { ratio: null, level: null }
  const ratio = Math.max(0, Math.min(context.used / context.limit, 1))
  return { ratio, level: ratio >= 0.95 ? 'over' : ratio >= 0.8 ? 'late' : 'work' }
}
function tokenCount(value: number): string { return value >= 1000 ? `${Math.floor(value / 1000)}k` : String(value) }
export function formatContext(context: CrewAgent['context']): string {
  if (contextLevel(context).ratio === null) return 'n/a'
  return `${tokenCount(Math.max(0, context.used!))} / ${tokenCount(context.limit!)}`
}
export function formatCost(cost: number | null | undefined): string | null {
  if (cost == null) return 'n/a'
  if (!Number.isFinite(cost) || cost < 0) return null
  if (cost > 0 && cost < 0.005) return '<$0.01'
  return `$${cost.toFixed(2)}`
}
export function formatTokens(value: number | null | undefined): string {
  return value == null || !Number.isFinite(value) || value < 0 ? 'n/a' : tokenCount(value)
}

/** Working time advances with now; nonworking time needs a recorded end, never a guessed end. */
export function formatDuration(agent: Pick<CrewAgent, 'status' | 'startedAt' | 'endedAt'>, now: number): string {
  const start = agent.startedAt ? Date.parse(agent.startedAt) : NaN
  const end = agent.status === 'working' ? now : agent.endedAt ? Date.parse(agent.endedAt) : NaN
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 'n/a'
  const seconds = Math.floor(Math.max(0, end - start) / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ${String(minutes % 60).padStart(2, '0')}m`
  return `${Math.floor(hours / 24)}d ${hours % 24}h`
}

/** Ordered node ids from source up through the common ancestor, then down to target. */
export function handoffPath(root: CrewAgent, from: string, to: string): string[] {
  const nodes = normalize(root)
  const parents = new Map<string, string | null>([[root.id, null]])
  for (const node of nodes) for (const child of node.children ?? []) parents.set(child.id, node.id)
  if (!parents.has(from) || !parents.has(to)) return []
  const ancestors = (id: string): string[] => {
    const path: string[] = []
    let cursor: string | null = id
    while (cursor !== null) { path.push(cursor); cursor = parents.get(cursor) ?? null }
    return path
  }
  const source = ancestors(from), target = ancestors(to), targetSet = new Set(target)
  const common = source.find(id => targetSet.has(id))!
  return [...source.slice(0, source.indexOf(common) + 1), ...target.slice(0, target.indexOf(common)).reverse()]
}
