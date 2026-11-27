import { animate } from 'motion'
import {
  EASE_OUT,
  EASE_OUT_CUBIC,
  reducedNow,
  stopAll,
  keep,
  type Controls,
} from '../flow-graph/flow-graph.motion'

export { reducedNow, stopAll, keep, type Controls, EASE_OUT, EASE_OUT_CUBIC }

export const ENTER = { duration: 0.34, ease: [...EASE_OUT] } as const
export const EXIT = { duration: 0.22, ease: [...EASE_OUT] } as const
export const STACK_SHIFT = { duration: 0.28, ease: [...EASE_OUT_CUBIC] } as const
export const SWIPE_DISMISS = { duration: 0.24, ease: [...EASE_OUT] } as const
export const ARM_GUARD_MS = 400
export const ARM_GUARD = ARM_GUARD_MS
export const GAP = 8
export const PEEK = 8
export const PEEK_SCALE = 0.05
export const COLLAPSE_GRACE = 200

export type MotionProfile = 'default' | 'calm' | 'terminal' | 'playful' | 'glass'

export const motionProfile = profileForTheme
export function profileForTheme(theme?: string): MotionProfile {
  const t = theme ?? 'lustro'
  if (t === 'evertrue') return 'calm'
  if (t === 'bastion') return 'terminal'
  if (t === 'pawprint') return 'playful'
  if (t === 'lustro') return 'glass'
  return 'default'
}

export function enterToast(el: HTMLElement, set: Set<Controls>, profile: MotionProfile) {
  if (reducedNow()) return
  const reduced = profile === 'calm' || profile === 'terminal'
  const y = profile === 'playful' ? 18 : 12
  const scale = profile === 'glass' ? 0.97 : 0.98
  keep(
    set,
    animate(
      el,
      { opacity: [0, 1], y: [y, 0], scale: [scale, 1] },
      { ...ENTER, duration: reduced ? 0.2 : ENTER.duration },
    ),
    () => {
      el.style.transform = ''
      el.style.opacity = ''
    },
  )
}

export function exitToast(el: HTMLElement, set: Set<Controls>, onDone: () => void) {
  if (reducedNow()) {
    onDone()
    return
  }
  keep(
    set,
    animate(el, { opacity: [1, 0], x: [0, 48], scale: [1, 0.96] }, EXIT),
    onDone,
  )
}

export function shiftStack(els: HTMLElement[], set: Set<Controls>) {
  if (reducedNow()) return
  els.forEach((el, i) => {
    const depth = els.length - 1 - i
    keep(set, animate(el, { y: [depth * 6, depth * 6] }, { duration: 0.01 }), () => {
      el.style.transform = ''
    })
  })
}