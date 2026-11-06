import { animate, stagger } from 'motion'

export const SPRING_LAYOUT = { type: 'spring', stiffness: 250, damping: 25, mass: 1 } as const
export const SPRING_ENTER = { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const
export const EASE_OUT = [.16, 1, .3, 1] as const
export const EASE_OUT_CUBIC = [.33, 1, .68, 1] as const
export const reducedNow = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
export type Controls = ReturnType<typeof animate>
export const stopAll = (set: Set<Controls>) => { set.forEach(control => control.stop()); set.clear() }
export const completeAll = (set: Set<Controls>) => { set.forEach(control => control.complete()); set.clear() }
const owners = new WeakMap<Element, Controls>()
export function keep(set: Set<Controls>, control: Controls, cleanup?: () => void) {
  set.add(control)
  control.finished.finally(() => { set.delete(control); cleanup?.() })
  return control
}
export function playEntrance(stage: HTMLElement, set: Set<Controls>, particleStart: (delays: Map<string, number>) => void) {
  const nodes = [...stage.querySelectorAll<HTMLElement>('[data-fg-node]')]
  const lines = [...stage.querySelectorAll<SVGPathElement>('.rl-fg-edge-line')]
  const t0 = .04 * Math.max(0, nodes.length - 1) + .12
  const startTime = performance.now()
  nodes.forEach(el => el.style.willChange = 'transform, opacity')
  keep(set, animate(nodes, { opacity: [0, 1], y: [8, 0], scale: [.98, 1] }, { ...SPRING_ENTER, delay: stagger(.04), startTime }), () => nodes.forEach(el => { el.style.willChange = ''; el.style.transform = ''; el.style.opacity = '' }))
  lines.forEach(line => { line.style.strokeDasharray = '1 1'; line.style.strokeDashoffset = '1' })
  keep(set, animate(lines, { strokeDashoffset: [1, 0] }, { duration: .5, ease: [...EASE_OUT], delay: stagger(.03, { startDelay: t0 }), startTime }), () => lines.forEach(line => { line.style.strokeDasharray = ''; line.style.strokeDashoffset = '' }))
  const glows = [...stage.querySelectorAll<SVGElement>('.rl-fg-edge-glow,.rl-fg-port')]
  keep(set, animate(glows, { opacity: [0, 1] }, { duration: .3, ease: 'linear', delay: t0 + .2, startTime }), () => glows.forEach(el => el.style.opacity = ''))
  particleStart(new Map(lines.map((line, i) => [line.closest<SVGElement>('[data-edge]')!.dataset.edge!, t0 + .03 * i + .5])))
}
export interface Particle { control: Controls; setLength(n: number): void }
export function runParticle(path: SVGPathElement, index: number, startDelay = 0): Particle {
  let length = path.getTotalLength()
  path.style.strokeDasharray = `14 ${length + 14}`; path.style.strokeDashoffset = '14'
  const control = animate(0, 1, { duration: 1.5, ease: 'linear', repeat: Infinity, delay: startDelay + (index * .18) % 1.5,
    onUpdate: t => { path.style.strokeDashoffset = String(14 - t * (length + 14)) } })
  return { control, setLength(n) { length = n; path.style.strokeDasharray = `14 ${n + 14}` } }
}
export function trackEdgesWhile(done: Promise<unknown>, measure: () => void): () => void {
  let alive = true, frame = 0
  const loop = () => { if (!alive) return; measure(); frame = requestAnimationFrame(loop) }
  frame = requestAnimationFrame(loop)
  const stop = () => { alive = false; cancelAnimationFrame(frame); measure() }
  done.finally(stop)
  return stop
}
/** FIRST rects are visual positions, so interruptions restart from the current frame. */
export function switchGroup(stage: HTMLElement, first: Map<string, DOMRect>, set: Set<Controls>, measure: () => void) {
  const last = [...stage.querySelectorAll<HTMLElement>('[data-fg-node]')].filter(el => !el.closest('[data-fg-leaving]')).map(el => ({ el, rect: el.getBoundingClientRect() }))
  const nodes = last.map(({el,rect}) => ({el,first:first.get(el.dataset.fgNode!),rect})).filter(({first:a,rect:b}) => !a || Math.abs(a.left-b.left)+Math.abs(a.top-b.top)>=.5)
  if (!nodes.length) { measure(); return () => {} }
  const render = (t: number) => {
    nodes.forEach(({el,first:a,rect:b}) => {
      if (a) el.style.transform = `translate(${(a.left-b.left)*(1-t)}px,${(a.top-b.top)*(1-t)}px)`
      else { el.style.transform = `scale(${.96+.04*t})`; el.style.opacity = String(t) }
    })
    measure()
  }
  nodes.forEach(({el}) => el.style.willChange='transform, opacity')
  render(0)
  const control = animate(0,1,{...SPRING_LAYOUT,onUpdate:render})
  nodes.forEach(({el}) => owners.set(el,control))
  keep(set,control,()=>nodes.forEach(({el})=>{if(owners.get(el)!==control)return;owners.delete(el);el.style.transform='';el.style.opacity='';el.style.willChange=''}))
  return () => { control.stop() }

}
export function tweenNumber(el: HTMLElement, from: number, to: number, format: (n: number) => string, duration = .7) {
  if (reducedNow() || from === to) { el.textContent = format(to); return }
  return animate(from, to, { duration, ease: [...EASE_OUT_CUBIC], onUpdate: value => { el.textContent = format(Math.round(value)) } })
}

export function insertRowAnimated(row: HTMLElement, reduced = reducedNow()) {
  if(reduced)return
  row.style.overflow='hidden'
  const control=animate(row,{height:[0,52],opacity:[0,1]},{duration:.3,ease:[...EASE_OUT]})
  control.finished.finally(()=>{row.style.height='';row.style.overflow=''})
  return control
}
export function openDetail(graph: HTMLElement, detail: HTMLElement, title: HTMLElement, from: DOMRect, set: Set<Controls>, reduced = reducedNow()) {
  if(!reduced)detail.style.transform='translateY(12px) scale(0.96)'
  const to=title.getBoundingClientRect()
  if(reduced){keep(set,animate(detail,{opacity:[0,1]},{duration:.075}));return keep(set,animate(graph,{opacity:[1,0]},{duration:.075}))}
  const dx=(from.left-to.left)/.96,dy=(from.top-to.top)/.96,s=from.height/to.height
  title.style.transformOrigin='0 0'
  keep(set,animate(title,{x:[dx,0],y:[dy,0],scale:[s,1]},SPRING_ENTER))
  keep(set,animate(detail,{opacity:[0,1],scale:[.96,1],y:[12,0]},{...SPRING_ENTER,delay:.06}))
  return keep(set,animate(graph,{scale:[1,.95],opacity:[1,0],filter:['blur(0px)','blur(4px)']},{duration:.3,ease:[...EASE_OUT]}))
}
export function closeDetail(graph: HTMLElement, detail: HTMLElement, title: HTMLElement, to: DOMRect, set: Set<Controls>, reduced = reducedNow()) {
  const from=title.getBoundingClientRect()
  if(reduced){keep(set,animate(detail,{opacity:0},{duration:.075}));return keep(set,animate(graph,{opacity:[0,1]},{duration:.075,delay:.075}))}
  keep(set,animate(title,{x:to.left-from.left,y:to.top-from.top,scale:to.height/from.height},SPRING_ENTER))
  keep(set,animate(detail,{opacity:0,scale:.96},{duration:.2,ease:[...EASE_OUT]}))
  return keep(set,animate(graph,{scale:[.95,1],opacity:[0,1],filter:['blur(4px)','blur(0px)']},{duration:.3,ease:[...EASE_OUT]}))
}
