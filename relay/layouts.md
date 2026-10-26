---
aside: false
---
<script setup>
import StudioCatalog from '../.vitepress/theme/StudioCatalog.vue'
</script>

# Relay layouts

The catalog shell below uses the shared studio layout. The control room uses a wider composition: command bar, rail, graph, approvals, metrics, and a feed.

<StudioCatalog theme="relay" section="layouts" />

## Control room

At desktop widths the rail is a column and the main area is a two-column grid: graph beside approvals, metrics beside the feed. Container queries fold that grid as the frame gets narrower. Below 1024px the rail leaves the page and returns as a start drawer opened from the Relay mark. Agent cards stack before server cards do. When the agent cards no longer share a row, the curved edges hide and a sentence lists the same sample links.

The feed wraps timestamps instead of forcing a horizontal scroll. Tables on the Tools view scroll inside `table-responsive`.

[Control room](/relay/overview)
