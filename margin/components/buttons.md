---
pageClass: margin-scoped-guide
---
<script setup>
import MarginGuidePreview from '../../.vitepress/theme/MarginGuidePreview.vue'
</script>

# Buttons

Dashboard `.mg-*` buttons and homepage `.btn.btn-outline.theme-primary` from the batch2 adapter.
<MarginGuidePreview label="Button families">
<div class="margin" style="display:flex;flex-wrap:wrap;gap:8px;padding:12px;border:1px solid #e0e3e9;border-radius:12px;background:#f5f5f7">
<button type="button" class="mg-primary">Save scenario</button>
<button type="button" class="mg-light">Light mode</button>
<button type="button" class="mg-chip">Export</button>
<button type="button" class="mg-link">View job</button>
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
