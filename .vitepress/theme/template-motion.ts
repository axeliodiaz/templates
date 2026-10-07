/** Default component motion across every system, without replacing component transforms. */
const scope = '.vp-doc'
const surfaces = '.fx-preview, .l-demo, .bsx, .sc, .lmn, .pf, .csx, .kit-section, [class$="-app"], [class$="-dash"], .vp-doc > div, section, article, table, svg, img, [class*="card"], [class*="kpi"]'
const controls = 'button, a, input, select, textarea, summary, [role="button"], [role="tab"], [role="switch"]'
let cleanup: (() => void) | undefined

export function mountTemplateMotion() {
  cleanup?.()
  const root = document.querySelector<HTMLElement>(scope)
  if (!root) return
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const running = new Set<Animation>()
  const seen = new WeakSet<Element>()
  const enter = (el: Element, index = 0) => {
    if (seen.has(el) || media.matches || !(el instanceof HTMLElement)) return
    seen.add(el)
    // Opacity only: preserve chart transforms, sticky positioning and fixed overlays.
    const animation = el.animate([{ opacity: 0.45 }, { opacity: 1 }], {
      duration: 280, delay: Math.min(index % 6, 5) * 25, easing: 'ease-out',
    })
    running.add(animation)
    animation.finished.catch(() => {}).finally(() => running.delete(animation))
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) { enter(entry.target, i); observer.unobserve(entry.target) }
    })
  }, { threshold: 0.08 })
  const observe = (node: Element) => {
    if (node.matches(surfaces)) observer.observe(node)
    node.querySelectorAll(surfaces).forEach(el => observer.observe(el))
  }
  root.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > p, :scope > ul, :scope > ol, :scope > table').forEach(el => observer.observe(el))
  observe(root)
  const changes = new MutationObserver((records) => {
    const updated = new Set<Element>()
    records.forEach(record => {
      if (record.type === 'childList') {
        record.addedNodes.forEach(node => {
          if (node instanceof Element) { observe(node); enter(node) }
        })
        const target = record.target instanceof Element ? record.target : record.target.parentElement
        if (target) updated.add(target.closest(surfaces) || target)
      } else if (record.target instanceof Element && record.target.matches(`${controls}, ${surfaces}`)) updated.add(record.target)
    })
    if (media.matches) return
    updated.forEach(el => {
      if (!(el instanceof HTMLElement) || el.closest('pre, code') || el.getAnimations().length) return
      const animation = el.animate([{ opacity: 0.7 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' })
      running.add(animation)
      animation.finished.catch(() => {}).finally(() => running.delete(animation))
    })
  })
  changes.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'aria-selected', 'aria-pressed', 'aria-expanded', 'aria-checked', 'data-amount-value'] })
  const inputChanged = (event: Event) => {
    if (media.matches || !(event.target instanceof HTMLElement)) return
    const animation = event.target.animate([{ opacity: 0.7 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' })
    running.add(animation)
    animation.finished.catch(() => {}).finally(() => running.delete(animation))
  }
  // Native disclosure keeps semantic open state while its content expands/collapses.
  const disclosureClick = (event: Event) => {
    const summary = event.target instanceof Element ? event.target.closest('summary') : null
    const details = summary?.parentElement
    if (!summary || !(details instanceof HTMLDetailsElement) || media.matches) return
    event.preventDefault()
    const oldHeight = details.getBoundingClientRect().height
    const closing = details.open
    if (!closing) details.open = true
    const newHeight = closing ? summary.getBoundingClientRect().height + parseFloat(getComputedStyle(details).paddingTop) + parseFloat(getComputedStyle(details).paddingBottom) : details.getBoundingClientRect().height
    details.style.overflow = 'hidden'
    const animation = details.animate([{height:oldHeight+'px'},{height:newHeight+'px'}],{duration:200,easing:'ease-out'})
    running.add(animation)
    animation.finished.catch(()=>{}).finally(()=>{if(closing)details.open=false;details.style.overflow='';running.delete(animation)})
  }
  root.addEventListener('click', disclosureClick)
  root.addEventListener('change', inputChanged)
  const preferenceChanged = () => {
    if (media.matches) { root.getAnimations({ subtree: true }).forEach(animation => animation.cancel()); running.clear() }
    else { observe(root) }
  }
  media.addEventListener('change', preferenceChanged)
  cleanup = () => {
    observer.disconnect(); changes.disconnect(); media.removeEventListener('change', preferenceChanged); root.removeEventListener('change', inputChanged); root.removeEventListener('click', disclosureClick)
    running.forEach(animation => animation.cancel()); running.clear()
  }
}
