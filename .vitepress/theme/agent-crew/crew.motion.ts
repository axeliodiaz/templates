import { animate, stagger } from 'motion'
import type { CrewAgent } from './crew.model'
import { handoffPath } from './crew.model'
import type { Controls } from '../flow-graph/flow-graph.motion'
import { EASE_OUT, SPRING_ENTER, keep, reducedNow, stopAll } from '../flow-graph/flow-graph.motion'

export { reducedNow, stopAll }
export type { Controls }

export function playEntrance(stage: HTMLElement, set: Set<Controls>) {
  if (reducedNow()) return
  const cards = [...stage.querySelectorAll<HTMLElement>('[data-crew-card]')]
  const lines = [...stage.querySelectorAll<SVGPathElement>('.crew-wire-line')]
  cards.forEach(el => { el.style.willChange = 'transform, opacity' })
  keep(set, animate(cards, { opacity: [0, 1], y: [10, 0], scale: [.98, 1] }, { ...SPRING_ENTER, delay: stagger(.04) }), () => cards.forEach(el => { el.style.willChange = ''; el.style.transform = ''; el.style.opacity = '' }))
  lines.forEach(line => { line.style.strokeDasharray = '1 1'; line.style.strokeDashoffset = '1' })
  const t0 = .04 * Math.max(0, cards.length - 1) + .08
  keep(set, animate(lines, { strokeDashoffset: [1, 0] }, { duration: .5, ease: [...EASE_OUT], delay: stagger(.03, { startDelay: t0 }) }), () => lines.forEach(line => { line.style.strokeDasharray = ''; line.style.strokeDashoffset = '' }))
}

export function pulseHandoff(stage: HTMLElement, path: SVGPathElement, set: Set<Controls>) {
  if (reducedNow()) {
    path.classList.add('crew-wire-active')
    return
  }
  const length = path.getTotalLength()
  const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  pulse.setAttribute('d', path.getAttribute('d') ?? '')
  pulse.classList.add('crew-handoff-pulse')
  path.parentElement?.appendChild(pulse)
  pulse.style.strokeDasharray = `14 ${length + 14}`
  pulse.style.strokeDashoffset = '14'
  const control = animate(0, 1, {
    duration: 1.2,
    ease: 'linear',
    onUpdate: t => { pulse.style.strokeDashoffset = String(14 - t * (length + 14)) },
  })
  keep(set, control, () => pulse.remove())
  path.classList.add('crew-wire-active')
}

export function floorGlow(card: HTMLElement, set: Set<Controls>) {
  if (reducedNow()) {
    card.classList.add('crew-floor-on')
    return
  }
  card.classList.add('crew-floor-on')
  keep(set, animate(card, { opacity: [1, .92, 1] }, { duration: .8, ease: 'ease-out' }))
}

export function handoffEdges(root: CrewAgent, handoff: { from: string; to: string }, edges: Map<string, string>) {
  const ids = handoffPath(root, handoff.from, handoff.to)
  const list: string[] = []
  for (let i = 0; i < ids.length - 1; i++) {
    const a = ids[i]
    const b = ids[i + 1]
    const forward = `${a}:${b}`
    const back = `${b}:${a}`
    if (edges.has(forward)) list.push(forward)
    else if (edges.has(back)) list.push(back)
  }
  return list
}