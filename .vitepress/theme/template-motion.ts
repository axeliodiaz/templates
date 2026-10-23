/** Default component motion across every system, without replacing component transforms.
 *  Distance and easing come from --m-* tokens on the document element (template-motion.css).
 *  Entrance duration stays 280ms on every language. */
const surfaces = '.fx-preview, .l-demo, .bsx, .sc, .lmn, .pf, .csx, .kit-section, .VPFeature, .VPHero, [class$="-app"], [class$="-dash"], .vp-doc > div, section, article, table, svg, img, [class*="card"], [class*="kpi"]'
const controls = 'button, a, input, select, textarea, summary, [role="button"], [role="tab"], [role="switch"]'
const travelSelector = 'h1, h2, h3, .kit-section, .VPFeature, .VPHero, .l-card, .fx-card, .sc-card, .lmn-card, .pf-card, .pp-card, .sk-card, article'
let cleanup: (() => void) | undefined

function motionProfile() {
  const cs = getComputedStyle(document.documentElement)
  const rise = cs.getPropertyValue('--m-rise').trim() || '8px'
  const ease = cs.getPropertyValue('--m-ease').trim() || 'ease-out'
  const axis = cs.getPropertyValue('--m-axis').trim() === 'x' ? 'x' : 'y'
  return { rise, ease, axis }
}

function travelOf(el: HTMLElement, profile: ReturnType<typeof motionProfile>) {
  if (!el.matches(travelSelector)) return ''
  if (el.closest('svg, canvas, pre, code, dialog')) return ''
  const pos = getComputedStyle(el).position
  if (pos === 'fixed' || pos === 'sticky') return ''
  if (getComputedStyle(el).animationName !== 'none') return ''
  return profile.axis === 'x' ? `${profile.rise} 0` : `0 ${profile.rise}`
}

function motionRoots() {
  const all = [...document.querySelectorAll<HTMLElement>('.VPHome, .vp-doc')]
  const outer = all.filter(el => !all.some(other => other !== el && other.contains(el)))
  return outer.length ? outer : all
}

export function mountTemplateMotion() {
  cleanup?.()
  const roots = motionRoots()
  if (!roots.length) return
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  const running = new Set<Animation>()
  const seen = new WeakSet<Element>()
  const profile = () => motionProfile()
  const enter = (el: Element, index = 0) => {
    if (seen.has(el) || media.matches || !(el instanceof HTMLElement)) return
    seen.add(el)
    const current = profile()
    const from = travelOf(el, current)
    const frames: Keyframe[] = from
      ? [{ opacity: 0.45, translate: from }, { opacity: 1, translate: '0 0' }]
      : [{ opacity: 0.45 }, { opacity: 1 }]
    const animation = el.animate(frames, {
      duration: 280, delay: Math.min(index % 6, 5) * 25, easing: current.ease,
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
  roots.forEach(node => {
    node.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > p, :scope > ul, :scope > ol, :scope > table, :scope .VPFeature, :scope .VPHero').forEach(el => observer.observe(el))
    observe(node)
  })
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
      const animation = el.animate([{ opacity: 0.7 }, { opacity: 1 }], { duration: 180, easing: profile().ease })
      running.add(animation)
      animation.finished.catch(() => {}).finally(() => running.delete(animation))
    })
  })
  roots.forEach(node => changes.observe(node, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'aria-selected', 'aria-pressed', 'aria-expanded', 'aria-checked', 'data-amount-value'] }))
  const inputChanged = (event: Event) => {
    if (media.matches || !(event.target instanceof HTMLElement)) return
    const animation = event.target.animate([{ opacity: 0.7 }, { opacity: 1 }], { duration: 160, easing: profile().ease })
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
    const animation = details.animate([{ height: oldHeight + 'px' }, { height: newHeight + 'px' }], { duration: 200, easing: profile().ease })
    running.add(animation)
    animation.finished.catch(() => {}).finally(() => { if (closing) details.open = false; details.style.overflow = ''; running.delete(animation) })
  }
  roots.forEach(node => {
    node.addEventListener('click', disclosureClick)
    node.addEventListener('change', inputChanged)
  })
  const preferenceChanged = () => {
    if (media.matches) { roots.forEach(node => node.getAnimations({ subtree: true }).forEach(animation => animation.cancel())); running.clear() }
    else roots.forEach(node => observe(node))
  }
  media.addEventListener('change', preferenceChanged)
  cleanup = () => {
    observer.disconnect(); changes.disconnect(); media.removeEventListener('change', preferenceChanged)
    roots.forEach(node => { node.removeEventListener('change', inputChanged); node.removeEventListener('click', disclosureClick) })
    running.forEach(animation => animation.cancel()); running.clear()
  }
}
