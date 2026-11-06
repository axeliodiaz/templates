// Canonical Contribution Skyline geometry. Formula/order/rounding parity with spec §5.
// Type-only local import is erased; no runtime dependency, DOM, dates or shared mutable state.
import type {SkylineCellInput, SkylineOptions, SkylineFrame, SkylinePrism, SkylineLayout, SkylineFaces, SkylineKind, Pt} from './skyline.types'
export const AXES = { WX: 0.94, WY: -0.34, DX: 0.50, DY: 0.72 }
export const DEFAULTS = { gap: 0.16, hMaxFactor: 5, hMinFactor: 0.18, hMinPx: 2, padFactor: 1, labelLeftFactor: 2.2, labelBottomFactor: 1.6 }
const r2 = (v:number) => Math.round(v * 100) / 100

export class SkylineInputError extends Error {}

export function validateCells(cells:SkylineCellInput[], weeksCount:number):void {
  if (!Number.isInteger(weeksCount) || weeksCount < 0) throw new SkylineInputError('weeksCount')
  const seen = new Set()
  for (const c of cells) {
    if (!Number.isInteger(c.col) || c.col < 0 || c.col >= weeksCount) throw new SkylineInputError('col')
    if (!Number.isInteger(c.row) || c.row < 0 || c.row > 6) throw new SkylineInputError('row')
    const key = c.col * 7 + c.row
    if (seen.has(key)) throw new SkylineInputError('duplicate')
    seen.add(key)
    if (c.date === null) continue
    if (!/^\d{4}-\d{2}-\d{2}$/.test(c.date)) throw new SkylineInputError('date')
    if (c.count !== null && (!Number.isInteger(c.count) || c.count < 0)) throw new SkylineInputError('count')
  }
}

export function kindOf(c:SkylineCellInput):SkylineKind {
  if (c.date === null) return 'pad'
  if (c.count === null) return 'unknown'
  return c.count === 0 ? 'zero' : 'positive'
}

export function domainMax(cells:SkylineCellInput[]):number {
  let m = 0
  for (const c of cells) if (c.date !== null && c.count !== null && c.count > m) m = c.count
  return m
}

export function heightFor(count:number|null, max:number, pitch:number, opts:SkylineOptions = {}):number|null {
  const o={...DEFAULTS,...opts}
  if (count === null) return null
  if (count === 0 || max === 0) return 0
  const hMax = o.hMaxFactor * pitch
  const hMin = Math.max(o.hMinPx, o.hMinFactor * pitch)
  return r2(Math.max(hMin, (hMax * count) / max))
}

export function frame(weeksCount:number, pitch:number, opts:SkylineOptions = {}):SkylineFrame {
  const o={...DEFAULTS,...opts}
  const S = pitch, hMax = o.hMaxFactor * S, pad = o.padFactor * S
  const left = o.labelLeftFactor * S, bottom = o.labelBottomFactor * S
  const ox = pad + left
  const oy = pad + hMax + (-AXES.WY) * weeksCount * S // y coordinate of P(0,0,0)
  const width = r2(ox + (AXES.WX * weeksCount + AXES.DX * 7) * S + pad)
  const height = r2(oy + AXES.DY * 7 * S + bottom + pad)
  return { ox: r2(ox), oy: r2(oy), width, height, hMax }
}

export function project(c:number, r:number, z:number, pitch:number, f:SkylineFrame):Pt {
  return [r2(f.ox + (c * AXES.WX + r * AXES.DX) * pitch), r2(f.oy + (c * AXES.WY + r * AXES.DY) * pitch - z)]
}

export function unproject(x:number, y:number, pitch:number, f:SkylineFrame):{col:number;row:number} {
  // Inverse on z=0. Callers check the returned cell against their grid bounds.
  const X = (x - f.ox) / pitch, Y = (y - f.oy) / pitch
  const det = AXES.WX * AXES.DY - AXES.DX * AXES.WY
  const c = (X * AXES.DY - Y * AXES.DX) / det
  const r = (AXES.WX * Y - AXES.WY * X) / det
  return { col: Math.floor(c), row: Math.floor(r) }
}

export function paintKey(c:number, r:number, weeksCount:number):number { return r + (weeksCount - 1 - c) }

export function layoutSkyline(cells:SkylineCellInput[], weeksCount:number, pitch:number, opts:SkylineOptions = {}):SkylineLayout {
  const o={...DEFAULTS,...opts}
  validateCells(cells, weeksCount)
  const f = frame(weeksCount, pitch, o)
  const max = domainMax(cells)
  const g = o.gap / 2
  const prisms:SkylinePrism[] = cells.filter((c) => c.date !== null).map((c) => {
    const kind = kindOf(c)
    const h = heightFor(c.count, max, pitch, o)
    const z = h ?? 0
    const c0 = c.col + g, c1 = c.col + 1 - g, r0 = c.row + g, r1 = c.row + 1 - g
    const P = (cc:number, rr:number, zz:number) => project(cc, rr, zz, pitch, f)
    const top:Pt[] = [P(c0, r0, z), P(c1, r0, z), P(c1, r1, z), P(c0, r1, z)]
    const left:Pt[]|null = z > 0 ? [P(c0, r0, 0), P(c0, r1, 0), P(c0, r1, z), P(c0, r0, z)] : null
    const front:Pt[]|null = z > 0 ? [P(c0, r1, 0), P(c1, r1, 0), P(c1, r1, z), P(c0, r1, z)] : null
    return { col: c.col, row: c.row, date: c.date!, count: c.count, level: c.level, kind, h, top, left, front, key: paintKey(c.col, c.row, weeksCount), order:0 }
  })
  prisms.sort((a, b) => a.key - b.key || a.row - b.row || a.col - b.col)
  prisms.forEach((p, i) => { p.order = i })
  return { pitch, weeksCount, max, ...f, prisms }
}

export const pointsAttr = (pts:Pt[]) => pts.map(([x, y]) => `${x},${y}`).join(' ')

export function pickPitch(availableWidth:number, weeksCount:number):number {
  return Math.min(14, Math.max(8, Math.floor(availableWidth / (AXES.WX * weeksCount + 7.7))))
}

// Faces at fraction t of final height; t clamps to [0,1].
export function prismAt(p:SkylinePrism, t:number, pitch:number, f:SkylineFrame, opts:SkylineOptions = {}):SkylineFaces {
  const o={...DEFAULTS,...opts}
  const tt = Math.min(1, Math.max(0, t))
  const z = r2((p.h ?? 0) * tt)
  const g = o.gap / 2
  const c0 = p.col + g, c1 = p.col + 1 - g, r0 = p.row + g, r1 = p.row + 1 - g
  const P = (cc:number, rr:number, zz:number) => project(cc, rr, zz, pitch, f)
  return {
    top: [P(c0, r0, z), P(c1, r0, z), P(c1, r1, z), P(c0, r1, z)],
    left: z > 0 ? [P(c0, r0, 0), P(c0, r1, 0), P(c0, r1, z), P(c0, r0, z)] : null,
    front: z > 0 ? [P(c0, r1, 0), P(c1, r1, 0), P(c1, r1, z), P(c0, r1, z)] : null,
  }
}

// Outer silhouette at fraction t for a final focus/hover overlay. Zero height is the top face.
export function silhouette(p:SkylinePrism, t:number, pitch:number, f:SkylineFrame, opts:SkylineOptions = {}):Pt[] {
  const o={...DEFAULTS,...opts}
  const tt = Math.min(1, Math.max(0, t))
  const z = r2((p.h ?? 0) * tt)
  const g = o.gap / 2
  const c0 = p.col + g, c1 = p.col + 1 - g, r0 = p.row + g, r1 = p.row + 1 - g
  const P = (cc:number, rr:number, zz:number) => project(cc, rr, zz, pitch, f)
  if (z <= 0) return [P(c0, r0, 0), P(c1, r0, 0), P(c1, r1, 0), P(c0, r1, 0)]
  return [P(c0, r0, z), P(c1, r0, z), P(c1, r1, z), P(c1, r1, 0), P(c0, r1, 0), P(c0, r0, 0)]
}

