/** Fictitious routing scenarios for Margin Agent Router demos. */

export const ROUTER_MODEL = 'Claude Haiku 4.5'

export const QUEUES = [
  {
    id: 'billing',
    name: 'Billing',
    model: 'Claude Sonnet 4',
    color: '#6389ea',
    soft: '#eceef5',
  },
  {
    id: 'tech',
    name: 'Tech support',
    model: 'Claude Sonnet 4',
    color: '#6e58d8',
    soft: '#eee8fc',
  },
  {
    id: 'sales',
    name: 'Sales',
    model: 'Claude Sonnet 4',
    color: '#22a06b',
    soft: '#e6f5ed',
  },
]

export const HUMAN_AGENT = {
  id: 'human',
  name: 'Support lead',
  model: 'Human',
  human: true,
}

export const SCENARIOS = [
  {
    id: 's1',
    subject: 'Refund for order #4821',
    source: 'maria@northwind.io · email',
    channel: 'email',
    preview: 'I was charged twice for the same shipment…',
    classification: 'Billing dispute',
    confidence: 0.94,
    target: 'billing',
    tags: ['double charge'],
  },
  {
    id: 's2',
    subject: 'API returns 502 after deploy',
    source: '#incidents · slack',
    channel: 'slack',
    preview: 'Staging webhook started failing 20 minutes ago…',
    classification: 'Incident',
    confidence: 0.88,
    target: 'tech',
    tags: ['p1'],
  },
  {
    id: 's3',
    subject: 'Enterprise pricing for 120 seats',
    source: 'Leo Park · chat',
    channel: 'chat',
    preview: 'We need SSO and a dedicated success manager…',
    classification: 'Sales qualified',
    confidence: 0.91,
    target: 'sales',
    tags: ['enterprise'],
  },
  {
    id: 's4',
    subject: 'Legal hold on customer data',
    source: 'compliance@acme.io · ticket',
    channel: 'ticket',
    preview: 'Unclear jurisdiction — needs human review…',
    classification: 'Uncertain',
    confidence: 0.41,
    target: 'human',
    escalate: true,
    tags: ['compliance'],
  },
]

export const SEED_QUEUE_ITEMS = {
  billing: [
    { id: 'b1', title: 'Invoice #8801 mismatch', from: 'ops@vertex.io' },
    { id: 'b2', title: 'VAT line on credit memo', from: 'finance@lumen.co' },
  ],
  tech: [{ id: 't1', title: 'SSO redirect loop', from: 'admin@hatch.dev' }],
  sales: [{ id: 's0', title: 'Pilot extension', from: 'Maya Chen' }],
  human: [],
}