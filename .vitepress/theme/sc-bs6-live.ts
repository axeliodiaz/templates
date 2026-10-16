// Live previews for real Bootstrap 6 blocks inside `.sc` (Scopecraft).
import { ensureScBs6 } from './sc-bs6-load'

type El = HTMLElement
const q = (r: ParentNode, s: string) => r.querySelector<El>(s)
const qa = (r: ParentNode, s: string) => Array.from(r.querySelectorAll<El>(s))

function sectionTitle(block: El): string {
  let n: Element | null = block.previousElementSibling
  while (n) {
    if (/^H[23]$/.test(n.tagName)) return (n.textContent || '').replace(/[\u200b#]/g, '').trim().toLowerCase()
    n = n.previousElementSibling
  }
  return ''
}

function bindToasts(block: El) {
  const bar = document.createElement('div')
  bar.className = 'd-flex flex-wrap gap-2 align-items-center mb-2 p-2 border border-dashed rounded sc-bs6-livebar'
  bar.innerHTML =
    '<span class="text-uppercase small text-muted">Try it</span>' +
    ['success', 'warning', 'error', 'info'].map(
      (k, i) =>
        `<button type="button" class="btn-${i === 0 ? 'solid' : 'outline'} theme-${k === 'error' ? 'danger' : k === 'info' ? 'info' : k}" data-toast="${k}">${k}</button>`
    ).join('')
  block.prepend(bar)
  bar.addEventListener('click', async (e) => {
    const b = (e.target as El).closest<El>('[data-toast]')
    if (!b) return
    const bs = await ensureScBs6()
    if (!bs) return
    let host = document.getElementById('sc-bs6-toast-host')
    if (!host) {
      host = document.createElement('div')
      host.id = 'sc-bs6-toast-host'
      host.className = 'sc toast-container position-fixed top-0 end-0 p-3'
      document.body.appendChild(host)
    }
    const kind = b.dataset.toast!
    const el = document.createElement('div')
    el.className = `toast align-items-center text-bg-${kind === 'error' ? 'danger' : kind} border-0`
    el.innerHTML = `<div class="d-flex"><div class="toast-body">${kind} toast</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`
    host.appendChild(el)
    bs.Toast.getOrCreateInstance(el, { autohide: true, delay: 3500 }).show()
    el.addEventListener('hidden.bs.toast', () => el.remove())
  })
}

function bindModals(block: El) {
  const id = `sc-bs6-md-${Math.random().toString(36).slice(2, 8)}`
  const dlg = document.createElement('dialog')
  dlg.className = 'dialog'
  dlg.id = id
  dlg.innerHTML =
    '<div class="dialog-header"><h2 class="dialog-title">Send proposal?</h2><button type="button" class="btn-close" data-bs-dismiss="dialog"></button></div>' +
    '<div class="dialog-body"><p>Odalys Brandt will get a link to the scope and price.</p></div>' +
    '<div class="dialog-footer"><button type="button" class="btn-outline theme-secondary" data-bs-dismiss="dialog">Cancel</button>' +
    '<button type="button" class="btn-solid theme-primary" data-bs-dismiss="dialog">Send</button></div>'
  block.appendChild(dlg)
  const bar = document.createElement('div')
  bar.className = 'd-flex flex-wrap gap-2 mb-2 p-2 border border-dashed rounded sc-bs6-livebar'
  bar.innerHTML =
    '<span class="text-uppercase small text-muted">Try it</span><button type="button" class="btn-solid theme-primary" data-open-md>Open dialog</button>'
  block.prepend(bar)
  bar.addEventListener('click', async (e) => {
    const btn = (e.target as El).closest<El>('[data-open-md]')
    if (!btn) return
    const bs = await ensureScBs6()
    if (!bs) return
    bs.Dialog.getOrCreateInstance(dlg).show()
  })
}

function bindBlock(block: El) {
  if (block.dataset.scBs6Live) return
  block.dataset.scBs6Live = '1'
  const title = sectionTitle(block)
  if (title.includes('toast')) bindToasts(block)
  if (title.includes('modal')) bindModals(block)
  block.querySelectorAll('.alert .btn-close, .alert [aria-label="Close"]').forEach((x) => {
    x.addEventListener('click', () => x.closest('.alert')?.remove())
  })
}

export function mountScBs6Live() {
  if (!document.documentElement.classList.contains('tpl-sc')) return
  qa(document, '.sc:not(.toast-container)').forEach(bindBlock)
}
