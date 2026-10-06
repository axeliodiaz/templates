import { h, nextTick, watchEffect } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
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
import './chrome.css'
import './bsx.css'
import './bsx-live.css'
import './tpl-live.css'
import './cartsum.css'
import './component-catalog.css'
import './dependency-graph.css'
import './node-flow.css'
import './ejemplos.css'
import { mountFelixDemos } from './felix-demos'
import { mountCartMotion } from './cartmotion'
import { mountLumenMotion } from './lumenmotion'
import { mountBsxLive } from './bsx-live'
import { mountTplLive } from './tpl-live'

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

export default {
  extends: DefaultTheme,
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
        nextTick(() => setTimeout(mountBsxLive, 80))
        nextTick(() => setTimeout(() => mountTplLive(route.path), 80))
        if (route.path.endsWith('/cart-summary') || route.path.endsWith('/lustro')) nextTick(() => setTimeout(mountCartMotion, 50))
        if (route.path.startsWith('/lumen/')) nextTick(() => setTimeout(mountLumenMotion, 50))
        if (m('/lumen') || p === '/lumen') syncLumenTheme()
        else document.documentElement.classList.remove('lmn-dark')
        if (m('/pulsefit')) syncPulsefitTheme()
        else document.documentElement.classList.remove('pf-dark')
        if (m('/scopecraft')) syncScopecraftTheme()
        else document.documentElement.classList.remove('sc-dark')
        if (onFelix) syncFelixTheme()
        if (onFelix) nextTick(() => mountFelixDemos())
      })
    }
    return h(DefaultTheme.Layout)
  }
}


