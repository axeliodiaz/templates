import { h, nextTick, watchEffect } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
import './custom.css'
import { mountFelixDemos } from './felix-demos'

export default {
  extends: DefaultTheme,
  Layout() {
    const route = useRoute()
    if (inBrowser) {
      watchEffect(() => {
        const onFelix = route.path === '/felix' || route.path.startsWith('/felix/')
        document.documentElement.classList.toggle('felix', onFelix)
        if (onFelix) nextTick(() => mountFelixDemos())
      })
    }
    return h(DefaultTheme.Layout)
  }
}
