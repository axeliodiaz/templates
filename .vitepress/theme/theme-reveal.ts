// Feathered theme reveal: the new theme sweeps outward from the toggle with a
// soft, blurred edge (View Transitions API). Falls back to an instant switch
// when View Transitions are unavailable or reduced motion is preferred.
import { nextTick } from 'vue'

type ViewTransitionDoc = Document & {
  startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> }
}

export function revealTheme(origin: Event | HTMLElement | null, apply: () => void): void {
  if (typeof document === 'undefined') {
    apply()
    return
  }
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as ViewTransitionDoc
  if (reduce || typeof doc.startViewTransition !== 'function') {
    apply()
    return
  }
  const el = origin instanceof HTMLElement ? origin : origin?.target instanceof HTMLElement ? origin.target : null
  const rect = el?.getBoundingClientRect()
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
  const root = document.documentElement
  root.style.setProperty('--theme-reveal-x', `${Math.round(x)}px`)
  root.style.setProperty('--theme-reveal-y', `${Math.round(y)}px`)
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  root.style.setProperty('--theme-reveal-r', `${Math.ceil(radius) + 140}px`)
  doc.startViewTransition(async () => {
    apply()
    await nextTick()
  })
}
