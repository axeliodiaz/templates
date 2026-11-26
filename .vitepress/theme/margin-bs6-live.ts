/** Bootstrap 6 behaviors for Margin demos (scoped under .margin-bs6-root). */
export async function initMarginBs6() {
  const mod = await import('bootstrap/dist/js/bootstrap.bundle.min.js')
  const bootstrap = mod.default ?? mod
  const Tooltip = bootstrap.Tooltip
  const Modal = bootstrap.Modal
  const Collapse = bootstrap.Collapse
  const Dropdown = bootstrap.Dropdown
  if (Tooltip) {
    document.querySelectorAll<HTMLElement>('.margin-bs6-root [data-bs-toggle="tooltip"]').forEach((el) => {
      Tooltip.getOrCreateInstance(el)
    })
  }
  if (Modal) {
    document.querySelectorAll<HTMLElement>('.margin-bs6-root [data-bs-toggle="modal"]').forEach((el) => {
      const target = el.getAttribute('data-bs-target')
      if (!target) return
      const pane = document.querySelector<HTMLElement>(target)
      if (!pane) return
      const instance = Modal.getOrCreateInstance(pane)
      el.addEventListener('click', (event) => {
        event.preventDefault()
        instance.toggle()
      })
    })
  }
  if (Collapse) {
    document.querySelectorAll<HTMLElement>('.margin-bs6-root [data-bs-toggle="collapse"]').forEach((el) => {
      const target = el.getAttribute('data-bs-target')
      if (target) {
        const pane = document.querySelector<HTMLElement>(target)
        if (pane) Collapse.getOrCreateInstance(pane, { toggle: false })
      }
    })
  }
  if (Dropdown) {
    document.querySelectorAll<HTMLElement>('.margin-bs6-root [data-bs-toggle="dropdown"]').forEach((el) => {
      Dropdown.getOrCreateInstance(el)
    })
  }
}