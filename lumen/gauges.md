---
pageClass: lmn-page
---

<script setup>
import TradingPanel from '../.vitepress/theme/TradingPanel.vue'
import GaugeLab from '../.vitepress/theme/GaugeLab.vue'
</script>

# Gauges

Composable SVG gauges based on Gauge UI (https://gauge-ui.dev, shown at https://x.com/alibey_10/status/2106318684184887630): eight presets (simple arc, speedometer with a redline, fuel, temperature, progress ring, power meter, battery, CPU load) and a live playground with value, range, start and end angle, track width, ticks, mode and cap controls. Themed for Lumen. The needle and arc move with a Motion spring and stay still with reduced motion. Rebuilt in Vue and SVG, not the original React package. Demo values only.

## Presets and playground

<GaugeLab theme="lumen" />

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

## Plain-browser export

The same gauge is available without Vue or a build step. [Open the native demo](/lumen-template/gauge-demo.html). The demo has arc, needle and combined modes, live value updates and a theme toggle.

Load `public/lumen-template/lumen-gauge.css` and import `createLumenGauge` from `public/lumen-template/lumen-gauge.js`. For CDN use, replace `COMMIT_SHA` below with a reviewed full commit SHA from this repository, not `main`. Both assets must use the same SHA. Motion is pinned to 14.9.0 and imported from jsDelivr only when motion is allowed; allow that host in your content security policy. An unavailable Motion import falls back to the final value.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/axeliodiaz/templates@COMMIT_SHA/public/lumen-template/lumen-gauge.css">
<div id="load-gauge"></div>
<script type="module">
import { createLumenGauge } from 'https://cdn.jsdelivr.net/gh/axeliodiaz/templates@COMMIT_SHA/public/lumen-template/lumen-gauge.js';
const gauge = createLumenGauge(document.querySelector('#load-gauge'), {
  value: 62, min: 0, max: 100, mode: 'both', ticks: 10,
  label: 'CPU load', unit: '%', zones: [{ from: 85, to: 100, color: '#d23b3b' }]
});
await gauge.ready;
await gauge.update({ value: 91 });
// When removing the view: gauge.destroy();
</script>
```

`createLumenGauge(host, props)` returns `{ element, ready, update, destroy }`. All props in the table above are supported, plus `size` (180 px by default). `update` accepts partial props and returns a promise that settles when the animation finishes or is replaced. Rapid updates cancel the previous spring; `destroy` stops it and removes only the mounted figure. Values are clamped to the range, including accessible text. Equal min/max is supported; reversed ranges, non-finite numbers and invalid modes are rejected. Labels are plain text, never HTML.

The export uses the same spring settings as the Vue gauge (stiffness 90, damping 14). Reduced motion skips the import and jumps to the final value, including when the preference changes. It reads inherited Lumen tokens (`--ink`, `--muted`, `--bd`, `--purple`) or explicit `--g-ink`, `--g-mut`, `--g-track`, `--g-pri`, `--g-font` overrides. Standalone light/dark defaults work with `.dark`, `.lmn-dark`, `data-theme="dark"` or `data-bs-theme="dark"` on an ancestor. Needle-mode readout sits below the scale to keep end labels readable.

This export does not change Finances or Studio. Their adoption and production validation are separate work.

## Trading panel

Big balance, an open position with entry, take-profit and liquidation levels, a leverage multiplier and an equity curve. Switch market, side and range, pause the live ticks, close or reopen the position. It reads this template's theme tokens, and motion stops with reduced motion. Fictitious paper account.

<TradingPanel />
