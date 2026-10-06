---
aside: false
pageClass: pf-page
---

<script setup>
import OpsDashboard from '../.vitepress/theme/OpsDashboard.vue'
</script>

# Operations dashboard

An operations center with system health and uptime, based on the NexaFlow concept (https://x.com/iammuhammadmuiz/status/2106788895979704383): sidebar, search and date range, four KPI cards with sparklines, workflow performance (success rate line over run volume, hover readout), recent activity, recent workflows table with status pills, a 99.8% uptime ring with per-service health, and quick actions. Themed for PulseFit. Entrance, bars and the uptime ring animate with Motion and stay still with reduced motion. Fictitious data.

<OpsDashboard theme="pulsefit" />

## Anatomy

| Part | Notes |
|---|---|
| KPI cards | Icon, label, value, change and a seven-point sparkline |
| Performance chart | Success rate line on run-volume bars; each point is focusable and reads out date, rate and runs |
| System health | Uptime ring plus one row per service with a Healthy, Degraded or Down state |
| Recent workflows | Name, trigger, last run, status pill (text plus color) and duration |
| Quick actions | Three shortcuts with a title and a hint |
