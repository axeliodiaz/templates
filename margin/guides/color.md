---
pageClass: margin-scoped-guide
---
<script setup>
import MarginGuidePreview from '../../.vitepress/theme/MarginGuidePreview.vue'
</script>

# Color

Canonical `.lab` tokens with accent `#6389ea`, plus semantic support colors for status and loss.
<MarginGuidePreview label="Light tokens">
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px">
<div style="background:#f5f5f7;border:1px solid #e0e3e9;padding:12px;border-radius:8px"><small>--bg</small><strong>#f5f5f7</strong></div>
<div style="background:#6389ea;color:#0f1528;padding:12px;border-radius:8px"><small>accent</small><strong>#6389ea</strong></div>
<div style="background:#22252b;color:#f1f3f8;padding:12px;border-radius:8px"><small>--ink</small><strong>#22252b</strong></div>
</div>
</MarginGuidePreview>

```html
<!-- Representative markup; see /margin/analytics for the full shell -->
<div class="margin lab-dark">…</div>
```


## Usage

Fictitious sample data only. Wire your own API, authorization, and persistence before production.

## Accessibility

Test keyboard focus, visible rings (`outline: 2px solid #6389ea; outline-offset: 3px`), and `prefers-reduced-motion` alongside light and dark previews.
