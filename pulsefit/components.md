---
outline: false
---
<script setup>
import ComponentCatalog from '../.vitepress/theme/ComponentCatalog.vue'
</script>

# Pulsefit component catalog

A Bootstrap-style UI-kit reference in the Pulsefit visual language. Every family has usage, a live preview, copyable markup and keyboard notes. All data and actions are fictitious and local; no backend is called. The existing component pages remain available.

<ComponentCatalog language="pulsefit" />

## Production checklist

Keep labels, validation, focus, loading and disabled states. Test keyboard and screen-reader behavior. Toasts are short confirmations; alerts persist; notifications are an event history. Replace local demo logic with validated application actions. Markup is Vue and uses the state/functions in the shared ComponentCatalog.vue source, not an installed UI package.
