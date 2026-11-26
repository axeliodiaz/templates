export type TicketStatus = 'pending' | 'paid' | 'failed'
export type Funding = 'debit' | 'credit' | 'prepaid' | null
export interface TicketMethod { kind: 'card'; holder: string | null; last4: string | null; funding: Funding }
export interface PaymentTicketData {
  id: string
  status: TicketStatus
  reference: string
  amount: { minor: number | null; currency: string }
  paidAt: string | null
  timeZone?: string
  method: TicketMethod | null
}
export type TicketAction = 'copy' | 'reveal' | 'scan' | 'tear' | 'attach' | 'replay' | 'retry' | 'tour'
export type Ack = { state: 'ack' | 'error'; message: string }

const statuses = new Set<TicketStatus>(['pending', 'paid', 'failed'])

export function validate(d: PaymentTicketData | null): string[] {
  const errors: string[] = []
  if (!d) return errors
  if (typeof d.reference !== 'string' || !d.reference.trim()) errors.push('missing reference')
  if (!statuses.has(d.status)) errors.push('unknown status')
  const minor = d.amount?.minor
  if (minor !== null && minor !== undefined) {
    if (!Number.isFinite(minor) || minor < 0 || !Number.isInteger(minor)) errors.push('invalid amount.minor')
  }
  if (!d.amount?.currency) errors.push('missing currency')
  return errors
}

function fractionDigits(currency: string): number {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
  } catch {
    return 2
  }
}

export function formatMoney(minor: number | null, currency: string, fraction?: number): string {
  if (minor === null) return 'n/a'
  const digits = fraction ?? fractionDigits(currency)
  const scale = 10 ** digits
  const major = minor / scale
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(major)
  } catch {
    return `${major.toFixed(digits)} ${currency}`
  }
}

export function formatPaidAt(iso: string | null, timeZone = 'UTC'): string {
  if (!iso) return 'n/a'
  if (!/T.*(Z|[+-]\d{2}:?\d{2})$/i.test(iso)) return 'n/a'
  const ms = Date.parse(iso)
  if (!Number.isFinite(ms)) return 'n/a'
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date(ms))
    const pick = (t: Intl.DateTimeFormatPartTypes) => parts.find(p => p.type === t)?.value ?? ''
    const day = pick('day').replace(/^0/, '')
    const month = pick('month')
    const year = pick('year')
    const hour = pick('hour')
    const minute = pick('minute')
    return `${day} ${month} ${year} · ${hour}:${minute}`
  } catch {
    return timeZone !== 'UTC' ? formatPaidAt(iso, 'UTC') : 'n/a'
  }
}

export function barcodeDigits(reference: string): [string, string, string] {
  const digits = reference.replace(/\D/g, '')
  if (!digits.length) return ['0', '', '']
  const g1 = digits.slice(0, 1)
  const g2 = digits.slice(1, 7)
  const g3 = digits.slice(7, 13)
  return [g1, g2, g3]
}

function fnv1a(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function xorshift(seed: number): () => number {
  let s = seed || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 0xffffffff
  }
}

export function barcodeBars(seed: string): { bars: [number, number][]; width: number } {
  const rng = xorshift(fnv1a(seed))
  const bars: [number, number][] = [[0, 2]]
  let x = 2
  for (let i = 0; i < 40; i++) {
    const w = 1 + Math.floor(rng() * 3)
    bars.push([x, w])
    x += w + (rng() > 0.35 ? 1 : 2)
  }
  bars.push([x, 2])
  return { bars, width: x + 2 }
}

export function fundingLabel(funding: Funding): string {
  if (!funding) return 'Card'
  return funding.charAt(0).toUpperCase() + funding.slice(1)
}