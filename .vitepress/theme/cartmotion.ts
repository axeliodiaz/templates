import { animate, stagger } from 'motion'

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function run(root: HTMLElement) {
  if (reduce()) return
  const paper = root.querySelectorAll<HTMLElement>('.paper')
  const rows = root.querySelectorAll<HTMLElement>('.paper .r, .li, .tot .r, .stat, .cp')
  const bars = root.querySelectorAll<HTMLElement>('.bar i')
  paper.forEach((p) => {
    animate(p, { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'], y: [-30, 0] }, { duration: 2.2, ease: [0.3, 0.7, 0.2, 1] })
  })
  animate(rows, { opacity: [0, 1], x: [-10, 0] }, { delay: stagger(0.08, { startDelay: 0.2 }), duration: 0.5, ease: 'easeOut' })
  if (bars.length) animate(bars, { scaleY: [0, 1] }, { delay: stagger(0.02, { startDelay: 1.6 }), duration: 0.3 })
  root.querySelectorAll<HTMLElement>('.r.t span:last-child, .r.big span:last-child').forEach((el) => {
    const m = el.textContent?.match(/^(\D*)([\d.,]+)$/)
    if (!m) return
    const end = parseFloat(m[2].replace(/,/g, ''))
    animate(0, end, { duration: 1.2, ease: 'easeOut', onUpdate: (v) => { el.textContent = m[1] + v.toFixed(2) } })
  })
}

export function mountCartMotion() {
  document.querySelectorAll<HTMLElement>('.csx').forEach((root) => {
    if (root.dataset.mo) return
    root.dataset.mo = '1'
    run(root)
    root.querySelectorAll<HTMLElement>('.btn').forEach((b) => {
      if (/replay/i.test(b.textContent || '')) b.addEventListener('click', () => run(root))
    })
  })
}
