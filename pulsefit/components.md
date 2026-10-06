---
outline: false
---
<script setup>
import ComponentCatalog from '../.vitepress/theme/ComponentCatalog.vue'
import NavbarDemo from '../.vitepress/theme/NavbarDemo.vue'
</script>

# Pulsefit component catalog

A Bootstrap-style UI-kit reference in the Pulsefit visual language. Every family has usage, a live preview, copyable markup and keyboard notes. All data and actions are fictitious and local; no backend is called. The existing component pages remain available.

<ComponentCatalog language="pulsefit" />

## Navbar variants

Three treatments of the same navigation: default, tinted and inverted. It has a dropdown, search and a collapse button under 700 px. Menus animate in with Motion and stay still with reduced motion. More Bootstrap-set components (accordion, offcanvas, carousel, tables and more) are on [Components, more](./components-more).

<NavbarDemo theme="pulsefit" />

## Production checklist

Keep labels, validation, focus, loading and disabled states. Test keyboard and screen-reader behavior. Toasts are short confirmations; alerts persist; notifications are an event history. Replace local demo logic with validated application actions. Markup is Vue and uses the state/functions in the shared ComponentCatalog.vue source, not an installed UI package.
