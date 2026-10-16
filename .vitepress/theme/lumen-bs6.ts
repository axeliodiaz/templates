const BS6_CSS =
  'https://cdn.jsdelivr.net/npm/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css'
const BS6_CSS_SRI = 'sha384-B/GM4XqrwHnWXNOWMbloTmrYXZg10cakYGmpfsR/bbzQ6JAJI4ihuyADKLnBgrCe'
const THEME_HREF = '/lumen-template/lumen-theme.css'

let cssLoaded = false

function ensureBootstrapCss() {
  if (cssLoaded || document.getElementById('lmn-bs6-bootstrap')) return
  const link = document.createElement('link')
  link.id = 'lmn-bs6-bootstrap'
  link.rel = 'stylesheet'
  link.href = BS6_CSS
  link.integrity = BS6_CSS_SRI
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
  const theme = document.createElement('link')
  theme.id = 'lmn-bs6-theme'
  theme.rel = 'stylesheet'
  theme.href = THEME_HREF
  document.head.appendChild(theme)
  cssLoaded = true
}

function syncBs6Theme() {
  const dark = document.documentElement.classList.contains('lmn-dark')
  document.querySelectorAll<HTMLElement>('.lmn-bs6').forEach((root) => {
    root.dataset.bsTheme = dark ? 'dark' : 'light'
  })
}

export function mountLumenBs6() {
  if (!document.querySelector('.lmn-bs6')) return
  ensureBootstrapCss()
  syncBs6Theme()
}
