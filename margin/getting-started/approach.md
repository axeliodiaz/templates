---
pageClass: margin-scoped-guide
---
<script setup>
import MarginBs6Doc from '../../.vitepress/theme/MarginBs6Doc.vue'
</script>

# Approach

Margin keeps Bootstrap markup and layers design tokens:

1. **Bootstrap 6** — scoped via `@scope (.b2-bs6)` in `batch2-bs6.bootstrap.css`
2. **Lab tokens** — `--bg`, `--surface`, `--ink`, `--line`, `--soft`, accent `#6389ea`
3. **Dashboard** — `.margin` analytics shell on [/margin/analytics](/margin/analytics)

Do not fork component class names — adapt tokens and previews instead.

<MarginBs6Doc area="getting-started" slug="approach" label="Approach" />
