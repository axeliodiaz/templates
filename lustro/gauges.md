---
---

<script setup>
import GaugeLab from '../.vitepress/theme/GaugeLab.vue'
</script>

# Gauges

Composable SVG gauges based on Gauge UI (https://gauge-ui.dev, shown at https://x.com/alibey_10/status/2106318684184887630): eight presets (simple arc, speedometer with a redline, fuel, temperature, progress ring, power meter, battery, CPU load) and a live playground with value, range, start and end angle, track width, ticks, mode and cap controls. Themed for Lustro. The needle and arc move with a Motion spring and stay still with reduced motion. Rebuilt in Vue and SVG, not the original React package. Demo values only.

## Presets and playground

<GaugeLab theme="lustro" />

## Anatomy and props

| Prop | Notes |
|---|---|
| value, min, max | Value and range; the value is clamped |
| start, end | Angles in degrees from 12 o'clock, clockwise (default -135 to 135; 0 to 360 gives a ring) |
| mode | arc, needle or both |
| ticks, labels | Tick count and label list spread across the sweep |
| zones | Colored bands on the outer edge, and the arc color follows the zone the value is in |
| width, cap | Track thickness and round or butt ends |
| unit, label, decimals | Text under the value and the caption |
| Accessibility | role img with the value and range as its label; controls are native inputs |
