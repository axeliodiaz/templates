import { h, nextTick, watchEffect } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
import './custom.css'
import './mail-buttons.css'
import './felix-dark.css'
import './messaging.css'
import { mountFelixDemos } from './felix-demos'

const THEME_KEY = 'felix-theme'

function applyFelixTheme(dark: boolean) {
  document.documentElement.classList.toggle('felix-dark', dark)
  const btn = document.querySelector<HTMLButtonElement>('.fx-theme-toggle')
  if (btn) {
    btn.textContent = dark ? 'Light mode' : 'Dark mode'
    btn.setAttribute('aria-pressed', String(dark))
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

export default {
  extends: DefaultTheme,
  Layout() {
    const route = useRoute()
    if (inBrowser) {
      watchEffect(() => {
        const onFelix = route.path === '/felix' || route.path.startsWith('/felix/')
        document.documentElement.classList.toggle('felix', onFelix)
        if (onFelix) syncFelixTheme()
        if (onFelix) nextTick(() => mountFelixDemos())
      })
    }
    return h(DefaultTheme.Layout)
  }
}
