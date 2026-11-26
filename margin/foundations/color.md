---
pageClass: margin-scoped-guide
---
<script setup>
import MarginGuidePreview from '../../.vitepress/theme/MarginGuidePreview.vue'
import MarginColorSwatchGrid from '../../.vitepress/theme/MarginColorSwatchGrid.vue'

const labLight = [
  { label: '--bg', value: '#f5f5f7', bg: '#f5f5f7' },
  { label: '--surface', value: '#ffffff', bg: '#ffffff' },
  { label: '--ink', value: '#22252b', bg: '#22252b' },
  { label: '--muted', value: '#676e7b', bg: '#676e7b' },
  { label: '--line', value: '#e0e3e9', bg: '#e0e3e9' },
  { label: '--soft', value: '#eceef5', bg: '#eceef5' },
  { label: 'accent', value: '#6389ea', bg: '#6389ea' },
]

const labDark = [
  { label: '--bg', value: '#181b22', bg: '#181b22' },
  { label: '--surface', value: '#242833', bg: '#242833' },
  { label: '--ink', value: '#f1f3f8', bg: '#f1f3f8' },
  { label: '--muted', value: '#aab3c3', bg: '#aab3c3' },
  { label: '--line', value: '#404757', bg: '#404757' },
  { label: '--soft', value: '#303747', bg: '#303747' },
  { label: 'accent', value: '#6389ea', bg: '#6389ea' },
]
</script>

# Color

Canonical `.lab` tokens with accent `#6389ea`, plus semantic support colors for status and loss on the dashboard. Swatch labels pick light or dark text automatically so contrast stays at WCAG AA in the preview frame (including when you toggle **Dark preview**).

## Light palette

<MarginGuidePreview label="Light tokens">
  <MarginColorSwatchGrid :swatches="labLight" />
</MarginGuidePreview>

## Dark palette

<MarginGuidePreview label="Dark tokens">
  <MarginColorSwatchGrid :swatches="labDark" />
</MarginGuidePreview>

```css
.lab{
  --bg:#f5f5f7;--surface:#fff;--ink:#22252b;--muted:#676e7b;--line:#e0e3e9;--soft:#eceef5;
}
.lab-dark{
  --bg:#181b22;--surface:#242833;--ink:#f1f3f8;--muted:#aab3c3;--line:#404757;--soft:#303747;
}
```

## Usage

Fictitious sample data only. Wire your own API, authorization, and persistence before production.

## Accessibility

Test keyboard focus, visible rings (`outline: 2px solid #6389ea; outline-offset: 3px`), and `prefers-reduced-motion` alongside light and dark previews.