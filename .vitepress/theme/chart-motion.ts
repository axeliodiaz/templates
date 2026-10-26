// Entrance animation for chart cards. One engine for every chart: it reads each card's SVG (or cell grid),
// classifies the marks (lines draw, bars grow from their baseline, dots pop, areas and slices fade in)
// and plays them with Motion when the card enters the viewport. Reduced motion skips it. Call the returned
// object's replay() to run again, destroy() on unmount.
import { animate, stagger } from 'motion'

type Kind = 'draw' | 'seg' | 'barY' | 'barX' | 'pop' | 'fade'
interface Mark { el: SVGElement | HTMLElement; kind: Kind; opacity: string; inline: Record<string, string>; pathLength: string | null }
export interface ChartMotion { replay(): void; refresh(): void; destroy(): void }

const SKIP_TAGS = new Set(['defs', 'clippath', 'mask', 'lineargradient', 'radialgradient', 'title', 'desc', 'text', 'tspan', 'g', 'svg'])
// data-cm=<kind> marks a mark explicitly (used by charts whose marks the generic rules can't read, like gauge slices or HTML bars)
const KINDS = new Set(['draw', 'seg', 'barY', 'barX', 'pop', 'fade'])
const GRID = /^[MmHhVvZz0-9 .,\-]+$/
const reducedNow = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
const PROPS = ['opacity', 'transform', 'transform-origin', 'transform-box', 'stroke-dasharray', 'stroke-dashoffset']

function hasTransform(el: Element): boolean {
  for (let n: Element | null = el; n && n.tagName.toLowerCase() !== 'svg'; n = n.parentElement) if (n.hasAttribute('transform')) return true
  return false
}

function classify(card: Element): Mark[] {
  const out: Mark[] = []
  const add = (el: SVGElement | HTMLElement, kind: Kind) => {
    const cs = getComputedStyle(el)
    const inline: Record<string, string> = {}
    PROPS.forEach(p => { inline[p] = el.style.getPropertyValue(p) })
    out.push({ el, kind, opacity: cs.opacity, inline, pathLength: el.getAttribute('pathLength') })
  }
  card.querySelectorAll('svg').forEach(svg => {
    if (svg.closest('defs')) return
    const vb = svg.viewBox?.baseVal
    svg.querySelectorAll<SVGElement>('*').forEach(el => {
      const tag = el.tagName.toLowerCase()
      if (SKIP_TAGS.has(tag) || el.closest('defs,clipPath,mask,text')) return
      const want = el.getAttribute('data-cm')
      if (want && KINDS.has(want)) return add(el, want as Kind)
      const cs = getComputedStyle(el)
      const noFill = cs.fill === 'none' || el.getAttribute('fill') === 'none'
      const stroked = cs.stroke !== 'none' && parseFloat(cs.strokeWidth || '0') > 0
      const dashed = cs.strokeDasharray && cs.strokeDasharray !== 'none'
      const d = el.getAttribute('d') || ''
      const cls = (el.getAttribute('class') || '').toLowerCase()
      if (cls.includes('grid') || cls.includes('axis') || (tag === 'path' && GRID.test(d))) return
      if (tag === 'rect') {
        let bb: DOMRect | undefined
        try { bb = (el as unknown as SVGGraphicsElement).getBBox() } catch (e) { /* not rendered */ }
        if (bb && vb && bb.width > vb.width * 0.85 && bb.height > vb.height * 0.85) return
        if (hasTransform(el)) return add(el, 'fade')
        return add(el, bb && bb.width > bb.height * 1.2 ? 'barX' : 'barY')
      }
      if (tag === 'line' || tag === 'polyline' || tag === 'path' || tag === 'polygon') {
        if (noFill && stroked && !dashed && tag !== 'polygon') return add(el, 'draw')
        return add(el, 'fade')
      }
      if (tag === 'circle' || tag === 'ellipse') {
        if (dashed || hasTransform(el)) return add(el, 'fade')
        return add(el, 'pop')
      }
    })
  })
  card.querySelectorAll<HTMLElement>('.cg-matrix > *, .fx-heat > *').forEach(el => add(el, 'pop'))
  card.querySelectorAll<HTMLElement>('[data-cm]').forEach(el => {
    if (el instanceof SVGElement) return
    const want = el.getAttribute('data-cm')
    if (want && KINDS.has(want)) add(el, want as Kind)
  })
  return out
}

export function mountChartMotion(root: Element, cardSelector: string): ChartMotion {
  const cards = [...root.querySelectorAll(cardSelector)]
  const state = new Map<Element, { marks: Mark[]; ctl: { stop(): void }[]; done: boolean; token?: number }>()
  let io: IntersectionObserver | undefined
  let disposed = false
  let seq = 0

  const restore = (m: Mark) => {
    m.el.getAnimations().forEach(a => { if (!(typeof CSSTransition !== 'undefined' && a instanceof CSSTransition)) a.cancel() })
    PROPS.forEach(p => { if (m.inline[p]) m.el.style.setProperty(p, m.inline[p]); else m.el.style.removeProperty(p) })
    if (m.pathLength === null) m.el.removeAttribute('pathLength')
    else m.el.setAttribute('pathLength', m.pathLength)
  }
  const hide = (m: Mark) => { m.el.style.opacity = '0' }
  const stopCard = (c: Element, restoreAll: boolean) => {
    const s = state.get(c); if (!s) return
    s.ctl.forEach(a => { try { a.stop() } catch (e) { /* done */ } }); s.ctl = []
    if (restoreAll) s.marks.forEach(restore)
    c.classList.remove('cm-playing')
  }
  const prepare = (c: Element) => { const marks = classify(c); state.set(c, { marks, ctl: [], done: false }); marks.forEach(hide) }

  function play(c: Element) {
    if (disposed) return
    const s = state.get(c); if (!s) return
    stopCard(c, true)
    s.marks = classify(c)
    if (reducedNow() || !s.marks.length) { s.done = true; return }
    s.marks.forEach(hide)
    c.classList.add('cm-playing')
    const n = s.marks.length
    const step = Math.min(0.045, 0.7 / Math.max(n, 1))
    const group = (kind: Kind) => s.marks.filter(m => m.kind === kind)
    const to = (ms: Mark[]) => ms.map(m => m.el)
    const op = (m: Mark) => parseFloat(m.opacity || '1') || 1
    let order = 0
    const run = (ms: Mark[], kf: (m: Mark) => Record<string, unknown>, dur: number, pre?: (m: Mark) => void) => {
      ms.forEach(m => {
        pre?.(m)
        const delay = (order++) * step
        s.ctl.push(animate(m.el, kf(m) as never, { duration: dur, delay, ease: [0.22, 1, 0.36, 1] }))
      })
    }
    const origin = (m: Mark, o: string) => { m.el.style.setProperty('transform-box', 'fill-box'); m.el.style.setProperty('transform-origin', o) }
    run(group('draw'), m => ({ strokeDashoffset: [1, 0], opacity: [0, op(m)] }), 1.3, m => { m.el.setAttribute('pathLength', '1'); m.el.style.setProperty('stroke-dasharray', '1') })
    // Gauge slices keep their own dash geometry: grow the dash from zero at the slice's offset (pathLength untouched)
    run(group('seg'), m => {
      const dash = m.el.getAttribute('stroke-dasharray') || ''
      const gap = dash.trim().split(/[\s,]+/)[1] ?? '100'
      return { strokeDasharray: [`0 ${gap}`, dash], opacity: [0, op(m)] }
    }, 1)
    run(group('barY'), m => ({ transform: ['scaleY(0)', 'scaleY(1)'], opacity: [0, op(m)] }), 0.85, m => origin(m, '50% 100%'))
    run(group('barX'), m => ({ transform: ['scaleX(0)', 'scaleX(1)'], opacity: [0, op(m)] }), 0.85, m => origin(m, '0% 50%'))
    run(group('pop'), m => ({ transform: ['scale(0)', 'scale(1)'], opacity: [0, op(m)] }), 0.45, m => origin(m, '50% 50%'))
    run(group('fade'), m => ({ opacity: [0, op(m)] }), 0.6)
    void to
    const last = s.ctl[s.ctl.length - 1]
    const fin = (a: unknown) => (a as { finished?: Promise<unknown> }).finished
    const mine = ++seq; s.token = mine
    Promise.all(s.ctl.map(a => fin(a) || Promise.resolve())).then(() => {
      if (disposed || s.token !== mine) return
      s.marks.forEach(restore); c.classList.remove('cm-playing'); s.done = true
    }).catch(() => {})
    setTimeout(() => {
      if (disposed || s.token !== mine) return
      s.ctl.forEach(a => { try { (a as { complete?: () => void }).complete?.() } catch (e) { /* done */ } })
      s.marks.forEach(restore); c.classList.remove('cm-playing'); s.done = true
    }, (n * step + 1.6) * 1000)
    void last
  }

  const supported = typeof IntersectionObserver !== 'undefined'
  if (!reducedNow() && supported) {
    cards.forEach(prepare)
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io!.unobserve(e.target); play(e.target) } }), { threshold: 0.25 })
    cards.forEach(c => io!.observe(c))
  }
  return {
    replay() { cards.forEach(c => { if (!state.has(c)) state.set(c, { marks: [], ctl: [], done: false }); play(c) }) },
    refresh() {
      cards.forEach(c => { const s = state.get(c); if (s?.done) play(c) })
    },
    destroy() { disposed = true; io?.disconnect(); cards.forEach(c => stopCard(c, true)); state.clear() }
  }
}
