import { animate, stagger } from 'motion'

export function mountLumenMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  document.querySelectorAll<HTMLElement>('.lmn-app').forEach((root) => {
    if (root.dataset.mo) return
    root.dataset.mo = '1'
    const rows = root.querySelectorAll<HTMLElement>('.lmn-t tbody tr, .lmn-kpi, .lmn-card')
    animate(rows, { opacity: [0, 1], y: [8, 0] }, { delay: stagger(0.05), duration: 0.45, ease: 'easeOut' })
    root.querySelectorAll<HTMLElement>('.lmn-wf').forEach((el, i) => {
      animate(el, { scaleX: [0, 1] }, { delay: 0.3 + i * 0.08, duration: 0.5, ease: 'easeOut' })
      el.style.transformOrigin = 'left'
    })
    root.querySelectorAll<HTMLElement>('.lmn-fill').forEach((el, i) => {
      el.style.transformOrigin = 'left'
      animate(el, { scaleX: [0, 1] }, { delay: 0.2 + i * 0.06, duration: 0.6, ease: 'easeOut' })
    })
  })
}
