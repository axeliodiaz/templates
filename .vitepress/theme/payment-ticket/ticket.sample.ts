import type { PaymentTicketData } from './ticket.model'

export const sampleTicket: PaymentTicketData = {
  id: 'sample-1',
  status: 'paid',
  reference: 'TK-7316-2048-55',
  amount: { minor: 4820, currency: 'USD' },
  paidAt: '2026-03-14T18:40:00Z',
  timeZone: 'UTC',
  method: { kind: 'card', holder: 'Rowan Avery', last4: '6021', funding: 'debit' },
}

export function samplePaid(): PaymentTicketData {
  return JSON.parse(JSON.stringify(sampleTicket))
}

export function samplePending(): PaymentTicketData {
  return { ...samplePaid(), id: 'sample-pending', status: 'pending' }
}

export function sampleFailed(): PaymentTicketData {
  return { ...samplePaid(), id: 'sample-failed', status: 'failed' }
}

export type TourStep = { at: number; action: 'replay' | 'copy' | 'reveal' | 'scan' | 'tear' | 'attach' | 'collapse' | 'end' }

export const autoExploreScript: TourStep[] = [
  { at: 0, action: 'replay' },
  { at: 2000, action: 'copy' },
  { at: 3600, action: 'reveal' },
  { at: 5200, action: 'scan' },
  { at: 6800, action: 'tear' },
  { at: 8600, action: 'attach' },
  { at: 10200, action: 'collapse' },
  { at: 10200, action: 'end' },
]