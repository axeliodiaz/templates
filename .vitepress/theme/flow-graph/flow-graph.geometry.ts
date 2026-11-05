import { DEFAULT_LABELS } from './flow-graph.types'
import type { FlowNode, FlowEdge, FlowGroup, FlowGraphConfig, FlowGraphLabels, EdgeStatus } from './flow-graph.types'

export interface Pt { x: number; y: number }
export interface Rect { left: number; right: number; top: number; height: number }
export const hasAccess = (node: FlowNode): boolean => node.status !== 'no-access'
export const headerStats = (group: FlowGroup) => {
  const tools = group.nodes.filter(node => node.kind !== 'agent')
  return { access: tools.filter(hasAccess).length, total: tools.length, calls: tools.reduce((sum, node) => sum + (node.calls ?? 0), 0) }
}
export function edgeDefaults(edge: FlowEdge, group: FlowGroup): Required<FlowEdge> {
  const agent = group.nodes.find(node => node.kind === 'agent')
  const tool = group.nodes.find(node => node.kind !== 'agent' && (node.id === edge.from || node.id === edge.to))
  const status = edge.status ?? (tool?.status === 'failed' ? 'failed' : agent?.status ?? 'idle') as EdgeStatus
  const traffic = agent?.status === 'running' && !!tool && ['active', 'running'].includes(tool.status)
  return { ...edge, status, animated: status === 'running' && traffic && (edge.animated ?? true) }
}
export function deriveEdges(group: FlowGroup): Required<FlowEdge>[] {
  const agent = group.nodes.find(node => node.kind === 'agent')
  if (!agent) return []
  const edges = group.edges ?? group.nodes.filter(node => node.kind !== 'agent' && hasAccess(node)).map(node =>
    node.kind === 'source' ? { from: node.id, to: agent.id } : { from: agent.id, to: node.id })
  return edges.filter(edge => {
    const from = group.nodes.find(node => node.id === edge.from), to = group.nodes.find(node => node.id === edge.to)
    const allowed = !!from && !!to && hasAccess(from) && hasAccess(to)
    if (!allowed && import.meta.env?.DEV) console.warn(`[FlowGraph] Discarded inaccessible or invalid edge ${edge.from}->${edge.to}`)
    return allowed
  }).map(edge => edgeDefaults(edge, group))
}
export const formatMs = (ms: number): string => ms < 1000 ? `${ms} ms` : `${(ms / 1000).toLocaleString('es-CL', { maximumFractionDigits: 1 })} s`
export function sortColumn(nodes: FlowNode[], collapsed = false): FlowNode[] {
  return nodes.map((node, index) => ({ node, index })).sort((a, b) =>
    (collapsed ? Number(hasAccess(b.node)) - Number(hasAccess(a.node)) : 0) ||
    (a.node.order ?? a.index) - (b.node.order ?? b.index) || a.index - b.index).map(item => item.node)
}
export function relationSentence(group: FlowGroup, overrides: Partial<FlowGraphLabels> = {}): string {
  const labels = { ...DEFAULT_LABELS, ...overrides }, agent = group.nodes.find(node => node.kind === 'agent')
  if (!agent) return ''
  const tools = group.nodes.filter(node => node.kind !== 'agent')
  if (tools.length && !tools.some(hasAccess)) return `${agent.label} no tiene acceso a ninguna herramienta.`
  const list = (nodes: FlowNode[]) => nodes.map(node => node.label).join(', ') || labels.none
  return [labels.uses(agent.label, list(sortColumn(tools.filter(node => node.kind === 'source' && hasAccess(node))))),
    labels.sendsTo(agent.label, list(sortColumn(tools.filter(node => node.kind === 'target' && hasAccess(node))))),
    labels.noAccessList(list(tools.filter(node => !hasAccess(node))))].join(' ')
}
/** Return errors instead of throwing so a bad group can render its fallback. */
export function validateConfig(config: FlowGraphConfig): string[] {
  const errors: string[] = []
  for (const group of config.groups) {
    if (group.nodes.filter(node => node.kind === 'agent').length !== 1) errors.push(`${group.id}: expected exactly one agent`)
    const ids = new Set<string>()
    for (const node of group.nodes) {
      if (ids.has(node.id)) errors.push(`${group.id}: duplicate node id ${node.id}`)
      ids.add(node.id)
    }
    for (const edge of group.edges ?? []) if (!ids.has(edge.from) || !ids.has(edge.to)) errors.push(`${group.id}: unknown edge endpoint ${edge.from}->${edge.to}`)
  }
  return errors
}
export const anchorOut = (r: Rect): Pt => ({ x: r.right, y: r.top + r.height / 2 })
export const anchorIn = (r: Rect): Pt => ({ x: r.left, y: r.top + r.height / 2 })
export function bezier(p1: Pt, p2: Pt): string {
  const dx = p2.x - p1.x, f = (n: number) => n.toFixed(1)
  return `M ${f(p1.x)} ${f(p1.y)} C ${f(p1.x + dx * .5)} ${f(p1.y)}, ${f(p2.x - dx * .5)} ${f(p2.y)}, ${f(p2.x)} ${f(p2.y)}`
}
