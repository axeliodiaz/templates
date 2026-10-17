/** Bootstrap 6 behaviors for Scopecraft demos (scoped under .sc-bs6-root). */
export async function initScopecraftBs6() {
  const mod = await import('bootstrap/dist/js/bootstrap.bundle.min.js')
  const Tooltip = mod.Tooltip ?? mod.default?.Tooltip
  if (!Tooltip) return
  document.querySelectorAll<HTMLElement>('.sc-bs6-root [data-bs-toggle="tooltip"]').forEach((el) => {
    Tooltip.getOrCreateInstance(el)
  })
}
