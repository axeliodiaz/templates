export const ORCHESTRATION_SCHEMA = [
  { field: 'type', role: 'Discriminator `orchestration`.' },
  { field: 'run', role: 'Run tree: nodes, edges, usage, events, capabilities.' },
  { field: 'labels', role: 'Status copy for a11y and UI.' },
]
export const CREW_SCHEMA = [
  { field: 'type', role: 'Discriminator `crew`.' },
  { field: 'projects', role: 'Agent trees (id, children, tools, tokens, cost).' },
  { field: 'handoffs', role: 'Connector geometry between agents.' },
  { field: 'stepCount', role: 'Autoplay step count for demo script.' },
]
export const TICKET_SCHEMA = [
  { field: 'type', role: 'Discriminator `ticket`.' },
  { field: 'ticket', role: 'Payment row: amount, status, method, reference.' },
  { field: 'autoExplore', role: 'Guided tour script (ms + action).' },
]
export const TOAST_SCHEMA = [
  { field: 'type', role: 'Discriminator `toast`.' },
  { field: 'samples', role: 'Named toast payloads (tone, title, visual, actions).' },
  { field: 'sequence', role: 'Reference play-order ids for the demo.' },
]
export const EMAIL_SCHEMA = [
  { field: 'type', role: 'Discriminator `email`.' },
  { field: 'messages', role: 'Transactional templates (subject, body, CTA).' },
  { field: 'defaultId', role: 'Initial selected message id.' },
]
export const ROUTER_SCHEMA = [
  { field: 'type', role: 'Discriminator `router`.' },
  { field: 'queues', role: 'Target queues (billing, tech, sales, human).' },
  { field: 'scenarios', role: 'Intake items with classification + confidence.' },
  { field: 'seedQueueItems', role: 'Backlog samples per queue.' },
]
export const GIT_GRAPH_SCHEMA = [
  { field: 'type', role: 'Discriminator `git-graph`.' },
  { field: 'meta', role: 'Branch and target ref labels.' },
  { field: 'commits', role: 'Initial and squashed commit rows.' },
  { field: 'checks', role: 'CI check definitions for PR footer.' },
  { field: 'galleryStates', role: 'Static reference-frame ids.' },
]
export const PRL_SCHEMA = [
  { field: 'type', role: 'Discriminator `lifecycle`.' },
  { field: 'phases', role: 'Track nodes, lanes, loops, panels — see PR lifecycle doc.' },
]