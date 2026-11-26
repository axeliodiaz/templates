---
pageClass: margin-scoped-guide
---
<script setup>
import MarginGuidePreview from '../../.vitepress/theme/MarginGuidePreview.vue'
</script>

# Typography

Product **type roles** for Margin: system-ui on the homepage `.lab`, DM Sans and Space Grotesk on the analytics `.margin` shell, safe stacks in email. For Bootstrap Reboot defaults, heading scale, and prose patterns inside `.lab`, see [Content → Typography](/margin/content/typography).

<MarginGuidePreview label="Live classes"><p class="mg-note">See the product demo for the full interactive pattern: <a href="/margin/analytics">Analytics</a> or <a href="/margin">Overview</a>.</p></MarginGuidePreview>

```html
<!-- Representative markup; see /margin/analytics for the full shell -->
<div class="margin lab-dark">…</div>
```


## Usage

Fictitious sample data only. Wire your own API, authorization, and persistence before production.

## Accessibility

Test keyboard focus, visible rings (`outline: 2px solid #6389ea; outline-offset: 3px`), and `prefers-reduced-motion` alongside light and dark previews.
