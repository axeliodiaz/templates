---
pageClass: margin-scoped-guide
---
<script setup>
import MarginGuidePreview from '../../.vitepress/theme/MarginGuidePreview.vue'
</script>

# Cards

`.mg-card`, `.mg-card-head`, and homepage `.lab-card`.
<MarginGuidePreview label="Cards">
<article class="mg-card" style="max-width:360px"><div class="mg-card-head"><h3>Estimate vs actual</h3></div><p class="mg-note">Sample card body with fictitious data.</p></article>
</MarginGuidePreview>

```html
<!-- Representative markup; see /margin/analytics for the full shell -->
<div class="margin lab-dark">…</div>
```


## Usage

Fictitious sample data only. Wire your own API, authorization, and persistence before production.

## Accessibility

Test keyboard focus, visible rings (`outline: 2px solid #6389ea; outline-offset: 3px`), and `prefers-reduced-motion` alongside light and dark previews.
