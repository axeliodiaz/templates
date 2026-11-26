---
pageClass: margin-scoped-guide
---
<script setup>
import MarginGuidePreview from '../../.vitepress/theme/MarginGuidePreview.vue'
</script>

# Color modes

`.lab-dark`, `html[data-tpl="margin"].tpl-dark`, and the dashboard `.margin.lab-dark` class stay in sync.<p>Use the preview toggle above to verify text stays readable when the site chrome differs from the embedded widget.</p>

```html
<!-- Representative markup; see /margin/analytics for the full shell -->
<div class="margin lab-dark">…</div>
```


## Usage

Fictitious sample data only. Wire your own API, authorization, and persistence before production.

## Accessibility

Test keyboard focus, visible rings (`outline: 2px solid #6389ea; outline-offset: 3px`), and `prefers-reduced-motion` alongside light and dark previews.
