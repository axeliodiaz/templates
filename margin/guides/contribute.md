---
pageClass: margin-scoped-guide
---
<script setup>
import MarginBs6Doc from '../../.vitepress/theme/MarginBs6Doc.vue'
</script>

# Contribute

## Regenerate the Margin BS6 tree

```bash
node scripts/scaffold-margin-bs6-ia.mjs
node scripts/patch-margin-sidebar.mjs
node scripts/build-margin-bs6-catalog.mjs
node scripts/build-margin-bs6-copy.mjs
```

## Guardrails

- `node scripts/check-merge-markers.mjs` runs at the start of `npm run build` — never commit conflict markers.
- Run `npm run test:margin-projects:a11y` when touching `margin.css` or dashboard tokens.

## Copy blocks

Per-page markup is generated in `margin-bs6-copy.ts` from catalog demos and `margin-bs6-prose.ts`.

<MarginBs6Doc area="guides" slug="contribute" label="Contribute" />
