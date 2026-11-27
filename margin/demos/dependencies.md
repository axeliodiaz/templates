---
pageClass: margin-scoped-guide
---
<script setup>
import DependencyGraph from '../../.vitepress/theme/DependencyGraph.vue'
import MarginDemoShell from '../../.vitepress/theme/margin-demos/MarginDemoShell.vue'
const usage = '<DependencyGraph scenario="launch" />'
</script>

# Dependency graph

Studio example from the Felix catalog, restyled with Margin tokens (`#6389ea`, `#f5f5f7`, system UI). Fictitious data only.

<MarginDemoShell :copy="usage">
  <DependencyGraph scenario="launch" />
</MarginDemoShell>

[Demos index](/margin/demos/)
