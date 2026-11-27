---
pageClass: margin-scoped-guide
---
<script setup>
import MarginBs6Doc from '../../.vitepress/theme/MarginBs6Doc.vue'
</script>

# CSS variables

Lab tokens on `.lab` map into scoped `--b2-*` Bootstrap variables inside `.b2-margin`. Use `--bg`, `--ink`, `--surface`, and the related lab tokens first, then expose Bootstrap surfaces through the adapter layer.

```css
.lab {
  --bg: #f5f5f7;
  --surface: #fff;
  --ink: #22252b;
  --muted: #676e7b;
  --line: #e0e3e9;
  --soft: #eceef5;
  --accent: #6389ea;
}

.b2-margin {
  --b2-accent: #6389ea;
  --b2-on: #0f1528;
  --b2-bg: var(--bg, #f5f5f7);
  --b2-surface: var(--surface, #fff);
  --b2-ink: var(--ink, #22252b);
  --b2-line: var(--line, #e0e3e9);
}
```

<MarginBs6Doc area="customize" slug="css-variables" label="CSS variables" />