---
aside: false
---
<script setup>
import SankeyFunnel from './.vitepress/theme/SankeyFunnel.vue'
// Original code and fictitious data. Pattern credit: live Sankey conversion journey posted by @shuxer. No code, brand or assets copied.
</script>

<div class="tj-dark">
<SankeyFunnel title="Trial journey" />
</div>

## Use this template

- `SankeyFunnel.vue` is the reusable component. It reads your template's `--vp-c-*` tokens, so it matches any theme. This page only sets a dark token set around it.
- Replace `ranges` in the component with your own stage counts. Each flow value comes from the node it leads to (or its channel for sign-ups), so totals add up.
- The layout is plain SVG computed in script. Add a stage by adding a column and its links.
- Motion: ribbons and cards fade in on range change, particles run on one `requestAnimationFrame` loop, and everything stops on unmount or when `prefers-reduced-motion` is on.
- Every template page has a "Conversion funnel (Sankey)" section using the same component.
- Keep the data source outside the component. This page never calls an analytics API.

<style>
.tj-dark{--vp-c-bg:#0f1115;--vp-c-bg-soft:#171a20;--vp-c-divider:#2a2f3a;--vp-c-text-1:#e8eaf0;--vp-c-text-2:#8b93a4;--vp-c-text-3:#5c6475;--vp-c-default-soft:#252a35;--vp-c-brand-1:#8aa4ff;max-width:1000px;margin:24px auto}
</style>
