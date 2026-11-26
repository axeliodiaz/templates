/** Bootstrap 6 behaviors for Margin demos (scoped under .margin-bs6-root). */
export async function initMarginBs6() {
  const mod = await import('bootstrap/dist/js/bootstrap.bundle.min.js')
  const Tooltip = mod.Tooltip ?? mod.default?.Tooltip
  if (!Tooltip) return
  document.querySelectorAll<HTMLElement>('.margin-bs6-root [data-bs-toggle="tooltip"]').forEach((el) => {
    Tooltip.getOrCreateInstance(el)
  })
}