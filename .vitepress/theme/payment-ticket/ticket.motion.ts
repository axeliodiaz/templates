import { animate } from 'motion'
import { EASE_OUT, reducedNow, type Controls } from '../flow-graph/flow-graph.motion'

export { EASE_OUT, reducedNow, type Controls }
export function keep(set: Set<Controls>, control: Controls) {
  set.add(control)
  control.finished.then(() => { control.complete(); control.cancel(); set.delete(control) }).catch(() => set.delete(control))
  return control
}
export function stopAll(set: Set<Controls>) {
  set.forEach(c => { c.complete(); c.cancel() })
  set.clear()
}

export type MotionProfile = 'default' | 'calm' | 'terminal' | 'playful' | 'glass'

const SCAN_EASE: [number, number, number, number] = [0.65, 0, 0.35, 1]
const TEAR_EASE: [number, number, number, number] = [0.34, 1.56, 0.64, 1]

export function playEntrance(
  paper: HTMLElement,
  set: Set<Controls>,
  profile: MotionProfile,
  onAmount?: (el: HTMLElement, from: number, to: number) => void,
) {
  const reduced = reducedNow()
  if (reduced) return
  const badge = paper.querySelector<HTMLElement>('.ticket__badge')
  const sparks = [...paper.querySelectorAll<HTMLElement>('.ticket__spark')]
  const rows = [...paper.querySelectorAll<HTMLElement>('.ticket__row')]
  const bars = [...paper.querySelectorAll<HTMLElement>('.ticket__barline')]
  keep(set, animate(paper.querySelector('.ticket__top')!, { opacity: [0, 1], y: [12, 0], scale: [0.98, 1] }, { duration: 0.52, ease: [...EASE_OUT] }))
  if (badge) {
    const spring = profile === 'playful' ? [0.4, 1.14, 1] : profile === 'calm' ? [0.9, 1] : [0.4, 1.08, 1]
    if (profile === 'terminal') {
      keep(set, animate(badge, { opacity: [0, 1] }, { duration: 0.16, ease: 'steps(4,end)', delay: 0.12 }))
    } else if (profile === 'calm') {
      keep(set, animate(badge, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.24, ease: [...EASE_OUT], delay: 0.12 }))
    } else {
      keep(set, animate(badge, { opacity: [0, 1], scale: spring, rotate: [-14, 3, 0] }, { duration: 0.52, ease: TEAR_EASE, delay: 0.12 }))
    }
  }
  if (profile !== 'calm' && profile !== 'terminal') {
    sparks.forEach((el, i) => {
      const angle = (i / 6) * Math.PI * 2
      const r = 30 + (i % 2) * 6
      keep(set, animate(el, {
        opacity: [0, 1, 0],
        scale: [0.4, 1, 0.6],
        x: [0, Math.cos(angle) * r],
        y: [0, Math.sin(angle) * r],
      }, { duration: 0.64, ease: [...EASE_OUT], delay: 0.26 }))
    })
  }
  rows.forEach((el, i) => {
    keep(set, animate(el, { opacity: [0, 1], y: [4, 0] }, { duration: 0.28, ease: [...EASE_OUT], delay: 0.38 + i * 0.05 }))
  })
  const amountEl = paper.querySelector<HTMLElement>('[data-ticket-amount]')
  if (amountEl && onAmount) onAmount(amountEl, 0, Number(amountEl.dataset.target ?? 0))
  if (profile !== 'terminal') {
    bars.forEach((el, i) => {
      keep(set, animate(el, { scaleY: [0, 1] }, { duration: 0.2, ease: [...EASE_OUT], delay: 0.6 + i * 0.005, transformOrigin: 'bottom' }))
    })
  }
}

export function countUpAmount(el: HTMLElement, from: number, to: number, format: (n: number) => string, set: Set<Controls>) {
  if (reducedNow() || from === to || to === 0) {
    el.textContent = format(to)
    return
  }
  keep(set, animate(from, to, {
    duration: 0.9,
    ease: [0.33, 1, 0.68, 1],
    onUpdate: v => { el.textContent = format(Math.round(v)) },
  }))
}