---
aside: false
---
<script setup>
import StudioCatalog from '../.vitepress/theme/StudioCatalog.vue'
</script>

# Relay charts

Sample trends for tool calls, latency, and success. The strokes draw once, then again when a new sample point is appended. Reduced motion shows the finished line.

<StudioCatalog theme="relay" section="charts" />

## In the control room

The overview keeps three sparklines (tool calls, average latency, success rate) and a three-bar split of sample calls: Research 46%, Code 34%, Ops 20%. Each chart has a text alternative. The graph of agents and servers is a layout of links, described in [Layouts](/relay/layouts), not a data series.

No preview reads a live MCP server.
