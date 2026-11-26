---
pageClass: margin-scoped-guide
---
<script setup>
import MarginBs6Doc from '../../.vitepress/theme/MarginBs6Doc.vue'
</script>

# Migration

Legacy paths redirect in `vercel.json`.

## Path changes

| Old (v5-style) | New (v6) |
| --- | --- |
| `/margin/components/buttons` | `/margin/components/button` |
| `/margin/foundations/*` | `/margin/customize/*` or `/margin/getting-started/*` |

## Markup

Replace unscoped Bootstrap with:

```html
<div class="lab b2-bs6 b2-margin margin-bs6-root kit kit-margin lab-dark">
  <button type="button" class="btn-solid theme-primary">Action</button>
</div>
```

Use `btn-solid` / `btn-outline` with `theme-primary` or `theme-secondary` — not unstyled `.btn` alone.

<MarginBs6Doc area="guides" slug="migration" label="Migration" />
