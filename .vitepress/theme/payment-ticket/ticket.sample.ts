import type { PaymentTicketData } from './ticket.model'
import ticketDef from './payment-ticket.json'

export const sampleTicket: PaymentTicketData = ticketDef.ticket as PaymentTicketData

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

export const autoExploreScript: TourStep[] = ticketDef.autoExplore as TourStep[]

export { ticketDef as TICKET_DEF }