---
aside: false
title: Bastion ops dashboard
---

<script setup>
import BastionDashboard from '../.vitepress/theme/BastionDashboard.vue'
</script>

# Ops dashboard

The sample Bastion screen: status bar, edge-region latency map, services table, deploy timeline, a resolved incident, a log tail, and an ops-agent suggestion with Approve and Dismiss. Figures match the approved layout. They are not a live cluster.

Change the region, pause the tail, refresh metrics, open an incident or the deploy list (Escape closes it), then approve or dismiss the suggestion. Approving sets worker to 4/4 on this page only.

<BastionDashboard />

## What is on the screen

| Region | Role |
| --- | --- |
| Status bar | Wordmark, `ALL SYSTEMS NOMINAL`, region select, uptime and sparkline |
| Latency map | Dotted field, eight sample cities, legend for &lt;20ms, 20–50ms, and &gt;50ms |
| Services | Status, CPU, memory, replicas. Worker starts at 62% CPU and 2/3 replicas |
| Deploys | Four hashes. `d2e4f6a` is marked Review, not color alone |
| Incident | `INC-2025-0417-03`, resolved sample |
| Log tail | `bastion-ops-agent`, with pause |
| Ops agent | Spanish recommendation, 82% confidence, Approve and Dismiss |

## Responsive

At desktop widths the panels sit in two columns. Around a tablet width, and whenever the frame is under 860px, they stack. The service table scrolls inside its panel on a narrow phone. Status controls wrap instead of forcing the page sideways.
