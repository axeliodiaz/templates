// Registry of per-template page themes. A route that matches gets html[data-tpl="<id>"] (see tpl-shell.css, tpl-themes.css).
// Existing templates that ship their own theme files (felix, lumen, pawprint, pulsefit, scopecraft, lustro) are not listed here.
export interface PageTheme { id: string; base: string; defaultDark?: boolean }
export const PAGE_THEMES: PageTheme[] = [
  { id: 'umail', base: '/umail' },
  { id: 'folio', base: '/folio', defaultDark: true },
  { id: 'folio', base: '/trading-panel', defaultDark: true },
  { id: 'spark', base: '/spark', defaultDark: true },
  { id: 'spark', base: '/spark-analytics', defaultDark: true },
  { id: 'fixtrack', base: '/fixtrack' },
  { id: 'crestway', base: '/crestway-financials' },
  { id: 'margin', base: '/margin' },
  { id: 'pace', base: '/fitness' },
  { id: 'pace', base: '/pace' },
  { id: 'cargo', base: '/trade-finance' },
  { id: 'relay', base: '/relay', defaultDark: true },
]
const matches = (path: string, base: string) => path === base || path.startsWith(base + '/')
export function pageThemeFor(path: string): PageTheme | undefined {
  const p = path.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  return PAGE_THEMES.find((t) => matches(p, t.base))
}
export function pageThemeForFile(page: string): PageTheme | undefined {
  const p = '/' + page.replace(/\.md$/, '').replace(/\/index$/, '')
  return PAGE_THEMES.find((t) => matches(p, t.base))
}
