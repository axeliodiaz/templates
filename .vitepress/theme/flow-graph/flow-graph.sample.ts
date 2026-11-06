import type { FlowGraphConfig, FlowGroup, FlowNode, CallRecord, AgentStatus, ToolStatus } from './flow-graph.types'

const tools = [
  ['github', 'GitHub'], ['terminal', 'Terminal'], ['stripe', 'Stripe'], ['figma', 'Figma'], ['database', 'Database'],
  ['web', 'Web search'], ['notion', 'Notion'], ['slack', 'Slack'], ['hubspot', 'HubSpot'],
] as const
const terminalCalls: CallRecord[] = [
  { id: 't2', label: 'cmd: "npm test -- checkout"', startedAt: '3:15', durationMs: 10000, status: 'failed', input: { cmd: 'npm test -- checkout' }, output: { passed: 13, failed: 1, error: 'checkout.spec.ts:42 timeout' } },
  { id: 't1', label: 'cmd: "npm test -- checkout"', startedAt: '2:54', durationMs: 21000, status: 'ok', input: { cmd: 'npm test -- checkout' }, output: { passed: 14, failed: 0 } },
]
const examples: Record<string, { label: string; input: unknown; output: unknown }> = {
  stripe: { label: 'Crear precio del plan', input: { action: 'create_price', amount: 1900, currency: 'usd' }, output: { id: 'price_123', active: true } },
  figma: { label: 'Leer diseño de precios', input: { file: 'pricing', node: 'plans' }, output: { frames: 3, currency: 'usd' } },
  database: { label: 'Consultar datos del proyecto', input: { table: 'reviews', limit: 120 }, output: { rows: 120, topic: 'precio' } },
  web: { label: 'Buscar precios de competidores', input: { query: 'planes y precios de competidores' }, output: { results: 5 } },
  notion: { label: 'Guardar resumen', input: { page: 'pricing', text: 'Resumen de planes' }, output: { saved: true } },
  slack: { label: 'Compartir propuesta', input: { channel: 'equipo', text: 'Copy de los tres planes' }, output: { sent: true } },
  hubspot: { label: 'Leer comentarios de clientes', input: { filter: 'pricing', limit: 120 }, output: { contacts: 120 } },
}
type ToolState = readonly [ToolStatus, number?, number?]
function group(id: string, label: string, status: AgentStatus, model: string, description: string, states: ToolState[]): FlowGroup {
  const nodes: FlowNode[] = tools.map(([toolId, toolLabel], index) => ({
    id: toolId, kind: index < 5 ? 'source' : 'target', label: toolLabel, icon: toolId,
    ...(toolId === 'terminal' ? { sublabel: 'Shell de sandbox' } : {}), status: states[index][0],
    calls: states[index][1] ?? 0, ...(states[index][2] === undefined ? {} : { lastCallMs: states[index][2] }),
    order: index < 5 ? index : index - 5,
  }))
  nodes.splice(5, 0, { id: `agent-${id}`, kind: 'agent', label, icon: 'agent', status, sublabel: model, description })
  const details: NonNullable<FlowGroup['details']> = {}
  for (const node of nodes) {
    if (node.kind === 'agent' || !node.calls) continue
    const example = examples[node.id]
    const calls: CallRecord[] = id === 'coder' && node.id === 'terminal' ? terminalCalls.map(call => ({ ...call })) :
      Array.from({ length: node.calls }, (_, index) => ({ id: `${id}-${node.id}-${node.calls! - index}`, label: example.label,
        startedAt: `3:${String(15 - index).padStart(2, '0')}`, durationMs: node.lastCallMs, status: 'ok', input: example.input, output: example.output }))
    details[node.id] = { nodeId: node.id, title: node.label, sublabel: node.sublabel, calls }
  }
  return { id, label, nodes, details }
}
export const sample: FlowGraphConfig = {
  defaultGroupId: 'coder', legend: true,
  groups: [
    group('researcher', 'Researcher', 'running', 'claude-3.5-sonnet', 'Comparar precios de 5 competidores', [
      ['idle'], ['no-access'], ['no-access'], ['no-access'], ['active', 1, 340], ['active', 2, 880], ['active', 1, 450], ['idle'], ['no-access'],
    ]),
    group('coder', 'Coder', 'running', 'GPT-4 So1', 'Construir la página de precios y conectar el checkout', [
      ['no-access'], ['failed', 2], ['active', 1, 730], ['active', 1, 1200], ['active', 1, 280], ['idle'], ['active', 1, 610], ['no-access'], ['no-access'],
    ]),
    group('writer', 'Writer', 'needs-you', 'sonnet 3.5', 'Escribir el copy de los tres planes', [
      ['no-access'], ['no-access'], ['no-access'], ['idle'], ['no-access'], ['idle'], ['active', 1, 540], ['active', 1, 390], ['no-access'],
    ]),
    group('analyst', 'Analyst', 'running', 'Gemini 1.5 Pro', 'Resumir 120 reseñas de G2 que mencionan precio', [
      ['no-access'], ['no-access'], ['no-access'], ['no-access'], ['active', 3, 210], ['active', 1, 950], ['idle'], ['no-access'], ['active', 1, 470],
    ]),
  ],
}
