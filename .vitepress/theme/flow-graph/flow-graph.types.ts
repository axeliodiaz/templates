export type NodeKind = 'source' | 'agent' | 'target'
export type ToolStatus = 'active' | 'idle' | 'no-access' | 'failed' | 'running'
export type AgentStatus = 'running' | 'needs-you' | 'failed' | 'idle'
export type NodeStatus = ToolStatus | AgentStatus   // 'active'|'idle'|'no-access'|'failed'|'running'|'needs-you'
export type EdgeStatus = 'running' | 'needs-you' | 'failed' | 'idle'

export interface FlowNode {
  id: string                 // estable ENTRE grupos: es la clave del layout compartido
  kind: NodeKind
  label: string              // 'Terminal'
  sublabel?: string          // tool: 'Shell de sandbox'; agente: modelo, p. ej. 'GPT-4 So1'
  description?: string       // solo agente: tarea multilínea (máx. 3 líneas visibles)
  icon?: string              // clave del set de íconos (RelayIcon + extras); si falta → inicial (§9)
  status: NodeStatus         // tool: ToolStatus; agente: AgentStatus
  calls?: number             // default 0
  lastCallMs?: number        // ms de la última llamada; se formatea (§2.2)
  column?: 0 | 1 | 2         // default por kind: source=0, agent=1, target=2
  order?: number             // orden vertical dentro de la columna; default = índice en el array
}

export interface FlowEdge {
  from: string               // id del nodo
  to: string
  status?: EdgeStatus        // default: §2.2
  animated?: boolean         // default: §2.2
}

export interface CallRecord {
  id: string
  label: string              // 'cmd: "npm test -- checkout"'
  startedAt: string          // texto visible: '3:15'
  durationMs?: number        // undefined mientras status === 'running'
  status: 'ok' | 'failed' | 'running'
  input: unknown             // serializable como JSON
  output?: unknown
}

export interface NodeDetail {
  nodeId: string
  title?: string             // default: label del nodo
  sublabel?: string          // 'Shell de sandbox'
  calls: CallRecord[]        // más nueva primero
}

export interface FlowGroup {
  id: string                 // 'coder'
  label: string              // tab: 'Coder'
  nodes: FlowNode[]          // exactamente 1 con kind 'agent'
  edges?: FlowEdge[]         // si se omite, se derivan (§2.2)
  details?: Record<string, NodeDetail>   // por nodeId
}

export interface FlowGraphLabels {   // todo sobrescribible; defaults en español
  title: string              // 'Acceso a herramientas'
  tabsAria: string           // 'Agentes'
  sources: string            // 'Entradas'
  targets: string            // 'Salidas'
  noAccess: string           // 'Sin acceso'
  idle: string               // 'Sin usar aún'
  lastCall: (ms: string) => string        // ms => `Última llamada ${ms}`
  failed: string             // 'Falló'
  running: string            // 'En curso'
  needsYou: string           // 'Te necesita'
  agentIdle: string          // 'En pausa'
  calls: (n: number) => string            // n => n === 1 ? '1 llamada' : `${n} llamadas`
  tools: (a: number, t: number) => string // `${a}/${t} herramientas`
  back: string               // 'Volver'
  replay: string             // 'Repetir'
  editInput: string          // 'Editar entrada'
  input: string              // 'Entrada'
  output: string             // 'Salida'
  more: (n: number) => string             // n => `+${n} más`
  less: string               // 'Mostrar menos'
  uses: (agent: string, list: string) => string     // `${agent} usa: ${list}.`
  sendsTo: (agent: string, list: string) => string  // `${agent} envía a: ${list}.`
  noAccessList: (list: string) => string            // `Sin acceso: ${list}.`
  none: string               // 'ninguna'
}

export interface FlowGraphConfig {
  groups: FlowGroup[]
  defaultGroupId?: string    // default: groups[0].id
  labels?: Partial<FlowGraphLabels>
  maxPerColumn?: number      // default 6 → colapsa con '+N más' (§9)
  maxAnimatedEdges?: number  // default 12 (§6.11)
  legend?: boolean           // default false
}

export const DEFAULT_LABELS: FlowGraphLabels = {
  title: 'Acceso a herramientas', tabsAria: 'Agentes', sources: 'Entradas', targets: 'Salidas',
  noAccess: 'Sin acceso', idle: 'Sin usar aún', lastCall: ms => `Última llamada ${ms}`,
  failed: 'Falló', running: 'En curso', needsYou: 'Te necesita', agentIdle: 'En pausa',
  calls: n => n === 1 ? '1 llamada' : `${n} llamadas`, tools: (a, t) => `${a}/${t} herramientas`,
  back: 'Volver', replay: 'Repetir', editInput: 'Editar entrada', input: 'Entrada', output: 'Salida',
  more: n => `+${n} más`, less: 'Mostrar menos', uses: (agent, list) => `${agent} usa: ${list}.`,
  sendsTo: (agent, list) => `${agent} envía a: ${list}.`, noAccessList: list => `Sin acceso: ${list}.`, none: 'ninguna',
}
