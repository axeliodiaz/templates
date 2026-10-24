import type { Decision } from './decision-tree'

/** Fictitious queue used by the Felix docs. Safe to copy into another app. */
export const sampleDecisions: Decision[] = [
  {
    id: 'checkout',
    risk: 'high',
    agent: { name: 'Incident agent', model: 'Opus 5.5' },
    question: 'Checkout errors jumped to 18% after deploy #482 — what should I do?',
    context: '2,140 errors in 12 minutes · about $3.2k in orders an hour at risk.',
    columnLabel: 'What should I do?',
    options: [
      {
        id: 'rollback',
        title: 'Roll back to #481',
        agentPick: true,
        columnLabel: 'Tell customers about it?',
        children: [
          { id: 'status', title: 'Post a status note', agentPick: true },
          { id: 'email', title: 'Email checkout owners' },
          { id: 'quiet', title: 'Stay quiet', warning: 'Support volume may spike' },
        ],
      },
      {
        id: 'hotfix',
        title: 'Ship a hotfix',
        columnLabel: 'Wait for the test run?',
        children: [
          { id: 'wait', title: 'Wait for green', agentPick: true },
          { id: 'ship', title: 'Ship now', warning: 'Skips the canary' },
        ],
      },
      {
        id: 'page',
        title: 'Page the on-call',
        columnLabel: 'What should I send along?',
        children: [
          { id: 'trace', title: 'Error sample and trace', agentPick: true },
          { id: 'diff', title: 'Deploy diff only' },
        ],
      },
      { id: 'other-checkout', title: 'Other…', other: true },
    ],
  },
  {
    id: 'renewal',
    risk: 'medium',
    agent: { name: 'Sales agent', model: 'Opus 5.5' },
    question: 'Acme wants 25% off their $84k renewal or they will switch — how should I respond?',
    context: 'Renewal closes Friday · Acme is 11% of quarterly revenue.',
    columnLabel: 'How should I respond?',
    options: [
      {
        id: 'hold',
        title: 'Hold at 15%',
        agentPick: true,
        columnLabel: 'What should I offer instead?',
        children: [
          { id: 'csm', title: 'Add a success manager', agentPick: true },
          { id: 'term', title: 'Extend the term 2 years' },
        ],
      },
      {
        id: 'accept',
        title: 'Accept 25%',
        warning: 'Above the usual band',
        note: {
          body: 'Finance set a 45% floor for any discount above 20%.',
          source: 'Finance · discount policy',
        },
        columnLabel: 'How do we protect margin?',
        children: [
          { id: 'prepay', title: 'Require annual prepay', agentPick: true },
          { id: 'tier', title: 'Drop the support tier', warning: 'Margin drops to 41%' },
        ],
      },
      { id: 'escalate', title: 'Escalate to finance' },
      { id: 'other-sales', title: 'Other…', other: true },
    ],
  },
  {
    id: 'spend',
    risk: 'high',
    agent: { name: 'Infra agent', model: 'Opus 5.5' },
    question: 'AWS spend jumped 340% overnight — a stuck export job costs $410 an hour. What should I do?',
    context: 'Job started 02:14 · snapshot is 6 hours old · traffic is low after 23:00.',
    columnLabel: 'What should I do?',
    options: [
      {
        id: 'stop',
        title: 'Stop the job',
        agentPick: true,
        columnLabel: 'When should it restart?',
        children: [
          { id: 'eleven', title: 'Restart at 11 PM', agentPick: true },
          { id: 'leave', title: 'Leave it stopped' },
        ],
      },
      { id: 'cap', title: 'Cap spend at $50/hr', warning: 'The export may stall' },
      { id: 'platform', title: 'Page platform' },
      {
        id: 'other-infra',
        title: 'Other…',
        other: true,
        agentReply: "On it — job stopped, snapshot saved. I'll restart it at 11 PM when traffic is low.",
      },
    ],
  },
]

export const lowRiskDecision: Decision = {
  id: 'invoices',
  risk: 'low',
  agent: { name: 'Billing agent', model: 'Opus 5.5' },
  question: 'Three invoices are past due by 4 days. Send a reminder?',
  context: 'No disputes open · reminders usually clear within a day.',
  columnLabel: 'Send a reminder?',
  options: [
    { id: 'send', title: 'Send the reminder', agentPick: true },
    { id: 'monday', title: 'Wait until Monday' },
    { id: 'other-billing', title: 'Other…', other: true },
  ],
}
