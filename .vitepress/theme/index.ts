import { h, nextTick, watchEffect } from 'vue'
import DefaultTheme from 'vitepress/theme'
import TemplateSideDrawer from './TemplateSideDrawer.vue'
import { inBrowser, useRoute } from 'vitepress'
import './batch2-bs6.bootstrap.css'
import './bastion-bs6.bootstrap.css'
import './relay-bs6.bootstrap.css'
import './bastion.css'
import './custom.css'
import './mail-buttons.css'
import './felix-dark.css'
import './messaging.css'
import './calendar.css'
import './projects.css'
import './pulsefit.css'
import './pulsefit-dark.css'
import './scopecraft.css'
import './scopecraft-dark.css'
import './lumen.css'
import './lumen-dark.css'
import './lumen-bs6.css'
import './lustro-light.css'
import './chrome.css'
import './bsx.css'
import './bsx-live.css'
import './tpl-live.css'
import './cartsum.css'
import './component-catalog.css'
import './dependency-graph.css'
import './process-graph.css'
import './task-cards.css'
import './node-flow.css'
import './template-motion.css'
import './reference-dashboards.css'
import './margin.css'
import './evertrue.css'
import './pulse-dashboard.css'
import './crestway-dashboard.css'
import './studio-systems.css'
import './ejemplos.css'
import './tpl-shell.css'
import './tpl-themes.css'
import './pawprint.css'
import './pace-system.css'
import './batch2-bs6.css'
import './relay.css'
import { mountFelixDemos } from './felix-demos'
import { mountCartMotion } from './cartmotion'
import { mountLumenMotion } from './lumenmotion'
import { mountLumenBs6 } from './lumen-bs6'
import { mountBsxLive } from './bsx-live'
import { mountTplLive } from './tpl-live'
import { mountTemplateMotion } from './template-motion'
import { initNewRelicBrowser } from './newrelic-browser'
import { pageThemeFor } from './page-themes'
import { mountChartMotion } from './chart-motion'

const MOON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
const SUN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'

function paintThemeBtn(btn: HTMLButtonElement, dark: boolean) {
  btn.innerHTML = dark ? SUN : MOON
  btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode')
  btn.title = dark ? 'Light mode' : 'Dark mode'
  btn.setAttribute('aria-pressed', String(dark))
}

const THEME_KEY = 'felix-theme'

function applyFelixTheme(dark: boolean) {
  document.documentElement.classList.toggle('felix-dark', dark)
  const btn = document.querySelector<HTMLButtonElement>('.fx-theme-toggle')
  if (btn) {
    paintThemeBtn(btn, dark)
  }
}

function syncFelixTheme() {
  let btn = document.querySelector<HTMLButtonElement>('.fx-theme-toggle')
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'fx-theme-toggle'
    btn.addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('felix-dark')
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
      applyFelixTheme(dark)
    })
    document.body.appendChild(btn)
  }
  applyFelixTheme(localStorage.getItem(THEME_KEY) === 'dark')
}

const LMN_KEY = 'lumen-theme'

function applyLumenTheme(dark: boolean) {
  document.documentElement.classList.toggle('lmn-dark', dark)
  const btn = document.querySelector<HTMLButtonElement>('.lmn-theme-toggle')
  if (btn) {
    paintThemeBtn(btn, dark)
  }
  document.querySelectorAll<HTMLElement>('.lmn-bs6').forEach((root) => {
    root.dataset.bsTheme = dark ? 'dark' : 'light'
  })
}

function syncLumenTheme() {
  let btn = document.querySelector<HTMLButtonElement>('.lmn-theme-toggle')
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'lmn-theme-toggle'
    btn.addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('lmn-dark')
      localStorage.setItem(LMN_KEY, dark ? 'dark' : 'light')
      applyLumenTheme(dark)
    })
    document.body.appendChild(btn)
  }
  applyLumenTheme(localStorage.getItem(LMN_KEY) === 'dark')
}

const SC_KEY = 'scopecraft-theme'

function applyScopecraftTheme(dark: boolean) {
  document.documentElement.classList.toggle('sc-dark', dark)
  const btn = document.querySelector<HTMLButtonElement>('.sc-theme-toggle')
  if (btn) {
    paintThemeBtn(btn, dark)
  }
}

function syncScopecraftTheme() {
  let btn = document.querySelector<HTMLButtonElement>('.sc-theme-toggle')
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'sc-theme-toggle'
    btn.addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('sc-dark')
      localStorage.setItem(SC_KEY, dark ? 'dark' : 'light')
      applyScopecraftTheme(dark)
    })
    document.body.appendChild(btn)
  }
  applyScopecraftTheme(localStorage.getItem(SC_KEY) === 'dark')
}

const PF_KEY = 'pulsefit-theme'

function applyPulsefitTheme(dark: boolean) {
  document.documentElement.classList.toggle('pf-dark', dark)
  const btn = document.querySelector<HTMLButtonElement>('.pf-theme-toggle')
  if (btn) {
    paintThemeBtn(btn, dark)
  }
}

function syncPulsefitTheme() {
  let btn = document.querySelector<HTMLButtonElement>('.pf-theme-toggle')
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'pf-theme-toggle'
    btn.addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('pf-dark')
      localStorage.setItem(PF_KEY, dark ? 'dark' : 'light')
      applyPulsefitTheme(dark)
    })
    document.body.appendChild(btn)
  }
  applyPulsefitTheme(localStorage.getItem(PF_KEY) === 'dark')
}

const PW_KEY = 'pawprint-theme'

function applyPawprintTheme(dark: boolean) {
  document.documentElement.classList.toggle('pp-dark', dark)
  const btn = document.querySelector<HTMLButtonElement>('.pp-theme-toggle')
  if (btn) {
    paintThemeBtn(btn, dark)
  }
}

function syncPawprintTheme() {
  let btn = document.querySelector<HTMLButtonElement>('.pp-theme-toggle')
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'pp-theme-toggle'
    btn.addEventListener('click', () => {
      const dark = !document.documentElement.classList.contains('pp-dark')
      localStorage.setItem(PW_KEY, dark ? 'dark' : 'light')
      applyPawprintTheme(dark)
    })
    document.body.appendChild(btn)
  }
  applyPawprintTheme(localStorage.getItem(PW_KEY) === 'dark')
}

const LU_KEY = 'lustro-theme'

function applyLustroTheme(light: boolean) {
  document.documentElement.classList.toggle('lu-light', light)
  const btn = document.querySelector<HTMLButtonElement>('.lu-theme-toggle')
  if (btn) {
    paintThemeBtn(btn, !light)
  }
}

function syncLustroTheme() {
  let btn = document.querySelector<HTMLButtonElement>('.lu-theme-toggle')
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'lu-theme-toggle'
    btn.addEventListener('click', () => {
      const light = !document.documentElement.classList.contains('lu-light')
      localStorage.setItem(LU_KEY, light ? 'light' : 'dark')
      applyLustroTheme(light)
    })
    document.body.appendChild(btn)
  }
  applyLustroTheme(localStorage.getItem(LU_KEY) === 'light')
}


let fxMotion: ReturnType<typeof mountChartMotion> | undefined
function mountFxCharts() {
  fxMotion?.destroy(); fxMotion = undefined
  document.querySelector('.fx-replay')?.remove()
  const root = document.querySelector('.fx-charts')
  if (!root) return
  fxMotion = mountChartMotion(root, '.fx-chart')
  const b = document.createElement('button')
  b.type = 'button'; b.className = 'fx-replay'; b.textContent = 'Replay motion'
  b.addEventListener('click', () => fxMotion?.replay())
  root.parentElement?.insertBefore(b, root)
}
function syncPageTheme(id: string | undefined, defaultDark = false) {
  const root = document.documentElement
  if (!id) {
    root.removeAttribute('data-tpl'); root.classList.remove('tpl-dark')
    document.querySelector('.tpl-theme-toggle')?.remove()
    return
  }
  root.setAttribute('data-tpl', id)
  const key = 'tpl-theme-' + id
  let btn = document.querySelector<HTMLButtonElement>('.tpl-theme-toggle')
  const apply = (dark: boolean) => {
    root.classList.toggle('tpl-dark', dark)
    if (btn) paintThemeBtn(btn, dark)
  }
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'tpl-theme-toggle'
    btn.addEventListener('click', () => {
      const dark = !root.classList.contains('tpl-dark')
      localStorage.setItem('tpl-theme-' + (root.getAttribute('data-tpl') || ''), dark ? 'dark' : 'light')
      apply(dark)
    })
    document.body.appendChild(btn)
  }
  const saved = localStorage.getItem(key)
  apply(saved ? saved === 'dark' : defaultDark)
}

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (inBrowser) {
      void initNewRelicBrowser()
    }
  },
  Layout() {
    const route = useRoute()
    if (inBrowser) {
      watchEffect(() => {
        const onFelix = route.path === '/felix' || route.path.startsWith('/felix/')
        document.documentElement.classList.toggle('felix', onFelix)
        const p = route.path
        const m = (b: string) => p === b || p.startsWith(b + '/')
        document.documentElement.classList.toggle('tpl-pf', m('/pulsefit'))
        document.documentElement.classList.toggle('tpl-sc', m('/scopecraft'))
        document.documentElement.classList.toggle('tpl-lmn', m('/lumen'))
        document.documentElement.classList.toggle('tpl-pp', m('/pawprint'))
        document.documentElement.classList.toggle('relay-dash', p === '/relay/overview' || p === '/relay/overview.html')
        nextTick(() => setTimeout(mountBsxLive, 80))
        nextTick(() => setTimeout(() => mountTplLive(route.path), 80))
        if (route.path.endsWith('/cart-summary') || route.path.endsWith('/lustro')) nextTick(() => setTimeout(mountCartMotion, 50))
        if (route.path.startsWith('/lumen/')) nextTick(() => setTimeout(mountLumenMotion, 50))
        if (m('/lumen')) nextTick(() => setTimeout(mountLumenBs6, 60))
        if (m('/lumen') || p === '/lumen') syncLumenTheme()
        else document.documentElement.classList.remove('lmn-dark')
        const pageTheme = pageThemeFor(p)
        syncPageTheme(pageTheme?.id, pageTheme?.defaultDark)
        const onLustro = !(m('/felix') || m('/pulsefit') || m('/scopecraft') || m('/lumen') || m('/pawprint') || pageTheme)
        document.documentElement.classList.toggle('tpl-lu', onLustro)
        if (onLustro) syncLustroTheme()
        else document.documentElement.classList.remove('lu-light')
        if (m('/pulsefit')) syncPulsefitTheme()
        else document.documentElement.classList.remove('pf-dark')
        if (m('/pawprint')) syncPawprintTheme()
        else document.documentElement.classList.remove('pp-dark')
        if (m('/scopecraft')) {
          syncScopecraftTheme()
          void import('./scopecraft-bs6.css')
        } else document.documentElement.classList.remove('sc-dark')
        if (onFelix) syncFelixTheme()
        if (onFelix) nextTick(() => mountFelixDemos())
        nextTick(() => setTimeout(mountTemplateMotion, 120))
        nextTick(() => setTimeout(mountFxCharts, 150))
      })
    }
    return h(DefaultTheme.Layout, null, { 'doc-after': () => h(TemplateSideDrawer, { key: route.path }) })
  }
}
