---
pageClass: margin-scoped-guide
---
<script setup>
import MarginBs6Doc from '../../.vitepress/theme/MarginBs6Doc.vue'
</script>

# Quickstart

Bootstrap-aligned Margin docs mirror [Bootstrap v6 Quickstart](https://getbootstrap.com/docs/6.0/guides/quickstart/). Use this page to drop Margin's scoped Bootstrap 6 kit into a static page or app shell.

## CSS

The site ships scoped Bootstrap 6 CSS as `batch2-bs6.bootstrap.css` plus Margin overrides in `margin-bs6.css` (see the repo `.vitepress/theme/`). For a standalone export, bundle those files with your markup — do not paste the full Lustro catalog.

## Root surface

Wrap every interactive example in:

```html
<div class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin">
  <!-- content -->
</div>
```

Optional dark tokens: add `lab-dark` on the same root (or use the doc **Dark preview** toggle to inspect contrast).

## Starter template

A minimal HTML document loads the kit root and one primary control:

<MarginBs6Doc area="guides" slug="quickstart" label="First controls" />

## Light / dark

Toggle **Dark preview** on any Margin doc page to preview `.lab-dark` token values. In product chrome, keep theme state on `.margin.lab-dark` for analytics (see [Color modes](/margin/customize/color-modes)).

## Next steps

- [Introduction](/margin/getting-started/) — how Margin maps Bootstrap IA
- [Components](/margin/components/button) — catalog demos with copyable markup
- [Customize color](/margin/customize/color) — AA token swatches
