---
outline: false
---
<script setup>
import ComponentCatalog from '../.vitepress/theme/ComponentCatalog.vue'
import LangSelect from '../.vitepress/theme/LangSelect.vue'
</script>

# Lustro component catalog

The full UI catalog in Lustro's visual language. Every family includes usage, live previews, implementation markup and keyboard notes. Motion is part of the language: surfaces rise, the primary action glows, and reduced motion turns movement off. Details are in [Lustro motion](/lustro#motion). All actions use fictitious data and local state; no backend is called.

For the 52-section Bootstrap reference and its variants, see [the expanded component set](./components-more). The [original interactive guide](../components) remains available.

## Language select

<LangSelect theme="lustro" />

<ComponentCatalog language="lustro" />

## Production checklist

Keep labels, validation, focus, loading and disabled states. Test keyboard and screen-reader behavior. Replace local demo logic with validated application actions. Markup is Vue and uses the shared ComponentCatalog source, not an installed UI package.
