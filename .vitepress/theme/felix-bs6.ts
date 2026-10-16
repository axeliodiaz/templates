// Bootstrap 6 (6.0.0-alpha.1) for Felix component blocks (.felix-bs6).
// Scoped: tokens live on .felix-bs6; BS6 CSS is loaded only when blocks are present.

const BS6_CSS =
  'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css'
const BS6_CSS_SRI =
  'sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe'
const BS6_JS =
  'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/js/bootstrap.bundle.min.js'
const BS6_JS_SRI =
  'sha384-1a/pXj49ZQ1aHEmrJ+gMw1otqoVsYwlEnlD8mIfY2TV03r20Y0CN7uqx1tQogjPL'
const FELIX_THEME = '/felix-bootstrap/felix-theme.css'

let bs6Ready: Promise<void> | null = null

function syncBs6Theme() {
  const dark = document.documentElement.classList.contains('felix-dark')
  document.querySelectorAll<HTMLElement>('.felix-bs6').forEach((root) => {
    root.setAttribute('data-bs-theme', dark ? 'dark' : 'light')
  })
}

function loadBs6(): Promise<void> {
  if (bs6Ready) return bs6Ready
  bs6Ready = new Promise((resolve, reject) => {
    if (!document.querySelector('link[data-felix-bs6-css]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = BS6_CSS
      link.integrity = BS6_CSS_SRI
      link.crossOrigin = 'anonymous'
      link.dataset.felixBs6Css = '1'
      document.head.appendChild(link)
    }
    if (!document.querySelector('link[data-felix-bs6-theme]')) {
      const theme = document.createElement('link')
      theme.rel = 'stylesheet'
      theme.href = FELIX_THEME
      theme.dataset.felixBs6Theme = '1'
      document.head.appendChild(theme)
    }
    const done = () => {
      syncBs6Theme()
      resolve()
    }
    if (document.querySelector('script[data-felix-bs6-js]')) {
      done()
      return
    }
    const script = document.createElement('script')
    script.type = 'module'
    script.dataset.felixBs6Js = '1'
    script.textContent = `import * as Bs from "${BS6_JS}";window.__felixBs6=Bs;document.dispatchEvent(new CustomEvent("felix-bs6-ready"));`
    script.onerror = () => reject(new Error('Felix BS6 bundle failed to load'))
    document.head.appendChild(script)
    document.addEventListener('felix-bs6-ready', () => done(), { once: true })
  })
  return bs6Ready
}

function initBs6Widgets(root: ParentNode) {
  const Bs = (window as Window & { __felixBs6?: Record<string, unknown> }).__felixBs6
  if (!Bs) return
  const Dropdown = Bs.Dropdown as { getOrCreateInstance: (el: Element) => void }
  const Toast = Bs.Toast as { getOrCreateInstance: (el: Element) => void }
  const Alert = Bs.Alert as { getOrCreateInstance: (el: Element) => void }
  root.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((el) => {
    try {
      Dropdown?.getOrCreateInstance(el)
    } catch {
      /* preview-only */
    }
  })
  root.querySelectorAll('.toast[role="alert"]').forEach((el) => {
    try {
      Toast?.getOrCreateInstance(el)
    } catch {
      /* static demos */
    }
  })
  root.querySelectorAll('.alert-dismissible').forEach((el) => {
    try {
      Alert?.getOrCreateInstance(el)
    } catch {
      /* static demos */
    }
  })
}

export function mountFelixBs6() {
  const blocks = document.querySelectorAll('.felix-bs6')
  if (!blocks.length) return
  void loadBs6().then(() => {
    syncBs6Theme()
    blocks.forEach((b) => initBs6Widgets(b))
  })
}

export function watchFelixBs6Theme() {
  syncBs6Theme()
}
