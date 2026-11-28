/** Static frames for state gallery — one full card each (~600px). */

export const GALLERY_STATES = [
  {
    id: 'empty',
    title: 'Empty',
    code: '<MarginAgentRouter state="empty" :motion="false" :autoplay="false" />',
  },
  {
    id: 'loading',
    title: 'Loading',
    code: '<MarginAgentRouter state="loading" :motion="false" :autoplay="false" />',
  },
  {
    id: 'error',
    title: 'Error',
    code: '<MarginAgentRouter state="error" :motion="false" :autoplay="false" />',
  },
  {
    id: 'routing',
    title: 'Routing',
    code: '<MarginAgentRouter state="routing" :motion="false" :autoplay="false" />',
  },
  {
    id: 'routed',
    title: 'Routed to Billing',
    code: '<MarginAgentRouter state="routed" target="billing" :motion="false" :autoplay="false" />',
  },
  {
    id: 'escalated',
    title: 'Escalated to human',
    code: '<MarginAgentRouter state="escalated" :motion="false" :autoplay="false" />',
  },
]

export function routerStatePreset(state, { target = 'billing' } = {}) {
  const base = {
    empty: {
      mode: 'empty',
      intake: null,
      phase: 'idle',
      target: null,
      routedCount: 0,
      queues: { billing: [], tech: [], sales: [], human: [] },
      loads: { billing: 0, tech: 0, sales: 0 },
      error: null,
    },
    loading: {
      mode: 'loading',
      intake: null,
      phase: 'loading',
      target: null,
      routedCount: 0,
      queues: null,
      loads: null,
      error: null,
    },
    error: {
      mode: 'error',
      intake: {
        subject: 'Refund for order #4821',
        source: 'maria@northwind.io · email',
        status: 'error',
      },
      phase: 'error',
      target: null,
      routedCount: 8,
      queues: {
        billing: [{ title: 'Invoice #8801 mismatch' }],
        tech: [],
        sales: [],
        human: [],
      },
      loads: { billing: 0.45, tech: 0.2, sales: 0.15 },
      error: 'Router model unreachable. Retrying in 12s…',
    },
    routing: {
      mode: 'live',
      intake: {
        subject: 'API returns 502 after deploy',
        source: '#incidents · slack',
        status: 'routing',
      },
      phase: 'routing',
      target: 'tech',
      classification: 'Incident',
      confidence: 0.62,
      routedCount: 11,
      queues: {
        billing: [{ title: 'Invoice #8801 mismatch' }],
        tech: [{ title: 'SSO redirect loop' }],
        sales: [{ title: 'Pilot extension' }],
        human: [],
      },
      loads: { billing: 0.42, tech: 0.71, sales: 0.28 },
      error: null,
    },
    routed: {
      mode: 'live',
      intake: {
        subject: 'Refund for order #4821',
        source: 'maria@northwind.io · email',
        status: 'routed',
      },
      phase: 'routed',
      target,
      classification: 'Billing dispute',
      confidence: 0.94,
      routedCount: 12,
      queues: {
        billing: [
          { title: 'Refund for order #4821', fresh: true },
          { title: 'Invoice #8801 mismatch' },
        ],
        tech: [{ title: 'SSO redirect loop' }],
        sales: [{ title: 'Pilot extension' }],
        human: [],
      },
      loads: { billing: 0.58, tech: 0.33, sales: 0.19 },
      error: null,
    },
    escalated: {
      mode: 'live',
      intake: {
        subject: 'Legal hold on customer data',
        source: 'compliance@acme.io · ticket',
        status: 'escalated',
      },
      phase: 'escalated',
      target: 'human',
      classification: 'Uncertain',
      confidence: 0.41,
      routedCount: 12,
      queues: {
        billing: [{ title: 'Invoice #8801 mismatch' }],
        tech: [{ title: 'SSO redirect loop' }],
        sales: [{ title: 'Pilot extension' }],
        human: [{ title: 'Legal hold on customer data', fresh: true }],
      },
      loads: { billing: 0.4, tech: 0.35, sales: 0.22 },
      error: null,
    },
  }
  return base[state] || base.empty
}