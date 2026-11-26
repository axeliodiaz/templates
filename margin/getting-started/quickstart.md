---
pageClass: margin-scoped-guide
---
<script setup>
import MarginGuidePreview from '../../.vitepress/theme/MarginGuidePreview.vue'
</script>

# Quickstart

Copy tokens and CSS into your own Vue or VitePress shell. No npm package or CDN ships with this repo.
<MarginGuidePreview label="Token shell">
<div class="lab b2-bs6 b2-margin" style="--bg:#f5f5f7;--surface:#fff;--ink:#22252b;--line:#e0e3e9;padding:16px;border-radius:12px;border:1px solid var(--line)">
<strong style="font-size:18px">margin.</strong>
<button class="btn btn-outline theme-primary" type="button">Sample action</button>
</div>
</MarginGuidePreview>

```css
.lab{
  --bg:#f5f5f7;--surface:#fff;--ink:#22252b;--muted:#676e7b;--line:#e0e3e9;--soft:#eceef5;
}
html[data-tpl="margin"]{ /* site chrome tokens */ }
```


## Usage

Fictitious sample data only. Wire your own API, authorization, and persistence before production.

## Accessibility

Test keyboard focus, visible rings (`outline: 2px solid #6389ea; outline-offset: 3px`), and `prefers-reduced-motion` alongside light and dark previews.
