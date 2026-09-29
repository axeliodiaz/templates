import { h, watchEffect } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout() {
    const route = useRoute()
    if (inBrowser) {
      watchEffect(() => {
        document.documentElement.classList.toggle(
          'felix',
          route.path === '/felix' || route.path.startsWith('/felix/')
        )
      })
    }
    return h(DefaultTheme.Layout)
  }
}
