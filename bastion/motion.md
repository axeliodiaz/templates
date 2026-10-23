---
aside: false
title: Bastion motion
---

<script setup>
import BastionMotion from '../.vitepress/theme/BastionMotion.vue'
</script>

# Motion

Terminal motion is small and functional: a lamp, a caret, a map ping, a meter filling, a sparkline drawing, a log line arriving, and a slow scan across the field. Nothing loops except the lamp, the caret, the ping, and the scan.

<BastionMotion />

## Timing

| Moment | Duration | Notes |
| --- | --- | --- |
| Panel entrance | 450ms | Rise 8px and fade. Stagger about 60ms. Content is visible if animation does not run. |
| Deploy nodes | 400ms | Stagger 80ms along the timeline. |
| CPU and memory bars | 800ms | Width grows to the sample percent. |
| Sparkline | 1.2s | Stroke draw, once. |
| Log line | 350ms | Only the line that just arrived. |
| Status lamp | 2.2s | Opacity blink. The label stays readable. |
| Prompt caret | 1.1s | Steps, amber. |
| Map ping | 2.4s | Ring scales and fades. Cities are staggered. |
| Scan sweep | 7.5s | A faint phosphor band. It does not catch clicks. |
| Buttons | 160ms | Color, and a 1px lift on hover. |

The live tail appends a sample line about every 2.8s unless the operator pauses it or reduced motion is on. Reduced motion holds the tail still so the list does not move on its own.

## Reduced motion

`prefers-reduced-motion: reduce` sets `animation` and `transition` to none on `.bst-root`, including pseudo-elements. Bars jump to their final width. The scan pseudo-element is not created. JavaScript checks the same media query before streaming logs or delaying the scale confirmation. Switching the preference while the page is open stops new tail lines.

Shared docs motion still applies to ordinary prose controls. Bastion’s own lamps and charts are in `bastion.css`, not in a separate opt-in demo.
